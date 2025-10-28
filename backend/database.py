import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",          # XAMPP default
            user="root",               # phpMyAdmin default
            password="",               # leave blank if no password
            database="health_monitoring"  # your DB name
        )
        return connection
    except Error as e:
        print("❌ Error connecting to MySQL:", e)
        return None