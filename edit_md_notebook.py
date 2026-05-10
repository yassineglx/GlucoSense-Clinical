import json

notebook_path = "notebooks/diabetes-prediction.ipynb"

with open(notebook_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

for cell in nb["cells"]:
    if cell["cell_type"] == "markdown":
        source = cell.get("source", [])
        source_str = "".join(source)
        
        if "Random Forest and XGBoost models were developed with class balancing strategies." in source_str:
            source_str = source_str.replace(
                "Random Forest and XGBoost models were developed with class balancing strategies. Both achieved comparable performance: Random Forest (AUC 0.8146), XGBoost (AUC 0.8161). Despite marginally lower AUC, Random Forest was selected for deployment due to superior clinical interpretability through SHAP analysis.",
                "Random Forest, XGBoost, and LightGBM models were developed with class balancing strategies. They achieved the following performance: Random Forest (AUC 0.8146), XGBoost (AUC 0.8161), and LightGBM (AUC 0.8176). LightGBM demonstrated the best performance, but Random Forest was originally selected for deployment due to superior clinical interpretability through SHAP analysis."
            )
            
        if "The ROC analysis confirmed comparable discriminative ability: Random Forest (AUC 0.8146) and XGBoost (AUC 0.8161)." in source_str:
            source_str = source_str.replace(
                "The ROC analysis confirmed comparable discriminative ability: Random Forest (AUC 0.8146) and XGBoost (AUC 0.8161). Both significantly outperformed random chance, demonstrating clinical utility. The marginal difference supports our choice of Random Forest based on interpretability advantages rather than pure performance metrics.",
                "The ROC analysis confirmed strong discriminative ability across models: Random Forest (AUC 0.8146), XGBoost (AUC 0.8161), and LightGBM (AUC 0.8176). All significantly outperformed random chance, demonstrating clinical utility. While LightGBM showed the highest pure performance metrics, the original pipeline utilizes Random Forest based on interpretability advantages."
            )
            
        if "Random Forest was selected over XGBoost despite marginally lower AUC" in source_str:
            source_str = source_str.replace(
                "Random Forest was selected over XGBoost despite marginally lower AUC (81.5% vs 81.6%) due to better clinical interpretability via SHAP analysis.",
                "LightGBM achieved the best overall performance (AUC 81.8%), outperforming XGBoost (81.6%) and Random Forest (81.5%). However, the original pipeline and SHAP analysis utilized Random Forest for clinical interpretability."
            )

        lines = source_str.splitlines(True)
        cell["source"] = lines

with open(notebook_path, "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=1)
    
print("Markdown cells updated.")
