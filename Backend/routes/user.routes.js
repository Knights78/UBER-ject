const express=require('express')
const router=express.Router()
const {body}=require('express-validator')
const userController=require('../controllers/user.controller')
const authMiddleware=require('../middlewares/auth.middleware')

router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),//check the email which is been provided by body is correct or not using the inbuilt function
    //similarly do for name and password as well
    body('fullname.firstname').isLength({min:3}).withMessage('name should have 3 characters'),
    body('password').isLength({min:6}).withMessage('password must be 6 chracters')
],userController.registerUser)


router.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('password must be 6 chracters')
],
    userController.loginUser
)
router.get('/profile',authMiddleware.authUser,userController.getProfile)
router.get('/logout',authMiddleware.authUser,userController.logoutUser)

module.exports=router