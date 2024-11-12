from flask import Flask, jsonify
from flask_cors import CORS
from models import *

app = Flask(__name__)
CORS(app)  

# cpu = CPU.new()
# memory = Memory.new()
# memory.load_program("fibonacci.txt")
machine = Machine(CPU.new(), Memory.new())
machine.memory.load_program("fibonacci.txt")

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

@app.route('/api/registers', methods=['GET'])
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

if __name__ == "__main__":
    app.run(debug=True)
