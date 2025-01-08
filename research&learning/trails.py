from pprint import pprint
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os

# Correct path with double backslashes
env_path = os.path.join('e:\\', 'Study Space', 'Python Workspace', 'ELastic Search', '.env.local')

# Load environment variables
load_dotenv(dotenv_path=env_path)

# Print debugging information
print("Current working directory:", os.getcwd())
print("Environment file path:", env_path)

# Get the LOCALHOST variable
LOCALHOST = os.getenv('LOCALHOST')
print("Raw LOCALHOST value:", repr(LOCALHOST))

# Ensure LOCALHOST is properly processed
if not LOCALHOST:
    print("LOCALHOST not found in environment file.")
    # Fallback to default if not found
    LOCALHOST = "http://localhost:9200/"
else:
    print("LOCALHOST found in environment file.")
    # Remove quotes if present
    LOCALHOST = LOCALHOST.strip('"')

print("Processed LOCALHOST value:", repr(LOCALHOST))

# Connect to Elasticsearch
try:
    es = Elasticsearch([LOCALHOST])
    client_info = es.info()
    print('Connected to Elasticsearch!')
    pprint(client_info.body)
except Exception as e:
    print(f"Connection error: {e}")