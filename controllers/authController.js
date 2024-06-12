const User  = require('../models/userModel')


const registerController = async(req,res,next) =>{
try{
    const {name,email,password} = req.body;
    if(!name){
       next('name is required')
    }
    if(!email){
    next("email is required")
    }
    if(!password){
       next("password is required and greater than 6  character")
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(200).send({
            success:false,
            message:"Email Already Register Please login"
        })
    }

    const user = await User.create({name,email,password})

    const token = user.createJWT();


    res.status(201).send({
        success:true,
        message:"User created Successfully",
        user:{
            name:user.name,
            lastName:user.lastName,
            email:user.email,
            location:user.location
        },
        user,
        token
    })
}catch(err){
  next(err)
}
}

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return next(new Error("Please provide all fields"));
        }

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        
       
        if (!user) {
            return next(new Error("Invalid username or password"));
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new Error("Invalid username or password"));
        }
        user.password = undefined
        const token = user.createJWT();

        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token
        });
    } catch (err) {
        next(err);
    }
};module.exports = {registerController,loginController}