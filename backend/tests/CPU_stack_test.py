import pytest
from models.Mode1_Stack.cpu_module_stack import CPU_Stack

def test_cpu_stack_initialization():
    cpu = CPU_Stack.new()
    assert cpu.stack_pointer == 0xFF
    assert cpu.push_count == 0
    assert cpu.pop_count == 0

def test_cpu_stack_push_pop():
    cpu = CPU_Stack.new()
    cpu.push()
    assert cpu.push_count == 1
    cpu.push()
    assert cpu.stack_pointer == 0xFE
    cpu.pop()
    assert cpu.stack_pointer == 0xFF

def test_cpu_stack_underflow():
    cpu = CPU_Stack.new()
    with pytest.raises(Exception):
        cpu.pop_count = 2
        cpu.push_count = 1
        cpu.pop()

def test_cpu_stack_clear():
    cpu = CPU_Stack.new()
    cpu.push()
    cpu.clear()
    assert cpu.stack_pointer == 0xFF
    assert cpu.push_count == 0
    assert cpu.pop_count == 0
