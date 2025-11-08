from datetime import datetime

heartrate_avg = 0
min_heartrate = 0
max_heartrate = 0


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

def validate_vital_signs(heartRate, spo2):
    heartRate_stat = heartRate if heartRate not in [999, -999, 0] else None
    spo2_stat = spo2 if spo2 not in [999, -999, 0] else None
    return heartRate_stat, spo2_stat
  
  

