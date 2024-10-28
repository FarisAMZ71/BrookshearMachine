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
        self.memory[address // 16][address % 16] = data

    # Print the memory
    def dump(self):
        for i in range(16):
            print([hex(x) for x in self.memory[i]])

