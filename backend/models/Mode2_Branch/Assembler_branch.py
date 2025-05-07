from ..Mode1_Stack.Assembler_stack import Assembler_Stack

class Assembler_Branch(Assembler_Stack):
    def __init__(self):
        super().__init__()
        self.instruction_map = {
            "LEA": "1",
            "LDR": "2",
            "STR": "3",
            "MOV": "4",
            "ADT": "5",
            "ADF": "6",
            "ORR": "7",
            "AND": "8",
            "XOR": "9",
            "ROT": "A",
            "JMP": "B",
            "HLT": "C",
            "PSH": "D",
            "POP": "E",
            "CAL": "F"
        }

    def assemble(self, assembly_code: str):
        self.assembly_code = assembly_code
        cleaned_code = self.clean(assembly_code)
        machine_code = ["00"] * 256          # full 256-byte memory map

        # ─────────────────────────────
        # Pass 1:  collect label addresses
        # ─────────────────────────────
        label_table, pc = {}, 0
        for line in cleaned_code:
            if ":" in line:                           # label definition
                label_table[line.split(":")[0].strip()] = pc
            else:                                     # every instr == 2 bytes
                pc += 2

        # ─────────────────────────────
        # Pass 2:  encode instructions
        # ─────────────────────────────
        pc = 0
        for i, line in enumerate(cleaned_code, start=1):          # line numbers 1-based
            if ":" in line:                                       # skip label lines
                continue

            mnemonic, *rest = line.strip().split(None, 1)
            operands = rest[0] if rest else ""
            if mnemonic not in self.instruction_map:
                raise Exception(f"Invalid instruction '{mnemonic}' on line {i}")

            opcode = self.instruction_map[mnemonic]

            # ── HLT (no operands) ────────────────────────────────────────────
            if mnemonic == "HLT":
                machine_code[pc]     = opcode + "0"
                machine_code[pc + 1] = "00"
                pc += 2
                continue

            # ── CAL label ────────────────────────────────────────────────────
            if mnemonic == "CAL":
                target = operands.strip()
                if target not in label_table:
                    raise Exception(f"Undefined label '{target}' on line {i}")
                addr = label_table[target]
                machine_code[pc]     = opcode + "0"
                machine_code[pc + 1] = f"{addr:02X}"
                pc += 2
                continue

            # ── POP PC (special) ─────────────────────────────────────────────
            if mnemonic == "POP" and operands.strip().upper() == "PC":
                machine_code[pc]     = opcode + "0"
                machine_code[pc + 1] = "00"
                pc += 2
                continue

            # Split operands and normalise register tokens ("A" or "RA" → "A")
            regs = [tok.strip().upper() for tok in operands.split(",")]
            regs = [tok[1:] if tok.startswith("R") else tok for tok in regs]

            # ░░░░░ Handle two-operand format  (R ,  byte) ░░░░░
            if len(regs) == 2:
                reg, byte = regs
                # validate register
                if not reg.isalnum() or int(reg, 16) > 15:
                    raise Exception(f"Invalid register on line {i}")
                # validate byte operand (0–FF)
                if not byte.isalnum() or int(byte, 16) > 255:
                    raise Exception(f"Invalid byte operand on line {i}")

                machine_code[pc]     = opcode + reg.upper()
                machine_code[pc + 1] = f"{int(byte,16):02X}"
                pc += 2
                continue

            # ░░░░░ Handle three-register format (ADT / ADF / ORR / AND / XOR) ░░░░░
            if mnemonic in ("ADT", "ADF", "ORR", "AND", "XOR") and len(regs) == 3:
                d, s, t = regs
                for r in (d, s, t):
                    if not r.isalnum() or int(r, 16) > 15:
                        raise Exception(f"Invalid register on line {i}")
                machine_code[pc]     = opcode + d.upper()
                machine_code[pc + 1] = f"{int(s,16):X}{int(t,16):X}".lower()
                pc += 2
                continue

            # ░░░░░ Handle MOV (two registers) ░░░░░
            if mnemonic == "MOV" and len(regs) == 2:
                d, s = regs
                for r in (d, s):
                    if not r.isalnum() or int(r, 16) > 15:
                        raise Exception(f"Invalid register on line {i}")
                machine_code[pc]     = opcode + "0"
                machine_code[pc + 1] = f"{int(d,16):X}{int(s,16):X}".lower()
                pc += 2
                continue

            raise Exception(f"Incorrect operand format on line {i}")

        # join everything we actually emitted
        self.machine_code = " ".join(machine_code[:pc]).strip()
        return self.machine_code
