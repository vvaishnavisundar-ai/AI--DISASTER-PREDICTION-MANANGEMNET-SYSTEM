import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train():
    print("Loading dataset...")
    df = pd.read_csv('historical_disaster_data.csv')
    
    print("Preprocessing data...")
    # Encode categorical disaster_type
    le_disaster = LabelEncoder()
    df['disaster_type_encoded'] = le_disaster.fit_transform(df['disaster_type'])
    
    # Save the label encoder to map new strings to ints during inference
    joblib.dump(le_disaster, 'disaster_encoder.pkl')
    
    # Features (X) and Target (y)
    X = df[['disaster_type_encoded', 'temperature', 'rainfall', 'humidity', 'wind_speed', 'air_pressure']]
    y = df['status']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestClassifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {acc * 100:.2f}%")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    print("Saving model to disaster_model.pkl...")
    joblib.dump(clf, 'disaster_model.pkl')
    print("Training complete! AI Engine is ready.")

if __name__ == '__main__':
    train()
