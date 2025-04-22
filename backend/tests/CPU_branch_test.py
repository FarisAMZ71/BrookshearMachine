import pytest
from models.Mode2_Branch.cpu_module_branch import CPU_Branch

def test_cpu_branch_initialization():
    cpu = CPU_Branch.new()
    assert cpu.link_register == 0

def test_cpu_branch_dump_and_clear():
    cpu = CPU_Branch.new()
    cpu.link_register = 123
    cpu.clear()
    assert cpu.link_register == 0
