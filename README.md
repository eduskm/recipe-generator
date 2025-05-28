# recipe-generator

✅ Testare automată și CI/CD
Proiectul include un sistem de testare automată pentru ambele componente:

Frontend (React): testat cu Jest

Backend (Flask): testat cu pytest

🔁 Integrare continuă (CI)
Pentru a asigura calitatea codului, am configurat un workflow GitHub Actions care:

Instalează automat dependințele frontend și backend

Rulează testele din frontend/src/tests/ folosind Jest

Rulează testele din backend/tests/ folosind pytest

Verifică dacă totul trece cu succes înainte de a accepta schimbări în ramura main

📂 Fișier workflow: .github/workflows/testare.yml

🚀 Cum pornești local aplicația
Asigură-te că ai instalat Docker și rulează:

bash
Copy
Edit
docker compose up --build
Asta va porni:

React frontend (localhost:3000)

Flask backend (localhost:5000)
