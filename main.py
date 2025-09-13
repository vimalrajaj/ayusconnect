from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import time

# Load mapping CSV into memory
df = pd.read_csv("namaste_icd11.csv")
# Rename columns to be more programmer-friendly
df.rename(columns={
    "Namaste Code": "namaste_code",
    "Diagnosis (AYUSH/Traditional)": "diagnosis",
    "ICD-10 Code": "icd10_code",
    "ICD Diagnosis Name": "icd_diagnosis_name"
}, inplace=True)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Request model for saving
class SaveRequest(BaseModel):
    patient_id: str
    visit_id: str
    namaste_code: str
    icd10_code: str

# Autocomplete search
@app.get("/api/search")
def search(query: str = Query(..., min_length=1)):
    results = df[df["diagnosis"].str.contains(query, case=False, na=False)]
    return results.to_dict(orient="records")

# Save selection
@app.post("/api/save")
def save(req: SaveRequest):
    # For demo: just return confirmation
    return {
        "status": "success",
        "message": f"ICD-10 code {req.icd10_code} saved for patient {req.patient_id}"
    }

# API Documentation endpoint
@app.get("/api/endpoints")
def get_api_endpoints():
    """Returns documentation for all available API endpoints for EMR integration"""
    return {
        "api_name": "NAMASTE to ICD-10 Mapping API",
        "version": "1.0.0",
        "description": "API for mapping traditional AYUSH diagnoses to standardized ICD-10 codes",
        "base_url": "http://127.0.0.1:8000",
        "endpoints": [
            {
                "method": "GET",
                "path": "/api/search",
                "name": "Search Diagnoses",
                "description": "Search for AYUSH diagnoses and get ICD-10 mappings",
                "parameters": [
                    {
                        "name": "query",
                        "type": "string",
                        "required": True,
                        "description": "Search term for diagnosis (e.g., 'fever', 'diabetes')",
                        "example": "fever"
                    }
                ],
                "example_request": "GET /api/search?query=fever",
                "example_response": [
                    {
                        "namaste_code": "AYU-J001",
                        "diagnosis": "Jwar (Fever)",
                        "icd10_code": "R50.9",
                        "icd_diagnosis_name": "Fever, unspecified"
                    }
                ]
            },
            {
                "method": "POST",
                "path": "/api/save",
                "name": "Save to Patient Record",
                "description": "Save selected diagnosis to patient's EMR record",
                "parameters": [
                    {
                        "name": "patient_id",
                        "type": "string",
                        "required": True,
                        "description": "Unique patient identifier",
                        "example": "P12345"
                    },
                    {
                        "name": "visit_id",
                        "type": "string",
                        "required": True,
                        "description": "Unique visit identifier",
                        "example": "V98765"
                    },
                    {
                        "name": "namaste_code",
                        "type": "string",
                        "required": True,
                        "description": "NAMASTE diagnosis code",
                        "example": "AYU-J001"
                    },
                    {
                        "name": "icd10_code",
                        "type": "string",
                        "required": True,
                        "description": "ICD-10 diagnosis code",
                        "example": "R50.9"
                    }
                ],
                "example_request": {
                    "patient_id": "P12345",
                    "visit_id": "V98765",
                    "namaste_code": "AYU-J001",
                    "icd10_code": "R50.9"
                },
                "example_response": {
                    "status": "success",
                    "message": "ICD-10 code R50.9 saved for patient P12345"
                }
            },
            {
                "method": "GET",
                "path": "/api/endpoints",
                "name": "API Documentation",
                "description": "Get complete API documentation for EMR integration",
                "parameters": [],
                "example_request": "GET /api/endpoints",
                "example_response": "Complete API documentation object"
            }
        ],
        "integration_notes": [
            "All endpoints support CORS for web-based EMR systems",
            "Base URL should be updated to your production server",
            "Authentication can be added for production use",
            "All responses are in JSON format",
            "HTTP status codes follow REST conventions"
        ]
    }

