from fastapi import FastAPI, Request
from datetime import datetime


app = FastAPI()


@app.get("/")
def home():
    return {"Message": "IOT Dashboard Backend is running!"}


@app.post("/data")
async def receive_data(request: Request):
    
    form_data = await request.form()
    heart_rate = float(form_data.get("heart_rate", 0))
    motion_num = int(form_data.get("motion", 0))
    timestamp = datetime.now()  

    motion_dict = {0: "Standby", 1: "Running", 2: "Moving"}
    motion_str = motion_dict.get(motion_num, "Unknown")

    
    print(f"===================================")
    print(f"ESP32 Connected at: {timestamp}")
    print(f" Heart Rate: {heart_rate}")
    print(f" Motion: {motion_str}")
    print(f"===================================\n")

    
    return {
        "status": " received successfully",
        "heart_rate": heart_rate,
        "motion": motion_str,
        "timestamp": timestamp.isoformat()
    }
