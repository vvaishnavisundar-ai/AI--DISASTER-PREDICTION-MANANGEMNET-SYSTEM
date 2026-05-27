from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict_disaster():
    data = request.json
    
    # Extract data from the Node.js backend request
    disaster_type = data.get('disaster_type', 'Flood')
    temp = data.get('temperature', 30)
    rainfall = data.get('rainfall', 0)
    wind_speed = data.get('wind_speed', 0)
    
    # Mock AI Logic (In a real app, this would be a trained TensorFlow/PyTorch model)
    probability = 10
    severity = "Low"
    status = "Safe"
    
    if disaster_type == "Flood" and rainfall > 100:
        probability = min(99, rainfall * 0.4)
    elif disaster_type == "Earthquake":
        probability = random.randint(10, 80)
    elif disaster_type == "Cyclone" and wind_speed > 60:
        probability = min(99, wind_speed * 0.6)
        
    if probability > 75:
        severity = "Critical"
        status = "Evacuate"
    elif probability > 40:
        severity = "Warning"
        status = "Alert"
        
    return jsonify({
        "status": status,
        "probability": int(probability),
        "severity": severity,
        "message": "Prediction calculated successfully by ML Engine"
    })

if __name__ == '__main__':
    # Run the server on port 8000
    app.run(host='127.0.0.1', port=8000)
