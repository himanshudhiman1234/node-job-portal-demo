const User = require("../models/userModel");

const updateController = async (req, res, next) => {
    try {
        const { name, email, lastname, password, location } = req.body;

        if (!name || !email || !lastname || !password) {
            return next("Please provide all fields");
        }

        const user = await User.findOne({ _id: req.user.userId });

        if (!user) {
            return next("User not found");
        }

        user.name = name;
        user.lastname = lastname;
        user.email = email;
        user.location = location;
        user.password = password; // This will trigger the pre-save hook to hash the password

        await user.save();

        const token = user.createJWT();

        res.status(200).json({
            user,
            token
        });
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
};

module.exports = updateController;
