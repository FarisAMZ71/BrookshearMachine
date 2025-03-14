from ..Base_Brookshear.memory_module import Memory

class Memory_Stack(Memory):
    def __init__(self, memory):
        super().__init__(memory)

    @staticmethod
    def new():
        return Memory_Stack([[0] * 16 for _ in range(16)])
    
    def clear(self):
        self.memory = [[0] * 16 for _ in range(16)]