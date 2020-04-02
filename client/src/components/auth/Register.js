import React, { Fragment, useState } from 'react'

const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    })
    const { name, email, password, cpassword } = formData;
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    const onSubmit = e => {
        e.preventDefault();
        if (password !== cpassword) {
            console.log("Passwords doesn't match");
        } else {
            console.log(formData);
        }
    } 
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i>Create an account</p>
            <form className="form" onSubmit={ e => onSubmit(e) }>
                <div className="form-group"><input type="text" placeholder="Username" name="name" value={name} onChange={e => onChange(e)} required /></div>
                <div className="form-group">
                    <input type="email" placeholder="Email" value={email} name="email"onChange={e => onChange(e)} required />
                    <small className="form-text">This uses profile image from Gravatar</small>
                </div>
                <div className="form-group"><input type="password" placeholder="Password" name="password" value={password} onChange={e => onChange(e)} /></div>
                <div className="form-group"><input type="password" placeholder="Confirm Password" name="cpassword" value={cpassword} onChange={e => onChange(e)} /></div>
                <input type="submit" value="Register" className="btn btn-primary" />
            </form>
            <p className="my-1">Already have an Account?<a href="login.html"> Sign In</a></p>
        </Fragment>
    )
}


export default Register;