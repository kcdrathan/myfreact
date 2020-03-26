const validator = require("validator");

const isEmpty = require("./is-empty");
const Profile = require("../models/Profile")

function validURL(data, key, errors) {
    if (Object.keys(data).includes(key) &&
        !isEmpty(data[key] || "")) {
        if (!validator.isURL(data[key] || "")) {
            errors.website = "URL is not valid"
        }
    }
    return errors
}

module.exports = function validateProfileInput(data) {
    let errors = {}

    const dcopy = {
        handle: Object.keys(data).includes("handle") ? data.handle : "",
        status: Object.keys(data).includes("status") ? data.status : "",
        skills: Object.keys(data).includes("skills") ? data.skills : ""
    }

    if (!validator.isLength(dcopy.handle, {min: 4, max: 40})) {
        errors.handle = "Handle needs to be between 2 and 4 charecters"
    }

    if (validator.isEmpty(dcopy.handle)) {
        errors.handle = "Profile handle is required"
    }

    if (validator.isEmpty(dcopy.status)) {
        errors.status = "Status field is required"
    }

    if (validator.isEmpty(dcopy.skills)) {
        errors.skills = "Skills field is required"
    }

    if (Object.keys(data).includes("website") && !isEmpty(data.website || "")) {
        if (!validator.isURL(data.website || "")) {
            errors.website = "URL is not valid"
        }
    }

    for (const socialKey of Object.keys(Profile.schema.tree.social)) {
        errors = validURL(data, socialKey, errors)
    }

    // console.log("data: %j", data)
    // console.log("dcopy: %j",dcopy)

    return {
        errors,
        isValid: isEmpty(errors)
    }
}