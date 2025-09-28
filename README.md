# 🏥 Who's My Doc - Healthcare Appointment Booking System

A modern, full-stack healthcare application that connects patients with doctors for seamless appointment booking and management.

## 🌟 Features

### For Patients
- 👤 **User Registration & Authentication** - Secure signup and login
- 🔍 **Doctor Search** - Find doctors by specialization, location, and availability
- 📅 **Appointment Booking** - Book appointments with preferred doctors
- 📋 **Medical History** - View previous appointments and medical records
- 📱 **Responsive Design** - Works seamlessly on all devices
- 📧 **Email Notifications** - Receive appointment confirmations via email

### For Doctors
- 👨‍⚕️ **Doctor Registration** - Register with medical credentials and specializations
- 📊 **Appointment Management** - View and manage patient appointments
- 👥 **Patient Records** - Access patient information and medical history
- ⏰ **Schedule Management** - Set availability and time slots
- 📈 **Dashboard Analytics** - Track appointments and patient statistics

### System Features
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Data Security** - Encrypted passwords and secure data handling
- 📧 **Email Integration** - Automated email notifications using Nodemailer
- 🌐 **RESTful API** - Well-structured API endpoints
- 📱 **Modern UI/UX** - Clean, intuitive interface with smooth animations

## 🎬 Demo Video

Watch the application in action:

[![Who's My Doc Demo](https://drive.google.com/file/d/1mE5Cc-c6eWxe0eA4sOSZjzgmCTEiUv12/view?usp=sharing)

*Click the image above to watch the demo video on YouTube*

> **Note:** Replace `YOUR_VIDEO_ID` with your actual YouTube video ID once you upload your demo video.

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications
- **Ant Design** - UI component library
- **CSS3** - Custom styling with modern CSS features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing and encryption
- **Nodemailer** - Email sending functionality
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
Who-s-My-Doc/
├── Backend/                    # Backend server code
│   ├── models/                # Database models (Doctor, Patient, BookingDetails)
│   ├── Routes/                # API route handlers
│   │   ├── Routes.login.js    # Authentication routes
│   │   ├── Routes.patient.js  # Patient-related routes
│   │   └── Routes.doctor.js   # Doctor-related routes
│   ├── helper/                # Utility functions
│   │   └── mailer.js         # Email functionality
│   ├── index.js              # Main server file
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables
│
├── frontend/                  # Frontend React application
│   ├── src/
│   │   ├── Components/       # React components
│   │   │   ├── Homepage/     # Landing page
│   │   │   ├── Login/        # Login page
│   │   │   ├── SignUp/       # Registration page
│   │   │   ├── Patient/      # Patient dashboard
│   │   │   ├── UserProfile/  # User profile management
│   │   │   └── Navbar/       # Navigation component
│   │   ├── config/           # Configuration files
│   │   │   └── api.js        # API endpoints configuration
│   │   ├── assets/           # Static assets (images, icons)
│   │   └── styles/           # Global styles
│   ├── package.json          # Frontend dependencies
│   └── .env                  # Frontend environment variables
│
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### Deployed Link
    https://who-s-my-doc.vercel.app/

### Installation

1. **Clone the repository**
   ```bash
   git clone http://github.com/Sagargupta028/who-s-My-Doc
   cd whos-my-doc
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

#### Backend (.env)
Create a `.env` file in the Backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/whosmydoc
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whosmydoc

# JWT Secret
JWT_SECRET_KEY=your_super_secret_jwt_key

# Email Configuration (Gmail)
EMAIL_ID=your-email@gmail.com
EMAIL_PASSKEY=your-app-password

# Server Configuration
PORT=3000
```

#### Frontend (.env)
Create a `.env` file in the frontend directory:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   # or for production
   npm start
   ```
   Server will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📊 Database Schema

### Doctor Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  qualification: String,
  specialisation: String,
  fees: Number,
  location: String,
  timeslots: [String]
}
```

### Patient Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  sex: String,
  phone: String,
  address: String
}
```

### BookingDetails Model
```javascript
{
  patient_email: String,
  doctor_email: String,
  date_of_appointment: Date,
  slot_booked: String,
  status: String (pending/confirmed/cancelled)
}
```

## 🔌 API Endpoints

### Authentication
- `POST /login` - User login (patients & doctors)
- `POST /register` - User registration

### Patient Routes
- `POST /patient/find-doctor` - Search for doctors
- `POST /patient/book-doctor` - Book an appointment
- `GET /patient/previous-records` - Get appointment history
- `POST /patient/cancel-appointment` - Cancel appointment
- `PUT /patient/update-profile` - Update patient profile
- `GET /patient/get-locations` - Get available locations
- `GET /patient/get-specialities` - Get medical specializations

### Doctor Routes
- `GET /doctor/appointments` - Get doctor's appointments
- `PUT /doctor/update-profile` - Update doctor profile

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Mobile-first design approach
- **Smooth Animations** - CSS transitions and micro-interactions
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Visual feedback during API calls
- **Form Validation** - Client-side and server-side validation
- **Accessibility** - WCAG compliant design elements

## 🔒 Security Features

- **Password Encryption** - Bcrypt hashing for secure password storage
- **JWT Authentication** - Stateless authentication with JSON Web Tokens
- **Input Validation** - Sanitization and validation of user inputs
- **CORS Configuration** - Proper cross-origin resource sharing setup
- **Environment Variables** - Sensitive data stored in environment files

## 📧 Email Integration

The application uses Nodemailer with Gmail SMTP for:
- **Appointment Confirmations** - Automatic emails when appointments are booked
- **Appointment Reminders** - Email notifications for upcoming appointments
- **Account Verification** - Email verification for new registrations

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Set up environment variables on your hosting platform
2. Configure MongoDB Atlas for production database
3. Deploy using Git integration or CLI tools

### Frontend Deployment (Netlify/Vercel)
1. Build the production version: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables for production API URL

## 🧪 Testing

### Test Credentials
**Doctors:**
- Email: `doctor1@gmail.com`
- Password: `doctor123`

**Patients:**
- Email: `user1@gmail.com`
- Password: `patient123`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request



## 🙏 Acknowledgments

- React community for excellent documentation
- MongoDB team for the robust database solution
- Express.js contributors for the web framework
- All open-source contributors who made this project possible

## 📞 Support

For support, email mrsagargupta028@example.com or create an issue in the GitHub repository.

---

**Made with ❤️ for better healthcare accessibility**
