import json

notebook_path = "notebooks/diabetes-prediction.ipynb"

with open(notebook_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

for cell in nb["cells"]:
    if cell["cell_type"] == "code" or cell["cell_type"] == "markdown":
        source = cell.get("source", [])
        source_str = "".join(source)
        
        # Chunk 1
        if "from sklearn.ensemble import RandomForestClassifier\nfrom xgboost import XGBClassifier\nfrom sklearn.metrics import classification_report" in source_str:
            source_str = source_str.replace(
                "from sklearn.ensemble import RandomForestClassifier\nfrom xgboost import XGBClassifier\nfrom sklearn.metrics import classification_report",
                "from sklearn.ensemble import RandomForestClassifier\nfrom xgboost import XGBClassifier\nfrom lightgbm import LGBMClassifier\nfrom sklearn.metrics import classification_report"
            )
            
        # Chunk 2
        if "rf = RandomForestClassifier(class_weight='balanced', random_state=42)\nxgb = XGBClassifier(scale_pos_weight=sum(y==0)/sum(y==1), \n                    eval_metric='logloss', \n                    random_state=42)\n\n# Train models\nrf.fit(X_train_scaled, y_train)\nxgb.fit(X_train_scaled, y_train)" in source_str:
            source_str = source_str.replace(
                "rf = RandomForestClassifier(class_weight='balanced', random_state=42)\nxgb = XGBClassifier(scale_pos_weight=sum(y==0)/sum(y==1), \n                    eval_metric='logloss', \n                    random_state=42)\n\n# Train models\nrf.fit(X_train_scaled, y_train)\nxgb.fit(X_train_scaled, y_train)",
                "rf = RandomForestClassifier(class_weight='balanced', random_state=42)\nxgb = XGBClassifier(scale_pos_weight=sum(y==0)/sum(y==1), \n                    eval_metric='logloss', \n                    random_state=42)\nlgbm = LGBMClassifier(class_weight='balanced', random_state=42, verbose=-1)\n\n# Train models\nrf.fit(X_train_scaled, y_train)\nxgb.fit(X_train_scaled, y_train)\nlgbm.fit(X_train_scaled, y_train)"
            )
            
        # Chunk 3
        if "rf_probs = evaluate_model(\"Random Forest\", rf, X_test_scaled, y_test)\nxgb_probs = evaluate_model(\"XGBoost\", xgb, X_test_scaled, y_test)" in source_str:
            source_str = source_str.replace(
                "rf_probs = evaluate_model(\"Random Forest\", rf, X_test_scaled, y_test)\nxgb_probs = evaluate_model(\"XGBoost\", xgb, X_test_scaled, y_test)",
                "rf_probs = evaluate_model(\"Random Forest\", rf, X_test_scaled, y_test)\nxgb_probs = evaluate_model(\"XGBoost\", xgb, X_test_scaled, y_test)\nlgbm_probs = evaluate_model(\"LightGBM\", lgbm, X_test_scaled, y_test)"
            )

        # Chunk 4
        if "# Random Forest Importance\nplt.subplot(1, 2, 1)" in source_str:
            source_str = source_str.replace("plt.figure(figsize=(14, 6))", "plt.figure(figsize=(15, 5))")
            source_str = source_str.replace("plt.subplot(1, 2, 1)", "plt.subplot(1, 3, 1)")
            source_str = source_str.replace("plt.subplot(1, 2, 2)", "plt.subplot(1, 3, 2)")
            
            new_code = """
# LightGBM Importance
plt.subplot(1, 3, 3)
lgbm_importance = pd.Series(lgbm.feature_importances_, index=X.columns)
lgbm_importance.sort_values().plot(kind='barh', color='lightgreen')
plt.title('LightGBM Feature Importance')
plt.xlabel('Importance Score')

plt.tight_layout()"""
            source_str = source_str.replace("plt.tight_layout()", new_code)
            
        # Chunk 5
        if "fpr_xgb, tpr_xgb, _ = roc_curve(y_test, xgb_probs)\n\n# Plot ROC curves" in source_str:
            source_str = source_str.replace(
                "fpr_xgb, tpr_xgb, _ = roc_curve(y_test, xgb_probs)\n\n# Plot ROC curves\nplt.plot(fpr_rf, tpr_rf, label=f'Random Forest (AUC = {roc_auc_score(y_test, rf_probs):.2f})', linewidth=2)\nplt.plot(fpr_xgb, tpr_xgb, label=f'XGBoost (AUC = {roc_auc_score(y_test, xgb_probs):.2f})', linewidth=2)\nplt.plot([0, 1], [0, 1], 'k--', linewidth=1.5)",
                "fpr_xgb, tpr_xgb, _ = roc_curve(y_test, xgb_probs)\nfpr_lgbm, tpr_lgbm, _ = roc_curve(y_test, lgbm_probs)\n\n# Plot ROC curves\nplt.plot(fpr_rf, tpr_rf, label=f'Random Forest (AUC = {roc_auc_score(y_test, rf_probs):.2f})', linewidth=2)\nplt.plot(fpr_xgb, tpr_xgb, label=f'XGBoost (AUC = {roc_auc_score(y_test, xgb_probs):.2f})', linewidth=2)\nplt.plot(fpr_lgbm, tpr_lgbm, label=f'LightGBM (AUC = {roc_auc_score(y_test, lgbm_probs):.2f})', linewidth=2)\nplt.plot([0, 1], [0, 1], 'k--', linewidth=1.5)"
            )
            
        lines = source_str.splitlines(True)
        cell["source"] = lines

with open(notebook_path, "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=1)
    
print("Notebook updated.")
