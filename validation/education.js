const validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
    let errors = {}

    const dcopy = {
        school: Object.keys(data).includes("school") ? data.school : "",
        degree: Object.keys(data).includes("degree") ? data.degree : "",
        fieldOfStudy: Object.keys(data).includes("fieldOfStudy") ? data.fieldOfStudy : "",
        from: Object.keys(data).includes("from") ? data.from : ""
    }

    if (validator.isEmpty(dcopy.school)) {
        errors.school = "School field is required";
    }

    if (validator.isEmpty(dcopy.degree)) {
        errors.degree = "Degree field is required";
    }

    if (validator.isEmpty(dcopy.fieldOfStudy)) {
        errors.fieldOfStudy = "Field of study is required";
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