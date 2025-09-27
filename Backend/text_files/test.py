import sqlite3

# Connect to the database
conn = sqlite3.connect('create_database.sql')
cursor = conn.cursor()

# Get a list of all tables in the database
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

# Iterate over each table
for table in tables:
    table_name = table[0]
    print(f"Table: {table_name}")
    # Execute a query to select all data from the table
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    # Print the rows
    for row in rows:
        print(row)
    print()  # Print an empty line between tables

# Close the cursor and connection
cursor.close()
conn.close()
