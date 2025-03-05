import os
import sys
import pytest # type: ignore
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.cpu_module import CPU


def test_cpu_initialization():
    registers = [0] * 16
    cpu = CPU(registers, 0, "0")

    assert cpu.registers == registers
    assert cpu.program_counter == 0
    assert cpu.instruction_register == "0"

def test_invalid_register_count():
    with pytest.raises(Exception, match="Invalid number of registers"):
        CPU([0] * 15, 0, "0")  

def test_from_dict():
    data = {
        'registers': [1, 2, 3] + [0] * 13,
        'program_counter': 10,
        'instruction_register': "A2"
    }
    cpu = CPU.from_dict(data)

    assert cpu.registers == data['registers']
    assert cpu.program_counter == data['program_counter']
    assert cpu.instruction_register == data['instruction_register']

def test_new():
    cpu = CPU.new()

    assert cpu.registers == [0] * 16
    assert cpu.program_counter == 0
    assert cpu.instruction_register == "0"

def test_increment_program_counter():
    cpu = CPU.new()
    cpu.increment_program_counter()
    
    assert cpu.program_counter == 2

def test_increment_program_counter_wrap():
    cpu = CPU.new()
    cpu.program_counter = 255
    cpu.increment_program_counter()

    assert cpu.program_counter == 0  # Ensure wrap-around behavior works

def test_set_program_counter():
    cpu = CPU.new()
    cpu.set_program_counter(50)

    assert cpu.program_counter == 50

def test_clear():
    cpu = CPU([5] * 16, 200, "FF")
    cpu.clear()

    assert cpu.registers == [0] * 16
    assert cpu.program_counter == 0
    assert cpu.instruction_register == "0"

def test_dump(capsys):
    cpu = CPU([10, 20, 30] + [0] * 13, 15, "1A")
    cpu.dump()

    captured = capsys.readouterr()
    expected_output = (
        "Registers: ['0xa', '0x14', '0x1e', '0x0', '0x0', '0x0', '0x0', '0x0', "
        "'0x0', '0x0', '0x0', '0x0', '0x0', '0x0', '0x0', '0x0']\n"
        "Program Counter: 0xf\n"
        "Instruction Register: 1A\n"
    )

    assert captured.out.strip() == expected_output.strip()
