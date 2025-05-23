import os
import sys
import pytest # type: ignore
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.Base_Brookshear.Assembler import Assembler

def test_assembler_initialization():
    """Test that the Assembler initializes with empty assembly and machine code."""
    asm = Assembler()
    assert asm.assembly_code == ""
    assert asm.machine_code == ""

def test_clean():
    """Test that cleaning removes comments, labels, and whitespace."""
    asm = Assembler()
    assembly_code = """
         LDR 2, 3  // Load value
        MOV 5, 10   // Move value
        STR 4, 20
    """
    cleaned_code = asm.clean(assembly_code)
    expected = ["LDR 2, 3", "MOV 5, 10", "STR 4, 20"]
    
    assert cleaned_code == expected

def test_assemble_valid():
    """Test assembling a valid assembly code into machine code."""
    asm = Assembler()
    assembly_code = """
        LDR 2, 3
        MOV R1, R0
        STR 4, 20
    """
    machine_code = asm.assemble(assembly_code)
    
    expected_machine_code = "22 03 40 10 34 20 "
    assert machine_code == expected_machine_code

def test_assemble_invalid_instruction():
    """Test handling of invalid instructions."""
    asm = Assembler()
    assembly_code = """
        INVALID 2, 3
    """
    with pytest.raises(Exception, match="Invalid instruction in line 1"):
        asm.assemble(assembly_code)

def test_assemble_invalid_register():
    """Test handling of invalid register values."""
    asm = Assembler()
    assembly_code = """
        LDR 16, 3
    """  # Register should be between 0 and 15
    
    with pytest.raises(Exception, match="Invalid register in line 1"):
        asm.assemble(assembly_code)

def test_assemble_invalid_bit_pattern():
    """Test handling of invalid bit pattern values."""
    asm = Assembler()
    assembly_code = """
        LDR R2, 300
    """  # Bit pattern should be between 0 and 255
    
    with pytest.raises(Exception, match="Invalid bit pattern in line 1"):
        asm.assemble(assembly_code)

def test_assemble_comments_and_whitespace():
    """Test handling of comments, empty lines, and whitespace."""
    asm = Assembler()
    assembly_code = """
        // This is a comment
        MOV R1, R0  // Move value  
        
        STR 3, 15  // Store value
    """
    machine_code = asm.assemble(assembly_code)

    expected_machine_code = "40 10 33 15 "
    assert machine_code == expected_machine_code

def test_assemble_empty_input():
    """Test handling of empty input."""
    asm = Assembler()
    assembly_code = ""  # No instructions

    machine_code = asm.assemble(assembly_code)
    assert machine_code == ""  # Should return an empty string

def test_assemble_with_hlt():
    """Test handling of HLT instruction."""
    asm = Assembler()
    assembly_code = """
        HLT
    """
    machine_code = asm.assemble(assembly_code)

    expected_machine_code = "C0 00 "
    assert machine_code == expected_machine_code

def test_assemble_with_adt_and_adf():
    """Test assembling ADT and ADF instructions with three registers."""
    asm = Assembler()
    assembly_code_adt = """
        ADT R0, R1, R2
    """
    machine_code_adt = asm.assemble(assembly_code_adt)

    expected_machine_code_adt = "50 12 "
    assert machine_code_adt == expected_machine_code_adt

    assembly_code_adf = """
        ADF R3, R4, R5
    """
    machine_code_adf = asm.assemble(assembly_code_adf)

    expected_machine_code_adf = "63 45 "
    assert machine_code_adf == expected_machine_code_adf