# OAuth 2.0 and ABHA Authentication Endpoints
@app.post("/api/auth/validate")
def validate_authentication(request: dict):
    """Validate OAuth 2.0 or ABHA tokens for healthcare provider authentication"""
    try:
        auth_method = request.get("auth_method")
        
        if auth_method == "oauth":
            # OAuth 2.0 validation
            token = request.get("oauth_token")
            provider = request.get("provider")
            
            # Demo OAuth validation (replace with actual OAuth provider validation)
            demo_tokens = {
                "demo123": {"provider": "google", "email": "dr.sharma@hospital.com", "role": "doctor"},
                "demo456": {"provider": "microsoft", "email": "dr.patel@clinic.com", "role": "doctor"}
            }
            
            if token in demo_tokens:
                user_data = demo_tokens[token]
                return {
                    "status": "success",
                    "user": {
                        "id": f"user_{hash(token) % 10000}",
                        "name": user_data["email"].split("@")[0].replace(".", " ").title(),
                        "email": user_data["email"],
                        "role": user_data["role"],
                        "provider": provider,
                        "verified": True
                    },
                    "session_token": f"session_{hash(token + str(time.time())) % 100000}",
                    "expires_in": 3600  # 1 hour
                }
            else:
                return {"status": "error", "message": "Invalid OAuth token"}
                
        elif auth_method == "abha":
            # ABHA validation
            abha_id = request.get("abha_id")
            medical_license = request.get("medical_license")
            
            # Demo ABHA validation (replace with actual ABHA API integration)
            valid_abha = {
                "12-3456-7890-1234": {"license": "MH12345", "name": "Dr. Rajesh Sharma"},
                "98-7654-3210-9876": {"license": "DL67890", "name": "Dr. Priya Patel"}
            }
            
            if abha_id in valid_abha and valid_abha[abha_id]["license"] == medical_license:
                user_data = valid_abha[abha_id]
                return {
                    "status": "success",
                    "user": {
                        "id": f"abha_{hash(abha_id) % 10000}",
                        "name": user_data["name"],
                        "abha_id": abha_id,
                        "medical_license": medical_license,
                        "role": "healthcare_provider",
                        "provider": "abha",
                        "verified": True
                    },
                    "session_token": f"session_{hash(abha_id + str(time.time())) % 100000}",
                    "expires_in": 3600  # 1 hour
                }
            else:
                return {"status": "error", "message": "Invalid ABHA credentials"}
        else:
            return {"status": "error", "message": "Invalid authentication method"}
            
    except Exception as e:
        return {"status": "error", "message": f"Authentication error: {str(e)}"}

@app.post("/api/audit")
def log_audit_event(request: dict):
    """Log audit events for healthcare compliance and security monitoring"""
    try:
        import json
        from datetime import datetime
        
        # Create audit log entry
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "event_type": request.get("event_type"),
            "user_id": request.get("user_id"),
            "session_id": request.get("session_id"),
            "ip_address": request.get("ip_address", "unknown"),
            "user_agent": request.get("user_agent", "unknown"),
            "action": request.get("action"),
            "resource": request.get("resource"),
            "metadata": request.get("metadata", {}),
            "compliance_level": "healthcare"
        }
        
        # In production, save to secure audit database
        # For demo, we'll just validate the structure
        required_fields = ["event_type", "user_id", "action"]
        missing_fields = [field for field in required_fields if not request.get(field)]
        
        if missing_fields:
            return {
                "status": "error", 
                "message": f"Missing required audit fields: {', '.join(missing_fields)}"
            }
        
        # Demo response (in production, save to audit log)
        return {
            "status": "success",
            "message": "Audit event logged successfully",
            "audit_id": f"audit_{hash(str(audit_entry)) % 100000}",
            "timestamp": audit_entry["timestamp"]
        }
        
    except Exception as e:
        return {"status": "error", "message": f"Audit logging error: {str(e)}"}
