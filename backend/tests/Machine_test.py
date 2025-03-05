import os
import sys
import pytest # type: ignore
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.Machine import Machine
from models.cpu_module import CPU
from models.memory_module import Memory

class TestMachine:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.memory = Memory.new()
        self.memory.import_program("fibonacci.txt")
        self.cpu = CPU.new()
        self.machine = Machine(self.cpu, self.memory)
    
    def reset(self):
        self.memory = Memory.new()
        self.memory.import_program("fibonacci.txt")
        self.cpu = CPU.new()
        self.machine = Machine(self.cpu, self.memory)

    def test_fetch(self):
        self.machine.Fetch()
        assert self.cpu.instruction_register == hex(0x20e9)

    def test_decode(self):
        self.cpu.instruction_register = hex(0x20e9)
        operation = self.machine.Decode()

        assert operation == {
            "opcode": 0x2,
            "operand1": 0x0,
            "operand2": 0xe,
            "operand3": 0x9
        }
    
    def test_execute(self):
        self.cpu.instruction_register = hex(0x20e9)
        operation = self.machine.Decode()
        self.machine.Execute(operation)
        assert self.cpu.registers[0x0] == 0xe9
    
    def test_fibonacci(self):
        self.reset()
        while not self.machine.halted:
            self.machine.Fetch()
            operation = self.machine.Decode()
            self.machine.Execute(operation)
        
        assert self.memory.read(0xf1) == 0x1
        assert self.memory.read(0xf2) == 0x1
        assert self.memory.read(0xf3) == 0x2
        assert self.memory.read(0xf4) == 0x3
        assert self.memory.read(0xf5) == 0x5
        assert self.memory.read(0xf6) == 0x8
        assert self.memory.read(0xf7) == 0xd
        assert self.memory.read(0xf8) == 0x15
        assert self.memory.read(0xf9) == 0x22
        assert self.memory.read(0xfa) == 0x37
        assert self.memory.read(0xfb) == 0x59
        assert self.memory.read(0xfc) == 0x90
        assert self.memory.read(0xfd) == 0xe9
