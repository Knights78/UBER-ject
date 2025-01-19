const {validationResult }=require('express-validator')
const Captain=require('../models/captain.model')
const blackListTokenModel = require('../models/blackListToken.model');
module.exports.registerCaptain=async(req,res)=>{
    
        const errors = validationResult(req);
       // console.log(errors)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { fullname, email, password, vehicle } = req.body;
       // console.log(fullname,email,password,vehicle)
    
        try {
            let captain = await Captain.findOne({ email });
            if (captain) {
                return res.status(400).json({ message: 'Captain already exists' });
            }
    
            const hashedPassword = await Captain.hashPassword(password);
    
            captain = new Captain({
                fullname: {
                    firstname: fullname.firstname,
                    lastname: fullname.lastname
                },
                email,
                password: hashedPassword,
                vehicle: {
                    color: vehicle.color,
                    plate: vehicle.plate,
                    capacity: vehicle.capacity,
                    vehicleType: vehicle.vehicleType
                }
            });
            console.log("CAPTAIN",captain)
    
            await captain.save();
    
            const token = captain.generateAuthToken();
            res.status(201).json({ token,captain });
        } catch (err) {
            res.status(500).send('Server error whatt????');
        }
    
}
module.exports.captainLogin=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const captain = await Captain.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = captain.generateAuthToken();
        res.cookie('token', token);

        res.status(200).json({ token, captain });
        
    } catch (err) {
        res.status(500).send('Server error');
    }
}
module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}