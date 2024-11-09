from flask import Flask, jsonify
from flask_cors import CORS
from models import *

app = Flask(__name__)
CORS(app)  

cpu = CPU.new()
memory = Memory.new()
memory.load_program("fibonacci.txt")
machine = Machine(cpu, memory)

@app.route('/')
def index():
    return "Flask is running!"

@app.route('/api/test', methods=['GET'])
def get_data():
    return jsonify({"message": "Connection successful!"})

@app.route('/api/memory', methods=['GET'])
def get_memory():
    return jsonify(
        {"message": memory.memory}
    )

@app.route('/api/registers', methods=['GET'])
def get_cpu():
    return jsonify(
        {"message":{
            "registers": cpu.registers,
            "instruction_register": cpu.instruction_register,
            "program_counter": cpu.program_counter
        }}
    )

@app.route('/api/run', methods=['POST'])
def run_machine():
    machine.Run()
    return jsonify(
        {"message": "Machine has been run!"}
    )

if __name__ == "__main__":
    app.run(debug=True)
