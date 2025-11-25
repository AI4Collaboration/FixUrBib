"""
FastAPI REST API for BibFixer
Wraps BibFixAgent to provide HTTP endpoints for the frontend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from bibfixer import BibFixAgent

app = FastAPI(
    title="BibFixer API",
    description="LLM-powered BibTeX fixing service",
    version="0.1.0"
)

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your GitHub Pages domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FixRequest(BaseModel):
    bibtex: str
    api_key: str
    model: Optional[str] = "gpt-4o-mini"
    preferences: Optional[str] = ""


class FixResponse(BaseModel):
    success: bool
    result: Optional[str] = None
    error: Optional[str] = None


class BatchFixRequest(BaseModel):
    entries: List[str]
    api_key: str
    model: Optional[str] = "gpt-4o-mini"
    preferences: Optional[str] = ""


class BatchFixResponse(BaseModel):
    success: bool
    results: Optional[List[dict]] = None
    error: Optional[str] = None


@app.get("/")
async def root():
    return {"message": "BibFixer API is running", "version": "0.1.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/fix", response_model=FixResponse)
async def fix_bibtex(request: FixRequest):
    """
    Fix a single BibTeX entry using LLM + web search
    """
    try:
        agent = BibFixAgent(api_key=request.api_key)
        agent.model = request.model

        result = agent.revise_bibtex(request.bibtex, request.preferences)

        return FixResponse(success=True, result=result)

    except ValueError as e:
        return FixResponse(success=False, error=str(e))
    except Exception as e:
        return FixResponse(success=False, error=f"API error: {str(e)}")


@app.post("/api/fix-batch", response_model=BatchFixResponse)
async def fix_bibtex_batch(request: BatchFixRequest):
    """
    Fix multiple BibTeX entries
    """
    try:
        agent = BibFixAgent(api_key=request.api_key)
        agent.model = request.model

        results = []
        for entry in request.entries:
            try:
                result = agent.revise_bibtex(entry, request.preferences)
                results.append({"success": True, "result": result})
            except Exception as e:
                results.append({"success": False, "error": str(e)})

        return BatchFixResponse(success=True, results=results)

    except ValueError as e:
        return BatchFixResponse(success=False, error=str(e))
    except Exception as e:
        return BatchFixResponse(success=False, error=f"API error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
