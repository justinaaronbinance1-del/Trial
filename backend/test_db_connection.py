from database import get_connection

# Try connecting
conn = get_connection()

if conn:
    print("✅ Successfully connected to the database!")

    # Run a simple query to confirm access
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES;")

    print("📋 Tables in the database:")
    for table in cursor.fetchall():
        print("-", table[0])

    # Close connection
    cursor.close()
    conn.close()
else:
    print("❌ Connection failed.")
