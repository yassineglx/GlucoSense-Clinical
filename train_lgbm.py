import pandas as pd
# pyrefly: ignore [missing-import]
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
# pyrefly: ignore [missing-import]
from lightgbm import LGBMClassifier
from sklearn.pipeline import Pipeline
# pyrefly: ignore [missing-import]
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
    ('classifier', LGBMClassifier(class_weight='balanced', random_state=42, verbose=-1))
])

pipeline.fit(X, y)
joblib.dump(pipeline, 'api/clinical_diabetes_pipeline.pkl')
joblib.dump(feature_names, 'api/feature_names.pkl')
print("Model trained and saved to api folder.")
