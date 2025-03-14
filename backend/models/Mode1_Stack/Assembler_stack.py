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
    
