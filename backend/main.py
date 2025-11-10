from fastapi import FastAPI, Request
from database import get_connection
import mysql.connector
from ml_models import rf_model, scaler, predict_activity, predict_condition
from sensors_data import load_sensor_data, validate_vital_signs
from compute_and_push import summary_compute, push_summary_db
from print_logs import print_sensor_log
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
            avg_heartrate, max_heartrate, min_heartrate, reading_count= summary_compute(cursor)
            stud_condition = predict_condition(state, heartRate_stat)

            print_sensor_log(
                data["timestamp"], data["ax"], data["ay"], data["az"],
                data["gx"], data["gy"], data["gz"],
                state, heartRate_stat, spo2_stat, stud_condition, avg_heartrate,
                max_heartrate, min_heartrate, reading_count
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

            push_summary_db(cursor, data, avg_heartrate, max_heartrate, min_heartrate, reading_count)


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
        "Min Heart Rate": min_heartrate,
        "Number of HR Readings": reading_count
    }  

@app.get("/latest")
def get_latest_sensor_data():
     try:
          connection = get_connection()
          cursor = connection.cursor(dictionary=True)

          cursor.execute("""
                SELECT * FROM heart_rate_motion_readings ORDER BY recorded_at DESC LIMIT 1
            """)
          latest_data = cursor.fetchone()

          if not latest_data:
               return {"status": "No data found"}

          cursor.execute("""
            SELECT avg_heart_rate, min_heart_rate, max_heart_rate, total_readings 
            FROM heart_rate_summary
            ORDER BY recorded_at DESC LIMIT 1
        """)
          summary_data = cursor.fetchone()

        
          combined_data = {**latest_data, **(summary_data or {})}

          return combined_data

     except mysql.connector.Error as e:
        return {"error": f"Database error: {e}"}

     finally:
           if connection.is_connected():
            cursor.close()
            connection.close()
               

