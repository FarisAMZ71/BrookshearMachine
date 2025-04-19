from ..Base_Brookshear.Machine import Machine
from ..Base_Brookshear.cpu_module import CPU
from ..Base_Brookshear.memory_module import Memory
from ..Base_Brookshear.Assembler import Assembler

from .cpu_module_stack import CPU_Stack
from .memory_module_stack import Memory_Stack
from .Assembler_stack import Assembler_Stack
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.Utils import Utils

class Machine_Stack(Machine):
    def __init__(self, cpu, memory, assembler):
        super().__init__(cpu, memory, assembler)

    # Overriding the Execute method
    def Execute(self, operation: dict):
        match operation["opcode"]:
                   
            case 0xD:
                for i in range(0, operation["operand2"] * 16 + operation["operand3"]):    
                    self.cpu.push()
                    self.memory.write(self.cpu.stack_pointer, self.cpu.read(operation["operand1"] + i))
            case 0xE:
                if operation["operand2"] * 16 + operation["operand3"] > self.cpu.stack_size():
                    raise Exception("Stack underflow")
                for i in range(0, operation["operand2"] * 16 + operation["operand3"]):
                    self.cpu.write(operation["operand1"] + i, self.memory.read(self.cpu.stack_pointer))
                    self.memory.write(self.cpu.stack_pointer, 0x00)
                    self.cpu.pop()
            case _:
                super().Execute(operation)