import pandas as pd
import numpy as np
import random
import os

def generate_dataset(num_samples=5000):
    np.random.seed(42)
    random.seed(42)
    
    data = []
    disaster_types = ['Flood', 'Earthquake', 'Cyclone', 'Wildfire']
    
    for _ in range(num_samples):
        disaster = random.choice(disaster_types)
        
        # Base environmental metrics
        temp = np.random.normal(30, 10)
        rainfall = np.random.exponential(20)
        humidity = np.random.normal(60, 20)
        wind_speed = np.random.exponential(15)
        air_pressure = np.random.normal(1010, 15)
        
        # Constrain values
        temp = max(-10, min(50, temp))
        rainfall = min(500, rainfall)
        humidity = max(10, min(100, humidity))
        wind_speed = min(200, wind_speed)
        air_pressure = max(900, min(1050, air_pressure))
        
        # Determine logical outcome based on science
        probability = 5
        
        if disaster == 'Flood':
            # High rain and humidity
            if rainfall > 100: probability += 40
            if rainfall > 200: probability += 30
            if humidity > 80: probability += 15
        elif disaster == 'Earthquake':
            # Completely random, maybe slight correlation to nothing
            probability = random.randint(5, 95)
        elif disaster == 'Cyclone':
            # High wind, low pressure, some rain
            if wind_speed > 80: probability += 40
            if air_pressure < 980: probability += 30
            if rainfall > 50: probability += 15
        elif disaster == 'Wildfire':
            # High temp, low humidity, high wind
            if temp > 35: probability += 30
            if humidity < 30: probability += 40
            if wind_speed > 30: probability += 20
            
        probability = max(1, min(99, probability))
        
        # Categorize
        if probability >= 80:
            status = 'Evacuate'
        elif probability >= 50:
            status = 'Alert'
        elif probability >= 30:
            status = 'Watch'
        else:
            status = 'Safe'
            
        data.append({
            'disaster_type': disaster,
            'temperature': temp,
            'rainfall': rainfall,
            'humidity': humidity,
            'wind_speed': wind_speed,
            'air_pressure': air_pressure,
            'status': status
        })
        
    df = pd.DataFrame(data)
    df.to_csv('historical_disaster_data.csv', index=False)
    print(f"Successfully generated {num_samples} records in historical_disaster_data.csv")

if __name__ == '__main__':
    generate_dataset()
