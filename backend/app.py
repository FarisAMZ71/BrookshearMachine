from flask import Flask, jsonify
from flask_cors import CORS
from models import *

app = Flask(__name__)
CORS(app)  

@app.route('/')
def index():
    return "Flask is running!"

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == "__main__":
    app.run(debug=True)
