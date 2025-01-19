const userModel=require('../models/user.model')
const {validationResult}=require('express-validator')
const userService=require('../services/user.service')
const blackListTokenModel=require('../models/blackListToken.model')
module.exports.registerUser=async(req,res,next)=>{
    const errors=validationResult(req);//this will check if there are any errors or not
   // console.log(errors)
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }
    //after this check if user alreadey exists or not
    const { fullname, email, password } = req.body;
   // console.log(req.body)
    const isUserAlready=await userModel.findOne({email})
    if(isUserAlready)
    {
        return res.status(400).json({ message: 'User already exist' });
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user=await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });
    const token=user.generateAuthToken();
    return res.json({message:"User registered succusfully",token,user})

}
module.exports.loginUser=async(req,res,next)=>{
    const errors=validationResult(req);//this will check if there are any errors or not
    // console.log(errors)
     if(!errors.isEmpty())
     {
         return res.status(400).json({ errors: errors.array() });
     }
     //after this check if user alreadey exists or not
     const {  email, password } = req.body;
    //frst find whether this email exist or not
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = user.generateAuthToken();

    res.cookie('token', token);//TOKEN SET 

    res.status(200).json({ token, user });

}
module.exports.getProfile=async(req,res)=>{
    //for getting the profile we cheked hwheter the user is authorized or not first
    res.status(200).json(req.user);
}
module.exports.logoutUser=async(req,res)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });
}