from .cpu_module import CPU
from .memory_module import Memory
from .Assembler import Assembler
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.Utils import Utils
class Machine:
    def __init__(self, cpu, memory, assembler):
        self.cpu = cpu
        self.memory = memory
        self.assembler = assembler
        self.utils = Utils()
        self.halted = False

    def Assemble(self, assembly_code: str):
        return self.assembler.assemble(assembly_code)
    
    # Fetch the instruction from memory (2 bytes)
    def Fetch(self):
        address = self.cpu.program_counter
        self.cpu.increment_program_counter()
        self.cpu.instruction_register =  "0x{:02x}".format(self.memory.read(address)) + "{:02x}".format(self.memory.read(address + 1))# Holds it as a string
        self.cpu.dump()
    
    # Decode the instruction (Brookshear instruction set)
    def Decode(self):
        if len(self.cpu.instruction_register) != 6:
            raise Exception("Invalid instruction length")
        
        operation = {
            "opcode": int(self.cpu.instruction_register[2], 16),
            "operand1": int(self.cpu.instruction_register[3], 16),
            "operand2": int(self.cpu.instruction_register[4], 16),
            "operand3": int(self.cpu.instruction_register[5], 16)
        }
        print("in decode")
        print(operation)

        return operation
    
    # Execute the instruction
    def Execute(self, operation: dict):
        match operation["opcode"]:
                           
            case 0x1:
                address = operation["operand2"] * 16 + operation["operand3"]
                self.cpu.write(operation["operand1"], self.memory.read(address))
            case 0x2:
                bit_string = operation["operand2"] * 16 + operation["operand3"]
                self.cpu.write(operation["operand1"], bit_string)
            case 0x3:
                address = operation["operand2"] * 16 + operation["operand3"]
                self.memory.write(address, self.cpu.read(operation["operand1"]))
            case 0x4:
                self.cpu.write(operation["operand3"], self.cpu.read(operation["operand2"]))
            case 0x5:
                result = self.cpu.read(operation["operand2"]) + self.cpu.read(operation["operand3"])
                carry = result > 0xFF
                if carry:
                    result &= 0xFF  # Simulate 8-bit overflow
                self.cpu.write(operation["operand1"], result)

            case 0x6:
                self.cpu.write(operation["operand1"], self.utils.encode_to_8bit_floating_point(
                    self.utils.decode_8bit_floating_point(self.cpu.read(operation["operand2"])) + 
                    self.utils.decode_8bit_floating_point(self.cpu.read(operation["operand3"]))
                    ))
            case 0x7:
                self.cpu.write(operation["operand1"], self.cpu.read(operation["operand2"]) | self.cpu.read(operation["operand3"]))
            case 0x8:
                self.cpu.write(operation["operand1"], self.cpu.read(operation["operand2"]) & self.cpu.read(operation["operand3"]))
            case 0x9:
                self.cpu.write(operation["operand1"], self.cpu.read(operation["operand2"]) ^ self.cpu.read(operation["operand3"]))
            case 0xA:
                self.cpu.write(operation["operand1"], self.utils.bit_cycle_right(self.cpu.read(operation["operand1"]), operation["operand3"]))
            case 0xB:   
                if self.cpu.read(0) == self.cpu.read(operation["operand1"]):
                    address = operation["operand2"] * 16 + operation["operand3"]
                    self.cpu.set_program_counter(address)
            case 0xC:
                self.halted = True
            case _:
                self.halted = True
                # self.cpu.dump()
                # self.memory.dump()
                raise Exception("Invalid opcode")

    # Run the machine
    def Run(self):
        step_count = 0
        while not self.halted:
            if step_count >= 10000:
                print("Error: Execution exceeded 10000 steps. Halting to prevent infinite loop.")
                self.halted = True
                break
            self.Fetch()
            operation = self.Decode()
            self.Execute(operation)
            step_count += 1
        self.halted = False

    # Step one clock cycle
    def Step(self):
        if not self.halted:
            self.Fetch()
            operation = self.Decode()
            self.Execute(operation)
            # self.cpu.dump()
            # self.memory.dump()

    
    def clearMemory(self):
        self.memory.clear()
    
    def clearCPU(self):
        self.cpu.clear()
        self.halted = False

            

# run the machine
if __name__ == "__main__":
    cpu = CPU.new()
    memory = Memory.new()
    memory.import_program("fibonacci.txt")
    machine = Machine(cpu, memory)
    machine.Run()

