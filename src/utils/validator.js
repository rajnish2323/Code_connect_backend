const validator = require('validator');
const mongoose = require('mongoose');

const usersignupdata = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is required");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }

    // Optional: return true or something if validation passed
    return true;
};

const validateEditProfileData = (reqBody) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "skills", "photoUrl","about","age"];
    const isEditAllowed = Object.keys(reqBody).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
};


module.exports = usersignupdata;
module.exports= validateEditProfileData;
