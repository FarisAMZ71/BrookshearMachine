import pytest
from models.Mode2_Branch.Machine_branch import Machine_Branch
from models.Mode2_Branch.cpu_module_branch import CPU_Branch
from models.Mode2_Branch.memory_module_branch import Memory_Branch
from models.Mode2_Branch.Assembler_branch import Assembler_Branch

def test_machine_branch_initialization():
    cpu = CPU_Branch.new()
    mem = Memory_Branch.new()
    asm = Assembler_Branch()
    machine = Machine_Branch(cpu, mem, asm)
    assert machine.cpu is cpu
    assert machine.memory is mem
    assert machine.assembler is asm

def test_machine_branch_execute_e_case():
    cpu = CPU_Branch.new()
    mem = Memory_Branch.new()
    asm = Assembler_Branch()
    machine = Machine_Branch(cpu, mem, asm)
    cpu.link_register = 99
    op = {"opcode": 0xE, "operand1": 0, "operand2": 0, "operand3": 0}
    machine.Execute(op)
    assert cpu.program_counter == 99

def test_machine_branch_execute_f_case():
    cpu = CPU_Branch.new()
    mem = Memory_Branch.new()
    asm = Assembler_Branch()
    machine = Machine_Branch(cpu, mem, asm)
    cpu.program_counter = 10
    op = {"opcode": 0xF, "operand1": 0, "operand2": 1, "operand3": 2}
    machine.Execute(op)
    assert cpu.link_register == 10
    assert cpu.program_counter == 18
