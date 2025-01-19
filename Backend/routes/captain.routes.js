const express=require('express')
const authMiddleware=require('../middlewares/auth.middleware')
const {body}=require('express-validator')
const captaincontroller=require('../controllers/captain.controller')
const router=express.Router()
// Register route
router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('Firstname must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min: 3 }).withMessage('Lastname must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type')
], captaincontroller.registerCaptain)

// Login route
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
], captaincontroller.captainLogin)

router.get('/profile', authMiddleware.authCaptain, captaincontroller.getCaptainProfile)

router.get('/logout', authMiddleware.authCaptain, captaincontroller.logoutCaptain)

module.exports=router