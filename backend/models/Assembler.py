class Assembler:
    def __init__(self):
        pass

    def Assemble(self, assemblyCode: str):
        assemblyCode = self.clean(assemblyCode)
        print(f"cleaned code: {assemblyCode}")
        machineCode = ""
        instruction_map = {
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
        for i, line in enumerate(assemblyCode):
        # Add instruction opcode
            if line.split(" ")[0] in instruction_map:
                machineCode += instruction_map[line[:3]]
            else:
                raise Exception(f"Invalid instruction in line {i+1}")
            
        # Add the operands
            operands = line[4:].split(",")
            operands = [x.strip() for x in operands]
            print(f"operands: {operands}")
            # Add target register
            if(int(operands[0], 16) < 0 or int(operands[0], 16) > 15):
                raise Exception(f"Invalid register in line {i+1}")
            machineCode += f"{str(operands[0]).lower()} "

            # Add bit pattern
            if(int(operands[1], 16) < 0 or int(operands[1], 16) > 255):
                raise Exception(f"Invalid bit pattern in line {i+1}")
            machineCode += f"{str(operands[1]).lower()} "
        
        print(f"machineCode: {machineCode}")
        return machineCode
    
    def clean(self, code: str):
        # Split the code into lines
        lines = code.split("\n")
        # Remove the empty lines
        lines = list(filter(lambda x: x != "", lines))
        # Remove the comments
        lines = list(map(lambda x: x.split("//")[0], lines))
        # Remove the leading and trailing whitespaces
        lines = list(map(lambda x: x.strip(), lines))
        # Remove the labels
        lines = list(map(lambda x: x.split(":")[-1].strip(), lines))
        # Remove the empty list elements
        lines = list(filter(lambda x: x != "", lines))
        return lines
