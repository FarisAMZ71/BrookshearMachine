import pytest
from models.Mode1_Stack.Machine_stack import Machine_Stack
from models.Mode1_Stack.cpu_module_stack import CPU_Stack
from models.Mode1_Stack.memory_module_stack import Memory_Stack
from models.Mode1_Stack.Assembler_stack import Assembler_Stack

def test_machine_stack_initialization():
    cpu = CPU_Stack.new()
    mem = Memory_Stack.new()
    asm = Assembler_Stack()
    machine = Machine_Stack(cpu, mem, asm)
    assert machine.cpu is cpu
    assert machine.memory is mem
    assert machine.assembler is asm

def test_machine_stack_execute_push_pop():
    cpu = CPU_Stack.new()
    mem = Memory_Stack.new()
    asm = Assembler_Stack()
    machine = Machine_Stack(cpu, mem, asm)
    # Simulate push
    op_push = {"opcode": 0xD, "operand1": 0, "operand2": 0, "operand3": 0}
    cpu.registers[0] = 42
    machine.Execute(op_push)
    assert mem.read(cpu.stack_pointer) == 42
    # Simulate pop
    op_pop = {"opcode": 0xE, "operand1": 0, "operand2": 0, "operand3": 0}
    machine.Execute(op_pop)
    assert cpu.registers[0] == 42
