from fastapi import FastAPI, Request
from datetime import datetime
from database import get_connection
import mysql.connector
import joblib
import pandas as pd



rf_model = joblib.load("rf_motion_model.pkl")
scaler = joblib.load("scaler.pkl")
heartrate_avg = 0
min_heartrate = 0
max_heartrate = 0

app = FastAPI()

@app.get("/")
def home():
    return {"message": "IOT Dashboard Backend is running!"}


@app.post("/data")
async def receive_data(request: Request):
    
    form_data = await request.form()
    data = load_sensor_data(form_data)
    
    try: 
            connection = get_connection()
            cursor = connection.cursor()

            state = predict_activity(
                data["ax"], data["ay"], data["az"],
                data["gx"], data["gy"], data["gz"]
            )

            heartRate_stat, spo2_stat = validate_vital_signs(data["heartRate"], data["spo2"])
            avg_heartrate, max_heartrate, min_heartrate = summary_compute(cursor)
            stud_condition = predict_condition(state, heartRate_stat)

            print_sensor_log(
                data["timestamp"], data["ax"], data["ay"], data["az"],
                data["gx"], data["gy"], data["gz"],
                state, heartRate_stat, spo2_stat, stud_condition, avg_heartrate,
                max_heartrate, min_heartrate
            )


            sql = """ 
                INSERT INTO heart_rate_motion_readings (recorded_at, ax, ay, az, gx, gy, gz, heart_rate, spo2, predicted_activity, stud_condition)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            values = (
                data["timestamp"], data["ax"],
                data["ay"], data["az"], data["gx"],
                data["gy"], data["gz"], heartRate_stat, spo2_stat, state, stud_condition
                
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
                "stud_condition": stud_condition,
                "AVG Heart Rate": avg_heartrate,
                "Max Heart Rate": max_heartrate,
                "Min Heart Rate": min_heartrate
            }  

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

def predict_condition(state, heartRate_stat):
     if heartRate_stat == "⚠️ No valid heart rate!":
        return  "No valid heart rate!"
     elif state == "Walking":
          if 190 < heartRate_stat:
             return "High Heart Rate while Walking!"
          else:
               return "Normal"
     elif state == "Stationary":
          if 160 < heartRate_stat:
               return "High Heart Rate while not Moving!"
          else: 
               return "Normal"
     elif state == "Running":
          if 210 < heartRate_stat:
               return "High Heart Rate While Running!"
          return "Normal"
     else: 
          return "Normal"
   
def validate_vital_signs(heartRate, spo2):
    heartRate_stat = heartRate if heartRate not in [999, -999, 0] else "⚠️ No valid heart rate!"
    spo2_stat = spo2 if spo2 not in [999, -999, 0] else "⚠️ No valid SpO₂!"
    return heartRate_stat, spo2_stat
    
def summary_compute(cursor):
       cursor.execute("""
    SELECT AVG(heart_rate), MAX(heart_rate), MIN(heart_rate) FROM heart_rate_motion_readings
    """) 
       avg_heartrate, max_heartrate, min_heartrate = cursor.fetchone()
       return avg_heartrate, max_heartrate, min_heartrate

     
def print_sensor_log(timestamp, ax, ay, az, gx, gy, gz, state, heartRate_stat, spo2_stat, stud_condition, avg_heartrate, max_heartrate,
                     min_heartrate):
   
    print("===================================")
    print(f"📡 Data received at: {timestamp}")
    print(f"  ➤ Acceleration: X={ax:.2f}, Y={ay:.2f}, Z={az:.2f}")
    print(f"  ➤ Gyroscope:     X={gx:.2f}, Y={gy:.2f}, Z={gz:.2f}")
    print(f"  ➤ Activity:      {state}")
    print(f"  ➤ Heart Rate:    {heartRate_stat}")
    print(f"  ➤ SpO₂:          {spo2_stat}")
    print(f"  ➤ Student Condition:          {stud_condition}")
    print(f"  ➤ AVG Heart Rate:          {int(avg_heartrate)}")
    print(f"  ➤ Max Heart Rate:          {max_heartrate}")
    print(f"  ➤ Min Heart Rate:          {min_heartrate}")
    print("===================================\n")    


