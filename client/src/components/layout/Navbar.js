import React, { Component } from 'react'

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar bg-dark">
                <h1 className="large">
                    <a href="dashboard.html">
                        <i className="fas fa-code"></i>Dev Connector
                    </a>
                </h1>
                <ul>
                    <li><a href="profiles.html">Developers</a></li>
                    <li><a href="register.html">Register</a></li>
                    <li><a href="login.html">Login</a></li>
                </ul>
            </nav>
        )
    }
}


export default Navbar;