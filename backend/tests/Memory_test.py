import os
import sys
import pytest # type: ignore
from unittest.mock import mock_open, patch
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.Base_Brookshear.memory_module import Memory

def test_memory_initialization():
    """Test proper initialization of the Memory class."""
    memory = [[0] * 16 for _ in range(16)]
    mem = Memory(memory)

    assert mem.memory == memory

def test_invalid_memory_size():
    """Test that an exception is raised for incorrect memory dimensions."""
    with pytest.raises(Exception, match="Invalid memory size"):
        Memory([[0] * 16 for _ in range(15)])  # Too few rows

    with pytest.raises(Exception, match="Invalid memory size"):
        Memory([[0] * 15 for _ in range(16)])  # One row is too short

def test_from_dict():
    """Test the from_dict class method."""
    data = {"memory": [[i] * 16 for i in range(16)]}
    mem = Memory.from_dict(data)

    assert mem.memory == data["memory"]

def test_new():
    """Test the new() factory method."""
    mem = Memory.new()

    assert mem.memory == [[0] * 16 for _ in range(16)]

def test_read():
    """Test reading from memory."""
    memory = [[0] * 16 for _ in range(16)]
    memory[5][3] = 42  # Set value at address 5*16+3 (83)
    mem = Memory(memory)

    assert mem.read(83) == 42

def test_read_invalid_address():
    """Test that reading an invalid address raises an exception."""
    mem = Memory.new()

    with pytest.raises(Exception, match="Invalid memory address"):
        mem.read(-1)

    with pytest.raises(Exception, match="Invalid memory address"):
        mem.read(256)

def test_write():
    """Test writing to memory."""
    mem = Memory.new()
    mem.write(100, 0xAB)

    assert mem.read(100) == 0xAB

def test_write_invalid_address():
    """Test that writing to an invalid address raises an exception."""
    mem = Memory.new()

    with pytest.raises(Exception, match="Invalid memory address"):
        mem.write(-1, 0x12)

    with pytest.raises(Exception, match="Invalid memory address"):
        mem.write(256, 0x12)

def test_write_invalid_data():
    """Test that writing oversized data raises an exception."""
    mem = Memory.new()

    with pytest.raises(Exception, match="Invalid data size"):
        mem.write(10, 0x12345)  # Too large for a byte

def test_load_program():
    """Test loading a machine code string into memory."""
    mem = Memory.new()
    program = "10 20 30 40 50"

    mem.load_program(program)

    assert mem.read(0) == 0x10
    assert mem.read(1) == 0x20
    assert mem.read(2) == 0x30
    assert mem.read(3) == 0x40
    assert mem.read(4) == 0x50

def test_load_program_invalid_data(capfd):
    """Test that loading an invalid program prints an error message."""
    mem = Memory.new()
    program = "10 20 ZZ 40 50"  

    mem.load_program(program)

    captured = capfd.readouterr()
    assert "invalid literal" in captured.out.lower()  

def test_import_program():
    """Test importing a program from a file (mocked)."""
    mem = Memory.new()
    mock_file_data = "10 20 30 40 50"

    with patch("builtins.open", mock_open(read_data=mock_file_data)), \
         patch.object(mem.utils, "get_file_path", return_value="mock_file.txt"):
        mem.import_program("mock_file.txt")

    assert mem.read(0) == 0x10
    assert mem.read(1) == 0x20
    assert mem.read(2) == 0x30
    assert mem.read(3) == 0x40
    assert mem.read(4) == 0x50

def test_export_program():
    """Test exporting a program to a file (mocked) and print file contents."""
    mem = Memory.new()
    mem.write(0, 0xAA) 
    mem.write(1, 0xBB)
    mem.write(2, 0xCC)

    with patch("builtins.open", mock_open()) as mocked_file, \
         patch.object(mem.utils, "get_file_path", return_value="mock_file.txt"):
        mem.export_program("mock_file.txt")

        written_content = "".join(call.args[0] for call in mocked_file().write.call_args_list)

    expected_content = "aa bb cc " + "00 " * 253  
    assert written_content.strip() == expected_content.strip()

def test_clear():
    """Test clearing the memory."""
    mem = Memory([[i] * 16 for i in range(16)])  
    mem.clear()

    assert mem.memory == [[0] * 16 for _ in range(16)]

def test_dump(capfd):
    """Test the dump() method prints memory correctly."""
    mem = Memory([[10, 20, 30, 40] + [0] * 12 for _ in range(16)])
    mem.dump()

    captured = capfd.readouterr()
    expected_output = "\n".join(
        str([hex(x) for x in [10, 20, 30, 40] + [0] * 12]) for _ in range(16)
    )

    assert captured.out.strip() == expected_output.strip()

test_export_program()