from ..Base_Brookshear.Assembler import Assembler

class Assembler_Stack(Assembler):
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
            "POP": "E"
        }

    def assemble(self, code):
        # Expand multi-register PSH and POP instructions into multiple single-register lines
        expanded_lines = []
        for line in code.splitlines():
            stripped = line.strip()
            upper = stripped.upper()
            if upper.startswith("PSH") or upper.startswith("POP"):
                instr = upper[:3]
                operands = stripped[3:].strip()
                regs = [op.strip() for op in operands.split(",") if op.strip()]
                # If only one operand and it contains a space, treat as normal
                if len(regs) == 1 and " " in regs[0]:
                    expanded_lines.append(line)
                else:
                    for reg in regs:
                        if instr == "PSH":
                            expanded_lines.append(f"PSH {reg}, 00")
                        else:  # POP
                            expanded_lines.append(f"POP {reg}, 00")
            else:
                expanded_lines.append(line)
        expanded_code = "\n".join(expanded_lines)
        return super().assemble(expanded_code)

