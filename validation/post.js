const validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
    let errors = {}

    const dcopy = {
        text: Object.keys(data).includes("text") ? data.text : ""
    }

    if (!validator.isLength(dcopy.text, { min:5, max:300 })) {
        errors.text = "Text field requires atlest 5 charecters"
    }

    if (validator.isEmpty(dcopy.text)) {
        errors.text = "Text field is required";
    }

    // console.log("data: %j", data)
    // console.log("dcopy: %j",dcopy)

    return {
        errors,
        isValid: isEmpty(errors)
    }
}