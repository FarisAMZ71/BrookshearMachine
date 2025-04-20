from ..Base_Brookshear.cpu_module import CPU

class CPU_Stack(CPU):
    def __init__(self, registers, program_counter, instruction_register):
        super().__init__(registers, program_counter, instruction_register)
        self.stack_pointer = 0xFF
        self.push_count = 0
        self.pop_count = 0

    @staticmethod
    def new():
        return CPU_Stack([0] * 16, 0, "0")
    
    def push(self):
        if self.push_count == 0:
            self.push_count += 1
            return
        self.stack_pointer -= 1
        self.push_count += 1

    def pop(self):
        if self.pop_count > self.push_count:
            raise Exception("Stack underflow")
        if self.stack_pointer == 0xFF:
            return
        self.stack_pointer += 1
        self.pop_count += 1

    def stack_size(self):
        return self.push_count - self.pop_count
        
    def dump(self):
        super().dump()
        print("Instruction Register: ", self.instruction_register)
        print("Push Count: ", self.push_count)
        print("Pop Count: ", self.pop_count)

    def clear(self):
        super().clear()
        self.stack_pointer = 0xFF
        self.push_count = 0
        self.pop_count = 0