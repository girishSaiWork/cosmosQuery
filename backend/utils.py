import os
from dotenv import load_dotenv
from pprint import pprint
from elasticsearch import Elasticsearch
import time



def get_es_client(max_retries=1, sleep_time=0):
    env_path = "e:/Study Space/Python Workspace/ELastic Search/backend/.env.local"
    # Load environment variables
    load_dotenv(dotenv_path=env_path)

    # Get the LOCALHOST variable
    LOCALHOST = os.getenv('LOCALHOST')
    print("Raw LOCALHOST value:", repr(LOCALHOST))

    for _ in range(max_retries):
        try:
            es = Elasticsearch([LOCALHOST])
            client_info = es.info()
            print('Connected to Elasticsearch!')
            # pprint(client_info.body)
            break
        except Exception as e:
            print(f"Connection error: {e}")
            print(f"Retrying in {sleep_time} seconds...")
            time.sleep(sleep_time)

    return es
