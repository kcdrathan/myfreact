const validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {}

    const dcopy = {
        name: Object.keys(data).includes("name") ? data.name : "",
        email: Object.keys(data).includes("email") ? data.email : "",
        password: Object.keys(data).includes("password") ? data.password : "",
        cpassword: Object.keys(data).includes("cpassword") ? data.cpassword : ""
    }

    
    if (validator.isEmpty(dcopy.name)) {
        errors.name = "Name field is required";
    }

    if (!validator.isLength(dcopy.name, { min: 4, max:30 })) {
        errors.name = "Name must be in between length 4 to 30 charecters"
    }    

    if (validator.isEmpty(dcopy.email)) {
        errors.email = "Email field is required";
    }

    if (!validator.isEmail(dcopy.email)) {
        errors.email = "Email field is Invalid"
    }

    if (validator.isEmpty(dcopy.password)) {
        errors.password = "Password is required";
    }

    if (!validator.isLength(dcopy.password, { min: 6, max:15 })) {
        errors.password = "Password must be atleast 6 charecters"
    }

    if (validator.isEmpty(dcopy.cpassword)) {
        errors.cpassword = "Password confirmation is required";
    }

    if (!validator.equals(dcopy.cpassword, dcopy.password)) {
        errors.cpassword = "Passwords doesn't match";
    }

    console.log("data: %j", data)
    console.log("dcopy: %j",dcopy)

    return {
        errors,
        isValid: isEmpty(errors)
    }
}