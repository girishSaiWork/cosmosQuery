from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from utils import get_es_client
from config import INDEX_NAME


app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/search")
async def search(search_query: str, skip: int = 0, limit: int = 10):
    es = get_es_client(max_retries=5, sleep_time=5)
    response = es.search(
        index=INDEX_NAME,
        body={
            "query": {
                "multi_match": {
                    "query": search_query,
                    "fields": ["title", "explanation"]
                }
            },
            "from": skip,
            "size": limit
        },
        filter_path=["hits.hits._source", "hits.hits._score"]
    )
    
    if "hits" not in response or "hits" not in response["hits"]:
        return {"results": []}
        
    hits = response["hits"]["hits"]
    return {"results": hits}

def extract_docs_per_year(response: dict) -> dict:
    aggregations = response.get("aggregations", {})
    docs_per_year = aggregations.get("docs_per_year", {})
    buckets = docs_per_year.get("buckets", [])
    return {bucket["key_as_string"]: bucket["doc_count"] for bucket in buckets}


@app.get("/api/v1/get_docs_per_year_count")
async def get_docs_per_year_count(search_query: str, skip: int = 0, limit: int = 10):
    try:
        es = get_es_client(max_retries=1, sleep_time=0)
        query = {
            "bool": {
                "must" : [
                    {
                    "multi_match": {
                        "query": search_query,
                        "fields": ["title", "explanation"]
                        } 
                    }
                ]
            }
        }

        response = es.search(
                index=INDEX_NAME,
                body={
                    "query": query,
                    "from": skip,
                    "size": limit,
                    "aggs": {
                        "docs_per_year": {
                            "date_histogram": {
                                "field": "date",
                                "calendar_interval": "year",
                                "format": "yyyy"
                            }
                        }
                    },
                },
                filter_path=[
                    "hits.total",
                    "hits.hits._source",
                    "aggregations.docs_per_year"
                ]
            )
        
        return {
            "docs_per_year": extract_docs_per_year(response),
            "total": response.get("hits", {}).get("total", {}).get("value", 0),
            "results": response.get("hits", {}).get("hits", [])
        }
    except Exception as e:
        print(f"Exception : {e}")
        return {"docs_per_year": {}, "total": 0, "results": []}