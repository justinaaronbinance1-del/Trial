from fastapi import FastAPI, Request, Form
from database import get_connection
from datetime import datetime, timedelta
import mysql.connector
from ml_models import rf_model, scaler, predict_activity, predict_condition
from sensors_data import load_sensor_data, validate_vital_signs
from compute_and_push import summary_compute, push_summary_db
from print_logs import print_sensor_log
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_or_create_user(username: str):
    """
    Returns (user_id, is_new_user)
    """
    connection = None
    cursor = None
    user_id = None
    is_new_user = False

    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE username=%s", (username,))
        row = cursor.fetchone()
        if row:
            user_id = row[0]
            is_new_user = False  # Existing user
        else:
            # Create new user
            cursor.execute("INSERT INTO users (username) VALUES (%s)", (username,))
            connection.commit()
            user_id = cursor.lastrowid
            is_new_user = True  # New user

    except mysql.connector.Error as e:
        print("Database error in get_or_create_user:", e)
        user_id = None
        is_new_user = False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

    return user_id, is_new_user


@app.get("/")
def home():
    return {"message": "IOT Dashboard Backend is running!"}

@app.post("/register_user")
async def register_user(username: str = Form(...)):
    username = username.strip()
    if not username:
        return {"status": "error", "message": "Username required!"}

    user_id, is_new_user = get_or_create_user(username)

    if is_new_user:
        message = f"Welcome, {username}! Your account has been created."
    else:
        message = f"Welcome back, {username}! We will load your data."

    if not user_id:
        return {"status": "error", "message": "Failed to create/get user. Check DB."}

    return {"status": "success", "user_id": user_id, "username": username, "message": message, "is_new_user": is_new_user}

@app.get("/get_user_id")
def get_user_id(username: str):
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT id FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()

        if user:
            return {"user_id": user["id"], "username": username}
        else: 
            return {"error": "User not found"}
        
    except mysql.connector.Error as e:
        return {"error": f"Database error: {e}"}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()




@app.post("/data")
async def receive_data(request: Request, user_id: int = Form(...)):
    if not user_id:
           return {"status": "error", "message": "User ID required before storing readings"}

    
    form_data = await request.form()
    data = load_sensor_data(form_data)

    connection = None
    cursor = None
    
    try: 
            connection = get_connection()
            cursor = connection.cursor()

            state = predict_activity(
                data["ax"], data["ay"], data["az"],
                data["gx"], data["gy"], data["gz"]
            )

            heartRate_stat, spo2_stat = validate_vital_signs(data["heartRate"], data["spo2"])

            avg_heartrate, max_heartrate, min_heartrate, reading_count= summary_compute(cursor, user_id)

            stud_condition = predict_condition(state, heartRate_stat)
            username = data["username"]

            print_sensor_log(
                user_id, username, data["timestamp"], data["ax"], data["ay"], data["az"],
                data["gx"], data["gy"], data["gz"],
                state, heartRate_stat, spo2_stat, stud_condition, avg_heartrate,
                max_heartrate, min_heartrate, reading_count
            )

            sql = """ 
                INSERT INTO heart_rate_motion_readings (user_id, recorded_at, ax, ay, az, gx, gy, gz, heart_rate, spo2, predicted_activity, stud_condition)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            values = (
                user_id, data["timestamp"], data["ax"],
                data["ay"], data["az"], data["gx"],
                data["gy"], data["gz"], heartRate_stat, spo2_stat, state, stud_condition
                
            )
            cursor.execute(sql, values)

        

            push_summary_db(cursor,user_id, data, avg_heartrate, max_heartrate, min_heartrate, reading_count)


            connection.commit()
            print("✅ Data successfully saved to heart_rate_motion_readings.")

    except mysql.connector.Error as e:
            print("❌ Database error:", e)

    finally: 
        if connection:
            if connection.is_connected():
                cursor.close()
                connection.close()

    return {
        "status": "Data received successfully ✅",
        "user": user_id,
        "username": username,
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
def get_latest_sensor_data(username: str):
     connection = None
     cursor = None
     try:
          connection = get_connection()
          cursor = connection.cursor(dictionary=True)

               # Get user_id
          cursor.execute("SELECT id FROM users WHERE username=%s", (username,))
          user = cursor.fetchone()
          if not user:
                return {"status": "error", "message": "User not found"}
          user_id = user["id"]


          cursor.execute("""
                SELECT * FROM heart_rate_motion_readings WHERE user_id=%s AND recorded_at >= CURDATE() AND recorded_at < CURDATE() + INTERVAL 1 DAY ORDER BY recorded_at DESC LIMIT 1
            """, (user_id,))
          
          latest_data = cursor.fetchone()

          if latest_data:
            last_update = latest_data["recorded_at"]
            # Consider connected if last reading is within last 30 seconds
            if last_update.tzinfo is not None:
                last_update = last_update.replace(tzinfo=None)
            device_status = "connected" if datetime.utcnow() - last_update <= timedelta(seconds=30) else "disconnected"
          else:
            last_update = None
            device_status = "disconnected"


          if not latest_data:
               return {"status": "No data found"}

          cursor.execute("""
            SELECT avg_heart_rate, min_heart_rate, max_heart_rate, total_readings 
            FROM heart_rate_summary
            WHERE user_id=%s
            ORDER BY recorded_at DESC LIMIT 1
        """, (user_id,))
          summary_data = cursor.fetchone()

        
          combined_data = {**(latest_data or {}), **(summary_data or {})}
          combined_data["device_status"] = device_status
          combined_data["last_update"] = last_update

          return combined_data

     except mysql.connector.Error as e:
        return {"error": f"Database error: {e}"}

     finally:
        if connection: 
            if connection.is_connected():
                cursor.close()
                connection.close()

@app.get("/daily")       
def get_daily_readings(username: str):
    connection = None
    cursor = None
    try: 
         connection = get_connection()
         cursor = connection.cursor(dictionary=True)

         cursor.execute("SELECT id FROM users WHERE username=%s", (username,))
         user = cursor.fetchone()
         if not user:
            return {"status": "error", "message": "User not found"}
         user_id = user["id"]


         cursor.execute("""
            SELECT * FROM heart_rate_motion_readings WHERE user_id=%s AND recorded_at >= CURDATE() AND recorded_at < CURDATE() + INTERVAL 1 DAY ORDER BY recorded_at ASC
           """, (user_id,))
         
         daily_data = cursor.fetchall()

         if not daily_data:
              return {"status": "No readings for today"}
         return {
              "status": "Success",
              "count": len(daily_data),
              "data": daily_data

         }
         
    except mysql.connector.Error as e:
         return {"error": f"Database error {e}"} 
         
    finally:    
         if connection: 
            if connection.is_connected():
                cursor.close()
                connection.close() 

