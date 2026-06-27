import sys
fpath = r'C:\Users\user\.gemini\antigravity-ide\brain\4cbb1bb6-fb9d-47be-a3da-9db0ae095bc0\rapport_projet.tex'
try:
    content = open(fpath, encoding='utf-8').read()
    start_str = r'\section{14. Diagrammes UML de l\'Application}'
    end_str = r'\section{15. Conclusion}'
    
    pre_content = content[:content.find(start_str)]
    post_content = content[content.find(end_str):]
    
    if content.find(start_str) == -1 or content.find(end_str) == -1:
        print('Error finding sections')
        sys.exit(1)
        
    uml_content = r'''\section{14. Diagrammes UML de l'Application}

Pour modéliser l'architecture du système, voici les diagrammes UML (au format PlantUML) décrivant les interactions de l'application.

\subsection{Diagramme des Cas d'Utilisation (Use Case)}
Ce diagramme illustre les interactions possibles entre le Patient et le système GlucoSense, incluant la recommandation médicale.

\begin{verbatim}
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Patient / Utilisateur" as user

rectangle "Système GlucoSense" {
  usecase "Saisir Données Cliniques" as UC1
  usecase "Calculer IMC" as UC2
  usecase "Voir Prédiction du Risque" as UC3
  usecase "Voir Explication IA (Facteurs)" as UC4
  usecase "Voir Historique d'Évaluation" as UC5
  usecase "Gérer le Compte" as UC6
  usecase "Consulter un Médecin" as UC7
}

user --> UC1
user --> UC2
user --> UC3
user --> UC4
user --> UC5
user --> UC6

UC1 ..> UC3 : <<includes>>
UC3 <.. UC7 : <<extends>> (Si Risque Élevé)
@enduml
\end{verbatim}

\subsection{Diagramme de Séquence (Sequence Diagram)}
Ce diagramme trace le flux de données complet, depuis la saisie des informations dans l'interface utilisateur jusqu'à la prédiction par l'API et la sauvegarde dans la base de données.

\begin{verbatim}
@startuml
skinparam maxMessageSize 150
autonumber

actor "Utilisateur" as user
box "Frontend (Next.js)" #LightCyan
participant "Interface Utilisateur" as ui
participant "Next.js Route API" as nextapi
end box

box "Backend (FastAPI)" #LightYellow
participant "FastAPI" as api
participant "Modèle Random Forest" as model
end box

database "Base SQLite (Prisma)" as db

user -> ui: Saisit les données cliniques (Âge, IMC, Glucose)
user -> ui: Clique sur "Calculer le Risque"

ui -> nextapi: POST /api/predict (Données)
activate nextapi

nextapi -> api: POST http://localhost:8000/predict (JSON)
activate api

api -> model: pipeline.predict_proba(input_df)
activate model
model --> api: Probabilité de risque (ex: 0.73)
deactivate model

api --> nextapi: {prediction, probability}
deactivate api

nextapi -> db: Prisma: Sauvegarde l'évaluation (si connecté)
activate db
db --> nextapi: Évaluation sauvegardée
deactivate db

nextapi --> ui: {success, riskProbability, riskLevel}
deactivate nextapi

ui --> user: Affiche la Jauge de Risque et les Explications IA
@enduml
\end{verbatim}

\clearpage
'''
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(pre_content + uml_content + post_content)
    print('Fixed successfully.')
except Exception as e:
    print('Error:', e)
