from ..Mode1_Stack.Machine_stack import Machine_Stack
from ..Base_Brookshear.cpu_module import CPU
from ..Base_Brookshear.memory_module import Memory
from ..Base_Brookshear.Assembler import Assembler

from .cpu_module_branch import CPU_Branch
from .memory_module_branch import Memory_Branch
from .Assembler_branch import Assembler_Branch
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.Utils import Utils

class Machine_Branch(Machine_Stack):
    def __init__(self, cpu, memory, assembler):
        super().__init__(cpu, memory, assembler)

    # Overriding the Execute method
    def Execute(self, operation: dict):
        match operation["opcode"]:
            case 0xE:
                if operation["operand1"] == 0x0 and operation["operand2"] == 0x0 and operation["operand3"] == 0x0:
                    self.program_counter = self.cpu.link_register
                else:
                    super().Execute(operation)
            case 0xF:
                self.cpu.link_register = self.cpu.program_counter + 2
                self.cpu.program_counter = operation["operand2"] * 16 + operation["operand3"]
            case _:
                super().Execute(operation)