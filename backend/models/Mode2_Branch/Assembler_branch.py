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
        machine_code = ["00"] * 256  # full memory map

        label_table = {}
        current_address = 0

        # First pass: build label table with corrected byte size
        for line in cleaned_code:
            if ':' in line:
                label = line.split(':')[0].strip()
                label_table[label] = current_address
            else:
                mnemonic = line.split(" ")[0]
                if mnemonic == "CAL" or mnemonic == "HLT":
                    current_address += 2  # 2 bytes for CAL and HLT
                else:
                    current_address += 2  # all other instructions are 2 bytes

        # Second pass: generate machine code
        current_address = 0
        for i, line in enumerate(cleaned_code):
            if ':' in line:
                continue  # skip label-only lines

            parts = line.strip().split(" ", 1)
            mnemonic = parts[0]
            operands = parts[1] if len(parts) > 1 else ""

            if mnemonic not in self.instruction_map:
                raise Exception(f"Invalid instruction '{mnemonic}' on line {i+1}")

            opcode = self.instruction_map[mnemonic]

            if mnemonic == "HLT":
                machine_code[current_address] = opcode + "0"
                machine_code[current_address + 1] = "00"
                current_address += 2
            elif mnemonic == "CAL":
                target = operands.strip()
                if target not in label_table:
                    raise Exception(f"Undefined label '{target}' on line {i+1}")
                address = label_table[target]
                machine_code[current_address] = opcode + "0"
                machine_code[current_address + 1] = "{:02x}".format(address)
                current_address += 2
            else:
                regs = operands.split(",")
                if len(regs) != 2:
                    raise Exception(f"Expected 2 operands on line {i+1}")
                r1 = regs[0].strip()
                val = regs[1].strip()

                if int(r1, 16) < 0 or int(r1, 16) > 15:
                    raise Exception(f"Invalid register in line {i+1}")
                if int(val, 16) < 0 or int(val, 16) > 255:
                    raise Exception(f"Invalid value in line {i+1}")

                machine_code[current_address] = opcode + r1.lower()
                machine_code[current_address + 1] = "{:02x}".format(int(val, 16)).lower()
                current_address += 2

        self.machine_code = " ".join(machine_code[:current_address]).strip()
        return self.machine_code