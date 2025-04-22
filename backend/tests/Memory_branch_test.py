import pytest
from models.Mode2_Branch.memory_module_branch import Memory_Branch

def test_memory_branch_initialization():
    mem = Memory_Branch.new()
    assert hasattr(mem, 'memory')
    assert isinstance(mem.memory, list)
    assert len(mem.memory) == 16
    assert all(len(row) == 16 for row in mem.memory)
