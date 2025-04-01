from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import sys
from models import *
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.Utils import Utils

app = Flask(__name__)
CORS(app)  
# Choose machine mode
machine_mode = "Base"
machine = Machine(CPU.new(), Memory.new(), Assembler())
# machine = Machine_Stack(CPU_Stack.new(), Memory_Stack.new(), Assembler_Stack())
    
utils = Utils()


@app.route('/')
def index():
    return "Flask is running!"

@app.route('/api/test', methods=['GET'])
def get_data():
    return jsonify({"message": "Connection successful!"})

@app.route('/api/memory', methods=['GET'])
def get_memory():
    return jsonify(
        {"memory": machine.memory.memory}
    )

@app.route('/api/cpu', methods=['GET'])
def get_cpu():
    ret = {
        "cpu":{
            "registers": machine.cpu.registers,
            "instruction_register": machine.cpu.instruction_register,
            "program_counter": machine.cpu.program_counter
        }}
    if machine_mode == "Stack":
        ret["cpu"]["stack_pointer"] = machine.cpu.stack_pointer
    return jsonify(ret)

@app.route('/api/machine_mode', methods=['GET'])
def get_machine_mode():
    print(machine_mode)
    return jsonify(
        {"machine_mode": machine_mode}
    )

@app.route('/api/run', methods=['POST'])
def run_machine():
    try:
        machine.Run()
        ret = {
         "memory": machine.memory.memory,
         "cpu":{
            "registers": machine.cpu.registers,
            "instruction_register": int(machine.cpu.instruction_register[2:], 16),
            "program_counter": machine.cpu.program_counter
        }}
        if machine_mode == "Stack":
            ret["cpu"]["stack_pointer"] = machine.cpu.stack_pointer
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
            }), 400
    print("Machine Mode: ", machine_mode)
    print("return json: ", ret)
    return jsonify(ret)

@app.route('/api/step', methods=['POST'])
def step_machine():
    try:
        machine.Step()
        ret = {
         "memory": machine.memory.memory,
         "cpu":{
            "registers": machine.cpu.registers,
            "instruction_register": int(machine.cpu.instruction_register[2:], 16),
            "program_counter": machine.cpu.program_counter
        }}
        if machine_mode == "Stack":
            ret["cpu"]["stack_pointer"] = machine.cpu.stack_pointer
        print(machine.cpu.instruction_register[2:])
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
            }), 400
    return jsonify(ret)

@app.route('/api/clear_memory', methods=['POST'])
def clear_memory():
    machine.clearMemory()
    return jsonify(
        {"memory": machine.memory.memory}
    )

@app.route('/api/clear_cpu', methods=['POST'])
def clear_cpu():
    machine.clearCPU()
    return jsonify(
        {"cpu":{
            "registers": machine.cpu.registers,
            "instruction_register": machine.cpu.instruction_register,
            "program_counter": machine.cpu.program_counter
        }}
    )

@app.route('/api/load_program', methods=['POST'])
def load_program():
    # machine.memory.load_program("fibonacci.txt")
    # Extract machine code from the request
    machine_code = request.json['machine_code']
    machine.memory.load_program(machine_code)
    return jsonify(
        {"memory": machine.memory.memory}
    )

@app.route('/api/upload_program', methods=['POST'])
def upload_program():
    try:
        program = request.json['program']
        print(program)
        machine_code = machine.Assemble(program)
        machine.memory.load_program(machine_code)
    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "error": str(e)
            }), 400
    return jsonify(
        {
            "memory": machine.memory.memory,
            "assembly_code": machine.assembler.assembly_code
        }
    )

@app.route('/api/convert', methods=['POST'])
# Extract the assembly_code from the request
def convert():
    assembly_code = request.json['assembly_code']
    try:
        machine_code = machine.Assemble(assembly_code)
        machine.assembler.assembly_code = assembly_code
        machine.assembler.machine_code = machine_code
        print(machine.assembler.assembly_code)
        print(machine.assembler.machine_code)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
            }), 400
    
    return jsonify({
        "success": True,
        "machine_code": machine_code
        }), 200

@app.route('/api/change_mode', methods=['POST'])
def change_mode():
    global machine
    global machine_mode
    mode = request.json['machine_mode']
    print(mode)
    if mode == "Base":
        machine = Machine(CPU.new(), Memory.new(), Assembler())
    elif mode == "Stack":
        machine = Machine_Stack(CPU_Stack.new(), Memory_Stack.new(), Assembler_Stack())
    else:
        return jsonify({
            "success": False,
            "error": "Invalid mode"
            }), 400
    machine_mode = mode
    print(machine_mode)
    return jsonify({
        "success": True,
        "mode": mode
        }), 200


if __name__ == "__main__":
    app.run(debug=True)
