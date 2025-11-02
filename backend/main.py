from fastapi import FastAPI, Request
from datetime import datetime
from database import get_connection
import mysql.connector
import joblib
import pandas as pd

rf_model = joblib.load("rf_motion_model.pkl")
scaler = joblib.load("scaler.pkl")


app = FastAPI()

@app.get("/")
def home():
    return {"IOT Dashboard Backend is running!"}
  

def load_sensor_data(form_data):
    return{
        "ax" : float(form_data.get("ax", 0)),
        "ay" : float(form_data.get("ay", 0)),
        "az" : float(form_data.get("az", 0)),
        "gx" : float(form_data.get("gx", 0)),
        "gy" : float(form_data.get("gy", 0)),
        "gz" : float(form_data.get("gz", 0)),
        "heartRate" : int(form_data.get("heartRate", 0)),
        "spo2" : int(form_data.get("spo2", 0)),
        "wavePulse" : int(form_data.get("wavePulse", 0)),
        "timestamp" : datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def predict_activity(ax, ay, az, gx, gy, gz):
   features = pd.DataFrame([[ax,ay,az,gx,gy,gz]], columns=["ax", "ay", "az", "gx", "gy", "gz"])
   scaled = scaler.transform(features)
   prediction = rf_model.predict(scaled)[0]

   if prediction == 6:
       return "Running"
   elif prediction in [4,5]:
       return "Stationary"
   else: 
       return "Walking"
   


def validate_vital_signs(heartRate, spo2):
    heartRate_stat = heartRate if heartRate not in [999, -999] else "⚠️ No valid heart rate!"
    spo2_stat = spo2 if spo2 not in [999, -999] else "⚠️ No valid SpO₂!"
    return heartRate_stat, spo2_stat

     
def print_sensor_log(timestamp, ax, ay, az, gx, gy, gz, state, heartRate_stat, spo2_stat, wavePulse):
   
    print("===================================")
    print(f"📡 Data received at: {timestamp}")
    print(f"  ➤ Acceleration: X={ax:.2f}, Y={ay:.2f}, Z={az:.2f}")
    print(f"  ➤ Gyroscope:     X={gx:.2f}, Y={gy:.2f}, Z={gz:.2f}")
    print(f"  ➤ Activity:      {state}")
    print(f"  ➤ Heart Rate:    {heartRate_stat}")
    print(f"  ➤ SpO₂:          {spo2_stat}")
    print(f"  ➤ Wave Pulse:    {wavePulse}")("===================================\n")    


@app.post("/data")
async def receive_data(request: Request):
    
    form_data = await request.form()
    data = load_sensor_data(form_data)
    
    state = predict_activity(
        data["ax"], data["ay"], data["az"],
        data["gx"], data["gy"], data["gz"]
    )

    heartRate_stat, spo2_stat = validate_vital_signs(data["heartRate"], data["spo2"])



    print_sensor_log(
        data["timestamp"], data["ax"], data["ay"], data["az"],
        data["gx"], data["gy"], data["gz"],
        state, heartRate_stat, spo2_stat, data["wavePulse"]
    )
    

    try: 
            connection = get_connection()
            cursor = connection.cursor()

            sql = """ 
                INSERT INTO heart_rate_motion_readings (recorded_at, ax, ay, az, gx, gy, gz, heart_rate, spo2, predicted_activity, stud_condition)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            values = (
                data["timestamp"], data["ax"],
                data["ay"], data["az"], data["gx"],
                data["gy"], data["gz"], heartRate_stat, spo2_stat, state, None
                
            )
            cursor.execute(sql, values)
            connection.commit()
            print("✅ Data successfully saved to heart_rate_motion_readings.")

    except mysql.connector.Error as e:
            print("❌ Database error:", e)

    finally: 
        if connection.is_connected():
            cursor.close()
            connection.close()


            return {
                "status": "Data received successfully ✅",
                "timestamp": data["timestamp"],
                "acceleration": {"x": data["ax"], "y": data["ay"], "z": data["az"]},
                "gyroscope": {"x": data["gx"], "y": data["gy"], "z": data["gz"]},
                "heartrate": heartRate_stat,
                "oxygen_saturation": spo2_stat,
                "waveform_value": data["wavePulse"]
            }