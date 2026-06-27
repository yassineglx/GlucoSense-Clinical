import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib
import os

os.makedirs('api', exist_ok=True)

df = pd.read_csv('data/diabetes.csv')
X = df.drop('Outcome', axis=1)
y = df['Outcome']
feature_names = X.columns.tolist()

pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(class_weight='balanced', random_state=42, n_estimators=100))
])

pipeline.fit(X, y)
joblib.dump(pipeline, 'api/clinical_diabetes_rf_pipeline.pkl')
joblib.dump(feature_names, 'api/feature_names.pkl')
print("Random Forest Model trained and saved to api folder.")
