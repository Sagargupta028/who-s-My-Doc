const express = require('express')
const { comparePassword } = require('../helper/authHelper')
const Router = express.Router()
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (models) => {
    const { Doctor, Patient } = models;

    async function verifyToken(req, res, next) {
        // Check for token in headers
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        
        if (!token) {
            // No token provided, continue to regular login
            return next();
        }
        
        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            
            // Find user based on type
            const Model = decoded.type === 'doctor' ? Doctor : Patient;
            const user = await Model.findOne({ email: decoded.email }).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'User not found'
                });
            } else {
                return res.json({
                    status: true,
                    user: { ...user.toObject(), type: decoded.type }
                });
            }
        } catch (err) {
            console.log('Token verification error:', err.message);
            return res.status(401).json({
                status: false,
                message: 'Invalid token'
            });
        }
    }

    Router.post('/', verifyToken, async (req, res) => {
        try {
            const { email, password, type } = req.body;
            
            // Check if credentials are provided (for regular login)
            if (!email || !password || !type) {
                return res.status(400).json({
                    status: false,
                    message: 'Email, password, and type are required'
                });
            }
            
            // Validate type
            if (type !== 'doctor' && type !== 'patient') {
                return res.status(400).json({
                    status: false,
                    message: 'Type must be either "doctor" or "patient"'
                });
            }
            
            // Determine which model to use
            const Model = type === 'doctor' ? Doctor : Patient;
            
            const user = await Model.findOne({ email: email });
            
            if (!user) {
                return res.json({ 
                    status: false, 
                    message: "Invalid email" 
                });
            } else {
                // Password matching
                const match = await comparePassword(password, user.password);
                if (!match) {
                    return res.json({
                        status: false,
                        message: 'Incorrect Password'
                    });
                } else {
                    // Create user object without password
                    const userResponse = user.toObject();
                    delete userResponse.password;
                    
                    // Generate token
                    const token = jwt.sign({ email: user.email, type: type }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
                    
                    return res.json({
                        status: true,
                        user: { ...userResponse, "type": type },
                        token
                    });
                }
            }
        } catch (error) {
            console.log('Login error:', error);
            return res.status(500).json({
                status: false,
                message: "Error in login",
                error: error.message
            });
        }
    })
    return Router
}


