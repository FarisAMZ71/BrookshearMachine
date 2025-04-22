import pytest
from models.Mode1_Stack.memory_module_stack import Memory_Stack

def test_memory_stack_initialization():
    mem = Memory_Stack.new()
    assert hasattr(mem, 'memory')
    assert isinstance(mem.memory, list)
    assert len(mem.memory) == 16
    assert all(len(row) == 16 for row in mem.memory)
