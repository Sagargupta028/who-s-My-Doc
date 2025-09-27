const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Hash password function
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Doctor data from Docs.txt
const doctorsData = [
    {
        username: 'doctor1',
        email: 'doctor1@gmail.com',
        name: 'Rajesh Kumar',
        qualification: 'MD',
        specialisation: 'Cardiologist',
        fees: 500,
        timeslot_start: 9,
        timeslot_end: 13,
        location: 'Kalyani'
    },
    {
        username: 'doctor2',
        email: 'doctor2@gmail.com',
        name: 'Anjali Sharma',
        qualification: 'MD',
        specialisation: 'Neurologist',
        fees: 600,
        timeslot_start: 10,
        timeslot_end: 14,
        location: 'Kanchrapara'
    },
    {
        username: 'doctor3',
        email: 'doctor3@gmail.com',
        name: 'Manish Gupta',
        qualification: 'MD',
        specialisation: 'Cardiologist',
        fees: 700,
        timeslot_start: 11,
        timeslot_end: 15,
        location: 'Kalyani'
    },
    {
        username: 'doctor4',
        email: 'doctor4@gmail.com',
        name: 'Priya Mishra',
        qualification: 'MD',
        specialisation: 'Neurologist',
        fees: 550,
        timeslot_start: 8,
        timeslot_end: 12,
        location: 'Kalyani'
    },
    {
        username: 'doctor5',
        email: 'doctor5@gmail.com',
        name: 'Ajay Singh',
        qualification: 'MD',
        specialisation: 'Cardiologist',
        fees: 800,
        timeslot_start: 12,
        timeslot_end: 16,
        location: 'Kanchrapara'
    },
    {
        username: 'doctor6',
        email: 'doctor6@gmail.com',
        name: 'Shweta Patel',
        qualification: 'MD',
        specialisation: 'Gynecologist',
        fees: 650,
        timeslot_start: 13,
        timeslot_end: 17,
        location: 'Kalyani'
    },
    {
        username: 'doctor7',
        email: 'doctor7@gmail.com',
        name: 'Rahul Verma',
        qualification: 'MD',
        specialisation: 'Cardiologist',
        fees: 750,
        timeslot_start: 14,
        timeslot_end: 18,
        location: 'Kalyani'
    },
    {
        username: 'doctor8',
        email: 'doctor8@gmail.com',
        name: 'Neeta Singh',
        qualification: 'MD',
        specialisation: 'Neurologist',
        fees: 600,
        timeslot_start: 15,
        timeslot_end: 19,
        location: 'Kalyani'
    },
    {
        username: 'doctor9',
        email: 'doctor9@gmail.com',
        name: 'Sufiyaan Qureshi',
        qualification: 'MD',
        specialisation: 'Neurologist',
        fees: 700,
        timeslot_start: 16,
        timeslot_end: 20,
        location: 'Naihati'
    },
    {
        username: 'doctor10',
        email: 'doctor10@gmail.com',
        name: 'Pooja Gupta',
        qualification: 'MD',
        specialisation: 'Cardiologist',
        fees: 800,
        timeslot_start: 17,
        timeslot_end: 21,
        location: 'Kalyani'
    },
    {
        username: 'mrsagargupta028',
        email: 'mrsagargupta028@gmail.com',
        name: 'Dr. Sagar Gupta',
        qualification: 'MD',
        specialisation: 'Cardiologist',
        fees: 1000,
        timeslot_start: 9,
        timeslot_end: 17,
        location: 'Kalyani'
    }
];

