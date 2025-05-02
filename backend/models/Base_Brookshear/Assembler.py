class Assembler:
    def __init__(self):
        self.assembly_code = ""
        self.machine_code = ""
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
            "HLT": "C"
        }

    def assemble(self, assembly_code: str):
        self.assembly_code = assembly_code
        assembly_code = self.clean(assembly_code)
        machine_code = ""
        for i, line in enumerate(assembly_code):
            instruction = line.split(" ")[0]
            # Special case for HLT
            if instruction == "HLT":
                machine_code += "C0 00 "
                continue
            # Add instruction opcode
            if instruction in self.instruction_map:
                machine_code += self.instruction_map[line[:3]]
            else:
                raise Exception(f"Invalid instruction in line {i+1}")
            
            # Add the operands
            operands = line[4:].split(",")
            operands = [x.strip() for x in operands]

            # Handle ADT and ADF with three-register format
            if instruction in ("ADT", "ADF", "ORR", "AND", "XOR"):
                if len(operands) != 3:
                    raise Exception(f"{instruction} requires three register operands in line {i+1}")
                dest, src1, src2 = operands
                for reg in (dest, src1, src2):
                    if not reg.upper().startswith("R"):
                        raise Exception(f"Operand {reg} is not a register in line {i+1}")
                    reg_num = reg[1:]
                    if int(reg_num, 16) < 0 or int(reg_num, 16) > 15:
                        raise Exception(f"Invalid register {reg} in line {i+1}")
                dest_hex = format(int(dest[1:], 16), "X")
                src1_hex = format(int(src1[1:], 16), "X")
                src2_hex = format(int(src2[1:], 16), "X")
                # Encode as: opcode + dest + src1 + src2 (e.g., 5 2 0 1 -> 52 01)
                machine_code += f"{dest_hex} {src1_hex}{src2_hex} "
                continue

            if instruction == "MOV":
                # Both operands must be registers in the form "R<num>"
                reg1 = operands[0]
                reg2 = operands[1]
                if reg1.upper().startswith("R") and reg2.upper().startswith("R"):
                    reg1_num = reg1[1:]
                    reg2_num = reg2[1:]
                    if (int(reg1_num, 16) < 0 or int(reg1_num, 16) > 15 or
                        int(reg2_num, 16) < 0 or int(reg2_num, 16) > 15):
                        raise Exception(f"Invalid register in line {i+1}")
                    reg1_hex = format(int(reg1_num, 16), "X")
                    reg2_hex = format(int(reg2_num, 16), "X")
                else:
                    raise Exception(f"Both operands for MOV must be registers in line {i+1}")
                machine_code += f"0 {reg1_hex}{reg2_hex} "
                continue

            # Handle labeled register (e.g., "R1")
            reg = operands[0]
            if reg.upper().startswith("R"):
                reg_num = reg[1:]
                print(f"reg_num: {int(reg_num, 16)}")
                if int(reg_num, 16) < 0 or int(reg_num, 16) > 15:
                    raise Exception(f"Invalid register in line {i+1}")
                reg_hex = format(int(reg_num, 16), "X")
            else:
                # fallback for numeric register (legacy)
                if int(reg, 16) < 0 or int(reg, 16) > 15:
                    raise Exception(f"Invalid register in line {i+1}")
                reg_hex = str(reg).lower()

            # Pad register to 1 hex digit
            if len(reg_hex) == 1:
                reg_hex = reg_hex
            else:
                raise Exception(f"Invalid register format in line {i+1}")

            # Handle bit pattern
            bit_pattern = operands[1]
            if len(bit_pattern) == 1:
                bit_pattern = "0" + bit_pattern
            # Validate bit pattern
            if int(bit_pattern, 16) < 0 or int(bit_pattern, 16) > 255:
                raise Exception(f"Invalid bit pattern in line {i+1}")

            machine_code += f"{reg_hex} {bit_pattern} "

        self.machine_code = machine_code
        return machine_code
    
    def clean(self, code: str):
        # Split the code into lines
        lines = code.split("\n")
        # Remove the empty lines
        lines = list(filter(lambda x: x != "", lines))
        # Remove the comments
        lines = list(map(lambda x: x.split("//")[0], lines))
        # Remove the leading and trailing whitespaces
        lines = list(map(lambda x: x.strip(), lines))
        # Remove the empty list elements
        lines = list(filter(lambda x: x != "", lines))
        # Convert to uppercase
        lines = list(map(lambda x: x.upper(), lines))
        return lines
