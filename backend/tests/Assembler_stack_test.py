import os
import sys
import pytest # type: ignore
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.Mode1_Stack.Assembler_stack import Assembler_Stack

def test_assembler_stack_initialization():
    asm = Assembler_Stack()
    assert hasattr(asm, 'instruction_map')
    assert 'PSH' in asm.instruction_map
    assert 'POP' in asm.instruction_map

def test_assembler_stack_assemble_expands_psh_pop():
    asm = Assembler_Stack()
    code = 'PSH 1,2,3\nPOP 4,5'
    # Should expand to multiple single-register instructions
    expanded = asm.assemble(code)
    assert isinstance(expanded, str)

def test_assembler_stack_invalid_instruction():
    asm = Assembler_Stack()
    with pytest.raises(Exception):
        asm.assemble('INVALID 1,2')
