import React, { Component } from 'react'

class Navbar extends Component {
    render() {
        return (
            <nav className = "navbar navbar-expand-sm navbar-dark bg-dark mb-4">
                <div className="container">
                    <a className="navbar-brand" href="landing.html">DevConnecter</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
                        <span className="navbar-toggle-icon"></span>
                    </button>
                </div>
            </nav>

        )
    }
}


export default Navbar;