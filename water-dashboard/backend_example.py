"""
Sample Flask Backend for Smart Water Footprint Calculator
This is a reference implementation showing the expected API structure.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

@app.route('/api/sensor-data', methods=['GET'])
def get_sensor_data():
    """
    Returns current sensor readings
    In production, this would read from actual IoT sensors
    """
    data = {
        'temperature': round(20 + random.uniform(0, 10), 1),
        'humidity': round(50 + random.uniform(0, 30), 1),
        'soil_moisture': round(40 + random.uniform(0, 30), 1),
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }
    return jsonify(data)

@app.route('/api/calculate-footprint', methods=['POST'])
def calculate_footprint():
    """
    Calculates water footprint based on crop, usage, and area
    """
    data = request.get_json()

    crop = data.get('crop', 'Unknown')
    daily_usage = float(data.get('daily_usage', 0))
    area = float(data.get('area', 0))
    area_unit = data.get('area_unit', 'sqm')

    area_in_sqm = area * 4046.86 if area_unit == 'acre' else area

    monthly_footprint = daily_usage * 30
    total_footprint = monthly_footprint * (area_in_sqm / 100)

    if total_footprint < 15000:
        efficiency = 'efficient'
    elif total_footprint < 30000:
        efficiency = 'normal'
    else:
        efficiency = 'overuse'

    ideal_usage = total_footprint * 0.8

    current_temp = round(20 + random.uniform(0, 10), 1)
    current_humidity = round(50 + random.uniform(0, 30), 1)
    current_soil = round(40 + random.uniform(0, 30), 1)

    result = {
        'total_footprint': round(total_footprint, 2),
        'unit': 'liters',
        'efficiency': efficiency,
        'ideal_usage': round(ideal_usage, 2),
        'crop': crop,
        'sensor_data': {
            'temperature': current_temp,
            'humidity': current_humidity,
            'soil_moisture': current_soil
        }
    }

    return jsonify(result)

if __name__ == '__main__':
    print("Starting Flask backend on http://localhost:5000")
    print("Available endpoints:")
    print("  GET  /api/sensor-data")
    print("  POST /api/calculate-footprint")
    app.run(host='0.0.0.0', port=5000, debug=True)
