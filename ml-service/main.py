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
    temp = float(data.get('temperature', 30))
    rainfall = float(data.get('rainfall', 0))
    wind_speed = float(data.get('wind_speed', 0))
    air_pressure = float(data.get('air_pressure', 1013))
    humidity = float(data.get('humidity', 50))
    
    # Sophisticated Mock AI Logic weighting different environmental factors
    probability = 5
    severity = "Low"
    status = "Safe"
    
    if disaster_type == "Flood":
        # Floods depend heavily on rainfall and soil moisture (if we had it, we proxy with humidity)
        probability = min(99, (rainfall * 0.3) + (temp * 0.1) + ((humidity - 50) * 0.5))
    elif disaster_type == "Earthquake":
        # Earthquakes are random, but we'll mock a baseline + random fluctuation for demo
        probability = min(99, random.randint(5, 30) + (temp * 0.05))
    elif disaster_type == "Cyclone":
        # Cyclones depend heavily on wind speed and low air pressure
        pressure_drop = max(0, 1013 - air_pressure)
        probability = min(99, (wind_speed * 0.5) + (pressure_drop * 1.5) + (rainfall * 0.1))
    elif disaster_type == "Wildfire":
        # Wildfires depend on high temp, low humidity, high wind
        humidity_val = max(1, humidity)
        probability = min(99, ((temp - 30) * 3) + (wind_speed * 0.8) + (100 / humidity_val * 2))
        
    probability = max(1, probability) # Ensure it doesn't go below 1
        
    if probability >= 80:
        severity = "Critical"
        status = "Evacuate"
    elif probability >= 50:
        severity = "Warning"
        status = "Alert"
    elif probability >= 30:
        severity = "Info"
        status = "Watch"
        
    return jsonify({
        "status": status,
        "probability": int(probability),
        "severity": severity,
        "message": "Prediction calculated successfully by ML Engine"
    })

if __name__ == '__main__':
    # Run the server on port 8000
    app.run(host='127.0.0.1', port=8000)
