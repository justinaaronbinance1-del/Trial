from fastapi import FastAPI, Request
from datetime import datetime
from database import get_connection


app = FastAPI()


@app.get("/")
def home():
    return {"Message": "IOT Dashboard Backend is running!"}


@app.post("/data")
async def receive_data(request: Request):
    
    form_data = await request.form()
    
    accX = float(form_data.get("accX", 0))
    accY = float(form_data.get("accY", 0))
    accZ = float(form_data.get("accZ", 0))
    gX = float(form_data.get("gX", 0))
    gY = float(form_data.get("gY", 0))
    gZ = float(form_data.get("gZ", 0))

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Print in a clean format
    print("===================================")
    print(f"📡 Data received at: {timestamp}")
    print(f"  ➤ Acceleration: X={accX:.2f}, Y={accY:.2f}, Z={accZ:.2f}")
    print(f"  ➤ Gyroscope:     X={gX:.2f}, Y={gY:.2f}, Z={gZ:.2f}")
    print("===================================\n")

    # Respond back to ESP32
    return {
        "status": "Data received successfully ✅",
        "timestamp": timestamp,
        "acceleration": {"x": accX, "y": accY, "z": accZ},
        "gyroscope": {"x": gX, "y": gY, "z": gZ}
    }