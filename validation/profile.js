const validator = require("validator");

const isEmpty = require("./is-empty");

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

    if (Object.keys(data).includes("youtube") && !isEmpty(data.youtube || "")) {
        if (!validator.isURL(data.youtube || "")) {
            errors.youtube = "URL is not valid"
        }
    }

    if (Object.keys(data).includes("instagram") && !isEmpty(data.instagram || "")) {
        if (!validator.isURL(data.instagram || "")) {
            errors.instagram = "URL is not valid"
        }
    }

    if (Object.keys(data).includes("linkedIn") && !isEmpty(data.linkedIn || "")) {
        if (!validator.isURL(data.linkedIn || "")) {
            errors.linkedIn = "URL is not valid"
        }
    }

    if (Object.keys(data).includes("facebook") && !isEmpty(data.facebook || "")) {
        if (!validator.isURL(data.facebook || "")) {
            errors.facebook = "URL is not valid"
        }
    }

    if (Object.keys(data).includes("twitter") && !isEmpty(data.twitter || "")) {
        if (!validator.isURL(data.twitter)) {
            errors.twitter = "URL is not valid"
        }
    }

    // console.log("data: %j", data)
    // console.log("dcopy: %j",dcopy)

    return {
        errors,
        isValid: isEmpty(errors)
    }
}