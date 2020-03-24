const validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {}

    const dcopy = {
        email: Object.keys(data).includes("email") ? data.email : "",
        password: Object.keys(data).includes("password") ? data.password : "",
    }

    if (!validator.isEmail(dcopy.email)) {
        errors.email = "Email is Invalid"
    }

    if (validator.isEmpty(dcopy.email)) {
        errors.email = "Email is required";
    }

    if (validator.isEmpty(dcopy.password)) {
        errors.password = "Password is required";
    }

    console.log("data: %j", data)
    console.log("dcopy: %j",dcopy)

    return {
        errors,
        isValid: isEmpty(errors)
    }
}