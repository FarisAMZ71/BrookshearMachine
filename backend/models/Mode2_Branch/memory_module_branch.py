from ..Mode1_Stack.memory_module_stack import Memory_Stack

class Memory_Branch(Memory_Stack):
    def __init__(self, memory):
        super().__init__(memory)

    @staticmethod
    def new():
        return Memory_Branch([[0] * 16 for _ in range(16)])