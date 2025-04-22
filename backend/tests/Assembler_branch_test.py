import os
import sys
import pytest # type: ignore
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.Mode2_Branch.Assembler_branch import Assembler_Branch

def test_assembler_branch_initialization():
    asm = Assembler_Branch()
    assert hasattr(asm, 'instruction_map')
    assert 'CAL' in asm.instruction_map
    assert 'HLT' in asm.instruction_map

def test_assembler_branch_assemble_hlt():
    asm = Assembler_Branch()
    code = 'HLT'
    mc = asm.assemble(code)
    assert isinstance(mc, str)
    assert 'c0' in mc.lower() or 'C0' in mc

def test_assembler_branch_invalid_instruction():
    asm = Assembler_Branch()
    with pytest.raises(Exception):
        asm.assemble('INVALID 1,2')
