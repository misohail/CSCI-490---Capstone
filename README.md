# Privacy-Safe Password Auditor and Breach Checker

A privacy-focused web application built with Django and JavaScript that evaluates password strength, calculates entropy, generates secure passwords, and checks exposure against known data breaches without ever transmitting raw passwords or full hashes over the network.

---

## Architecture & Privacy-First Design

The core priority of this project is **zero-knowledge credential auditing**.

### Client-Side Processing & K-Anonymity
Traditional breach auditors upload user passwords to an external server for verification. This application keeps all sensitive operations strictly inside the user's browser:
- **Client-Side Hashing**: Password complexity evaluation, entropy calculations, and SHA-1 hashing are executed locally via JavaScript in the user's browser.
- **Have I Been Pwned (HIBP) API & k-Anonymity**: Only the first 5 hexadecimal characters of the SHA-1 hash (the prefix) are queried against the HIBP API.
- **Local Hash Suffix Verification**: The API responds with a list of hash suffixes matching that 5-character prefix. The browser compares the remaining 35 characters locally against the returned results. At no point is the plaintext password or the complete hash transmitted across the network or processed on the Django backend.

### Role of Django Backend & Unmodified Starter Files
- **Backend Responsibility**: Django is used as a routing and delivery mechanism to serve the frontend templates, static CSS components, and JavaScript files.
- **Unmodified Starter Files**:
  - `models.py`: Intentionally kept as default boilerplate. The application is stateless and persists no user accounts, submitted passwords, or query logs in a database, ensuring no sensitive data can be compromised in a breach.
  - `admin.py`: Left default because no database models exist to manage.
  - `tests.py`: Starter state; unit tests covering client-side validation logic and Django view routing are planned next.

---

## Codebase Map & Implementation Breakdown

| File / Directory | Status | Purpose & Work Completed |
| :--- | :--- | :--- |
| `static/js/app.js` | Custom Implementation | Core logic including `calculateStrength()`, `calculateEntropy()`, `checkForBreach()`, and password generation routines. |
| `templates/` | Custom Implementation | Modular HTML templates separating the auditor interface, breach status alerts, and generator controls. |
| `static/css/` | Custom Implementation | Modular stylesheets split into distinct files for component-level styling. |
| `views.py` / `urls.py` | Modified | Configured route handling to serve the application interface and static assets. |
| `models.py` | Default Boilerplate | Unmodified by design to ensure stateless, zero-retention privacy. |
| `admin.py` | Default Boilerplate | Unmodified; no database models are registered. |
| `tests.py` | In Progress | Scaffolded for automated tests covering password evaluation and endpoint responses. |

---


## Development Setup (VS Code)

Follow these steps to set up and run the project locally using VS Code.

### Prerequisites

In your terminal, Ensure Python, `venv`, and `pip` are installed:
```bash
sudo apt update && sudo apt install python3-venv python3-pip -y
```

## 1. Open the Project in VS Code
```bash
cd /path/to/project
```

## 2. Set Up the Virtual Environment

Create the virtual environment:
```bash
python3 -m venv venv
```

Activate the environment:
```bash
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

## 3. Run Migrations
```bash
python manage.py migrate
```

## 4. Run the Development Server
```bash
python manage.py runserver
```

Open your browser and navigate to:
```bash
http://127.0.0.1:8000/
```