// Patient data from Users.txt
const patientsData = [
    { username: 'user1', email: 'user1@gmail.com', name: 'Rajesh Kumar', age: 40, sex: 'male', address: 'Naihati' },
    { username: 'user2', email: 'user2@gmail.com', name: 'Anjali Sharma', age: 35, sex: 'female', address: 'Kalyani' },
    { username: 'user3', email: 'user3@gmail.com', name: 'Manish Gupta', age: 45, sex: 'male', address: 'Kolkata' },
    { username: 'user4', email: 'user4@gmail.com', name: 'Priya Mishra', age: 38, sex: 'female', address: 'Barrackpore' },
    { username: 'user5', email: 'user5@gmail.com', name: 'Ajay Singh', age: 27, sex: 'male', address: 'Sealdah' },
    { username: 'user6', email: 'user6@gmail.com', name: 'Shweta Patel', age: 42, sex: 'female', address: 'Central Park- Kalyani' },
    { username: 'user7', email: 'user7@gmail.com', name: 'Rahul Verma', age: 48, sex: 'male', address: 'Kankinara' },
    { username: 'user8', email: 'user8@gmail.com', name: 'Neeta Singh', age: 54, sex: 'female', address: 'DumDum' },
    { username: 'user9', email: 'user9@gmail.com', name: 'Suresh Yadav', age: 55, sex: 'male', address: 'Sodpur' },
    { username: 'user10', email: 'user10@gmail.com', name: 'Pooja Gupta', age: 33, sex: 'female', address: 'Palta' },
    { username: 'user11', email: 'user11@gmail.com', name: 'Amit Patel', age: 25, sex: 'male', address: 'Bidhannagar' },
    { username: 'user12', email: 'user12@gmail.com', name: 'Fatima Ansari', age: 39, sex: 'female', address: 'Ballygunge' },
    { username: 'user13', email: 'user13@gmail.com', name: 'Rahul Singh', age: 30, sex: 'male', address: 'Baguiati' },
    { username: 'user14', email: 'user14@gmail.com', name: 'Sneha Gupta', age: 22, sex: 'female', address: 'Behala' },
    { username: 'user15', email: 'user15@gmail.com', name: 'Joseph Mathew', age: 47, sex: 'male', address: 'Dum Dum' },
    { username: 'user16', email: 'user16@gmail.com', name: 'Shreya Das', age: 29, sex: 'female', address: 'Garia' },
    { username: 'user17', email: 'user17@gmail.com', name: 'Mohammed Ali', age: 36, sex: 'male', address: 'Salt Lake' },
    { username: 'user18', email: 'user18@gmail.com', name: 'Swati Mishra', age: 26, sex: 'female', address: 'New Town' },
    { username: 'user19', email: 'user19@gmail.com', name: 'Rajesh Tiwari', age: 31, sex: 'male', address: 'Howrah' },
    { username: 'user20', email: 'user20@gmail.com', name: 'Meera Singh', age: 28, sex: 'female', address: 'Bally' }
];

async function seedDatabase() {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await Doctor.deleteMany({});
        await Patient.deleteMany({});
        console.log('Existing data cleared.');

        // Add doctors
        console.log('Adding doctors...');
        for (let doctorData of doctorsData) {
            const hashedPassword = await hashPassword('doctor123'); // Default password
            const doctor = new Doctor({
                ...doctorData,
                password: hashedPassword,
                review: 0,
                count: 0
            });
            await doctor.save();
            console.log(`Added doctor: ${doctor.name}`);
        }

        // Add patients
        console.log('Adding patients...');
        for (let patientData of patientsData) {
            const hashedPassword = await hashPassword('patient123'); // Default password
            const patient = new Patient({
                ...patientData,
                password: hashedPassword
            });
            await patient.save();
            console.log(`Added patient: ${patient.name}`);
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log(`📊 Added ${doctorsData.length} doctors and ${patientsData.length} patients`);
        console.log('\n🔑 Default Passwords:');
        console.log('   Doctors: doctor123');
        console.log('   Patients: patient123');
        console.log('\n🏥 Available Locations:');
        const locations = [...new Set(doctorsData.map(d => d.location))];
        console.log(`   ${locations.join(', ')}`);
        console.log('\n👨‍⚕️ Available Specializations:');
        const specializations = [...new Set(doctorsData.map(d => d.specialisation))];
        console.log(`   ${specializations.join(', ')}`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
        process.exit(0);
    }
}

// Run the seeding
seedDatabase();
