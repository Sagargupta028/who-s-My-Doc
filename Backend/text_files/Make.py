import sqlite3

# Function to create tables
def create_tables(cursor):
    cursor.execute('DROP TABLE IF EXISTS Patient')
    cursor.execute('''CREATE TABLE IF NOT EXISTS Patient (
                        username TEXT,
                        email VARCHAR(255) PRIMARY KEY,
                        name TEXT,
                        age INTEGER,
                        sex TEXT,
                        location TEXT
                    );''')

    cursor.execute('DROP TABLE IF EXISTS Doctor')
    cursor.execute('''CREATE TABLE IF NOT EXISTS Doctor (
                        username TEXT,
                        email VARCHAR(255),
                        name TEXT,
                        regno VARCHAR(100) PRIMARY KEY,
                        qualification TEXT,
                        specialisation TEXT,
                        experience INTEGER,
                        fees REAL,
                        timeslot_start FLOAT,
                        timeslot_end FLOAT
                    );''')

    cursor.execute('DROP TABLE IF EXISTS Booking_details')
    cursor.execute('''CREATE TABLE IF NOT EXISTS Booking_details (
                        doctorid TEXT,
                        patientid TEXT,
                        slot TEXT,
                        status TEXT,
                        PRIMARY KEY (doctorid, slot),
                        FOREIGN KEY (doctorid) REFERENCES Doctor(regno),
                        FOREIGN KEY (patientid) REFERENCES Patient(email)
                    )''')

'''
 with open('Users.txt', 'r') as file:
        patients_data = [line.strip().split(',') for line in file.readlines()]
    cursor.executemany('INSERT INTO Patient VALUES (?, ?, ?, ?, ?, ?)', patients_data)
'''
# Function to populate tables from text files
def populate_tables(cursor, conn):
    
    with open('Users.txt', 'r') as file:
        users_data = [line.strip().split(',') for line in file.readlines()]
    cursor.executemany('INSERT INTO Patient VALUES (?, ?, ?, ?, ?, ?)', users_data)

    with open('Docs.txt', 'r') as file:
        doctors_data = [line.strip().split(',') for line in file.readlines()]
    cursor.executemany('INSERT INTO Doctor VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', doctors_data)

    with open('Slots.txt', 'r') as file:
        bookings_data = [line.strip().split(',') for line in file.readlines()]
    cursor.executemany('INSERT INTO Booking_details VALUES (?, ?, ?, ?)', bookings_data)
    conn.commit()


def main():
    conn = sqlite3.connect('clinic.db')
    cursor = conn.cursor()
    create_tables(cursor)
    populate_tables(cursor, conn)
    conn.close()


if __name__ == '__main__':
    main()
