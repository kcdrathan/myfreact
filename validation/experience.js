const validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateExpInput(data) {
    let errors = {}

    const dcopy = {
        title: Object.keys(data).includes("title") ? data.title : "",
        company: Object.keys(data).includes("company") ? data.company : "",
        from: Object.keys(data).includes("from") ? data.from : ""
    }

    if (validator.isEmpty(dcopy.title)) {
        errors.title = "Job title is required";
    }

    if (validator.isEmpty(dcopy.company)) {
        errors.company = "Company field is required";
    }

    if (validator.isEmpty(dcopy.from)) {
        errors.from = "From date field is required";
    }

    // console.log("data: %j", data)
    // console.log("dcopy: %j",dcopy)

    return {
        errors,
        isValid: isEmpty(errors)
    }
}