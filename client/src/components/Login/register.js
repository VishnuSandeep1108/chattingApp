import React from "react";
import "./login.css";

function Register(props)
{
    const {updateusername, updatepassword, newRegistration} = props;
    return (
        <div>
            <div className="registerPage">
                <input onChange={(e)=>{updateusername(e.target.value)}} placeholder="username" required></input>
                <input onChange={(e)=>{updatepassword(e.target.value)}} placeholder="password" required></input>

                <button className="loginButton" onClick={newRegistration}>Register</button>
            </div>
        </div>
    )
}

export default Register;