from ..Mode1_Stack.cpu_module_stack import CPU_Stack

class CPU_Branch(CPU_Stack):
    def __init__(self, registers, program_counter, instruction_register):
        super().__init__(registers, program_counter, instruction_register)
        self.link_register = 0

    @staticmethod
    def new():
        return CPU_Branch([0] * 16, 0, "0")
    
    def dump(self):
        super().dump()
        print("Link Register: ", hex(self.link_register))

    def clear(self):
        super().clear()
        self.link_register = 0