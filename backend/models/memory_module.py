import os
import sys
# Add the project root to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.Utils import Utils

class Memory:
    def __init__(self, memory):
        # 2D list of 256 bytes
        # Make sure that the memory is a 2D list of 16x16
        if len(memory) != 16:
            raise Exception("Invalid memory size")
        for i in range(16):
            if len(memory[i]) != 16:
                raise Exception("Invalid memory size")
        
        self.memory = memory
        self.utils = Utils()
    
    @classmethod
    def from_dict(cls, data):
        return cls(data['memory'])
    
    @classmethod
    def new(cls):
        return cls([[0] * 16 for _ in range(16)])
    
    # Read a byte from memory given an address
    def read(self, address):
        if address < 0 or address > 255:
            raise Exception("Invalid memory address")
        return self.memory[address // 16][address % 16]

    # Write a byte to memory given an address
    def write(self, address, data):
        if address < 0 or address > 255:
            raise Exception("Invalid memory address")
        if len(hex(data)) > 4:
            raise Exception("Invalid data size")
        self.memory[address // 16][address % 16] = data

    # Load a program into memory given a string machine code
    def load_program(self, program: str):
        program = program.strip().split()
        for address, byte in enumerate(program):
            try:
                self.write(address, int(byte, 16))
            except Exception as e:
                print(e)
    
    # Load a program into memory from a txt file
    def import_program(self, program: str):
        file_path = self.utils.get_file_path(program)
        
        with open(file_path, "r") as file:
            try:
                lines = file.read().strip().split()
            except Exception as e:
                print(e)
        for address, byte in enumerate(lines):
            try:
                self.write(address, int(byte, 16))
            except Exception as e:
                print(e)
        
    # Export the program from memory to a txt file
    def export_program(self, program: str):
        file_path = self.utils.get_file_path(program)
        
        with open(file_path, "w") as file:
            for address in range(256):
                try:
                    file.write("0x{:02x}".format(self.read(address))[2:] + " ")
                except Exception as e:
                    print(e)

    # Print the memory
    def dump(self):
        for i in range(16):
            print([hex(x) for x in self.memory[i]])
        
    # Clear the memory
    def clear(self):
        self.memory = [[0] * 16 for _ in range(16)]

