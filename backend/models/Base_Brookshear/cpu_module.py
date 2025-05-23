class CPU:
    def __init__(self, registers, program_counter, instruction_register):
        if len(registers) != 16:
            raise Exception("Invalid number of registers")
        self.registers = registers
        self.program_counter = program_counter
        self.instruction_register = instruction_register # Holds it as a string due to formatting issues
    
    @classmethod
    def from_dict(cls, data):
        return cls(data['registers'], data['program_counter'], data['instruction_register'])
    
    @classmethod
    def new(cls):
        return cls([0] * 16, 0, "0")
    
    def read(self, index):
        if index < 0 or index >= len(self.registers):
            raise Exception("Invalid register index")
        return self.registers[index]
    
    def write(self, index, value):
        if index < 0 or index >= len(self.registers):
            raise Exception("Invalid register index")
        if value < 0 or value > 255:
            raise Exception(f"Invalid register value: {value}")
        self.registers[index] = value
        return self.registers[index]
    
    def increment_program_counter(self):
        if self.program_counter >= 254:
            self.program_counter = 0
        else:
            self.program_counter += 2
    
    def set_program_counter(self, address):
        self.program_counter = address
    
    def dump(self):
        print(f"Registers: {[hex(x) for x in self.registers]}")
        print(f"Program Counter: {hex(self.program_counter)}")
        print(f"Instruction Register: {self.instruction_register}")
    
    def clear(self):
        self.registers = [0] * 16
        self.program_counter = 0
        self.instruction_register = "0"