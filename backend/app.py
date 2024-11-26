from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import sys
from models import *
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.Utils import Utils

app = Flask(__name__)
CORS(app)  

machine = Machine(CPU.new(), Memory.new())
# machine.memory.import_program("fibonacci.txt")
assembler = Assembler()
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
    return jsonify(
        {"cpu":{
            "registers": machine.cpu.registers,
            "instruction_register": machine.cpu.instruction_register,
            "program_counter": machine.cpu.program_counter
        }}
    )

@app.route('/api/run', methods=['POST'])
def run_machine():
    machine.Run()
    return jsonify(
        {"memory": machine.memory.memory,
         "cpu":{
            "registers": machine.cpu.registers,
            "instruction_register": machine.cpu.instruction_register,
            "program_counter": machine.cpu.program_counter
        }}
    )

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
    machineCode = request.json['machineCode']
    machine.memory.load_program(machineCode)
    return jsonify(
        {"memory": machine.memory.memory}
    )

@app.route('/api/convert', methods=['POST'])
# Extract the assemblyCode from the request
def convert():
    assemblyCode = request.json['assemblyCode']
    try:
        machineCode = assembler.Assemble(assemblyCode)
        print(f"machineCode: {machineCode}")
    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "error": str(e)
            }), 400
    
    return jsonify({
        "success": True,
        "machineCode": machineCode
        }), 200


if __name__ == "__main__":
    app.run(debug=True)
