import React from 'react'

export const Landing = () => {
    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">Dev Connector</h1>
                    <p className="lead">Connect to developers across on creating profile by posts, comments and stuff</p>
                    <div className="buttons">
                        <a href="register.html" className="btn btn-primary">Sign Up</a>
                        <a href="login.html" className="btn btn-white">Login</a>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Landing;