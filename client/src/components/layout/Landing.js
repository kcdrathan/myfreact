import React from 'react'
import {Link} from "react-router-dom"

export const Landing = () => {
    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">Dev Connector</h1>
                    <p className="lead">Connect to developers across on creating profile by posts, comments and stuff</p>
                    <div className="buttons">
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        <Link to="/login" className="btn btn-white">Login</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Landing;