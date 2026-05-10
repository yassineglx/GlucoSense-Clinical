from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = joblib.load(os.path.join(os.path.dirname(__file__), 'clinical_diabetes_pipeline.pkl'))
feature_names = joblib.load(os.path.join(os.path.dirname(__file__), 'feature_names.pkl'))

class PatientData(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float

@app.post("/predict")
def predict(data: PatientData):
    input_dict = data.dict()
    input_df = pd.DataFrame([input_dict], columns=feature_names)
    
    prediction = pipeline.predict(input_df)[0]
    probability = pipeline.predict_proba(input_df)[0][1]
    
    return {
        "prediction": int(prediction),
        "probability": float(probability)
    }

@app.get("/features")
def features():
    try:
        model = pipeline.named_steps['classifier']
        importance = model.feature_importances_
        impact_df = pd.DataFrame({
            'Feature': feature_names,
            'Importance': importance.tolist()
        }).sort_values('Importance', ascending=False)
        return impact_df.to_dict(orient='records')
    except Exception as e:
        return {"error": str(e)}
