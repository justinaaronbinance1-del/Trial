from fastapi import FastAPI, Request
from datetime import datetime

app = FastAPI()


@app.get("/")
def home():
    return {"Message": "✅ IOT Dashboard Backend is running!"}


# ESP32 sends its data here
@app.post("/data")
async def receive_data(request: Request):
    # Extract data from the POST request (supports form or JSON)
    form_data = await request.form()
    heart_rate = float(form_data.get("heart_rate", 0))
    motion = float(form_data.get("motion", 0))

    
    print("===================================")
    print(f"ESP32 Connected at: {datetime.now()}")
    print(f" Heart Rate: {heart_rate}")
    print(f" Motion: {motion}")
    print("===================================\n")

    
    return {
        "status": "✅ received successfully",
        "heart_rate": heart_rate,
        "motion": motion,
        "timestamp": datetime.now().isoformat()
    }
