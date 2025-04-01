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
        print(operation)
        match operation["opcode"]:
                           
            case 0x1:
                address = operation["operand2"] * 16 + operation["operand3"]
                self.cpu.registers[operation["operand1"]] = self.memory.read(address)
            case 0x2:
                bit_string = operation["operand2"] * 16 + operation["operand3"]
                self.cpu.registers[operation["operand1"]] = bit_string
            case 0x3:
                address = operation["operand2"] * 16 + operation["operand3"]
                self.memory.write(address, self.cpu.registers[operation["operand1"]])
            case 0x4:
                self.cpu.registers[operation["operand3"]] = self.cpu.registers[operation["operand2"]]  
            case 0x5:
                self.cpu.registers[operation["operand1"]] = self.cpu.registers[operation["operand2"]] + self.cpu.registers[operation["operand3"]]
            case 0x6:
                self.cpu.registers[operation["operand1"]] = self.utils.encode_to_8bit_floating_point(
                    self.utils.decode_8bit_floating_point(self.cpu.registers[operation["operand2"]]) + 
                    self.utils.decode_8bit_floating_point(self.cpu.registers[operation["operand3"]])
                    )
            case 0x7:
                self.cpu.registers[operation["operand1"]] = self.cpu.registers[operation["operand2"]] | self.cpu.registers[operation["operand3"]] 
            case 0x8:
                self.cpu.registers[operation["operand1"]] = self.cpu.registers[operation["operand2"]] & self.cpu.registers[operation["operand3"]]
            case 0x9:
                self.cpu.registers[operation["operand1"]] = self.cpu.registers[operation["operand2"]] ^ self.cpu.registers[operation["operand3"]]
            case 0xA:
                self.cpu.registers[operation["operand1"]] = self.utils.bit_cycle_right(self.cpu.registers[operation["operand1"]], operation["operand3"]) 
            case 0xB:
                if(self.cpu.registers[0] == self.cpu.registers[operation["operand1"]]):
                    address = operation["operand2"] * 16 + operation["operand3"]
                    self.cpu.set_program_counter(address)
            case 0xC:
                self.halted = True
            case 0xD:
                self.cpu.push()
                self.memory.write(self.cpu.stack_pointer, self.cpu.registers[operation["operand1"]])
            case 0xE:
                self.cpu.registers[operation["operand1"]] = self.memory.read(self.cpu.stack_pointer)
                self.memory.write(self.cpu.stack_pointer, 0x00)
                self.cpu.pop()
            case _:
                self.halted = True
                # self.cpu.dump()
                # self.memory.dump()
                raise Exception("Invalid opcode")