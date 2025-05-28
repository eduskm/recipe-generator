# Testare – Cerință minimă îndeplinită

## Tip: Testare automată frontend (React)

Aplicația a fost testată folosind framework-ul `Jest` împreună cu `React Testing Library`.

### Tehnologii folosite:
- Jest
- @testing-library/react
- @testing-library/jest-dom
- Babel + preset React
- jsdom test environment

### Teste implementate:
1. `renders LoginForm and detects email input`  
   Verifică dacă inputul pentru email este prezent în formularul de login.

2. `shows error when fields are empty and login is clicked`  
   Simulează un click fără introducerea de date și asigură funcționarea interacțiunii.

### Cum rulezi testele:

```bash
cd frontend
npm install
npm test
