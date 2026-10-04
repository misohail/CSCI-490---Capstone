# CSCI-490---Capstone

## Development Setup (VS Code)

Follow these steps to set up and run the project locally using VS Code.

### Prerequisites

In your terminal, ensure Python and the virtual environment package are installed:
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
