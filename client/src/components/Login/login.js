import React from "react";
import "./login.css";

function Login(props)
{
    const {updateusername, updatepassword, checkLoginCredentials, guestLoginCredentials, initiateRegistration} = props;
    return (
        <div className="loginPage">
            <input required onChange={(e)=>{updateusername(e.target.value)}} type="text" placeholder="Username"></input>
            <input required onChange={(e)=>{updatepassword(e.target.value)}} type="password" placeholder="Password"></input>

            <button className="loginButton" onClick={checkLoginCredentials}>Login</button>

            <button className="loginButton" onClick={initiateRegistration}>Register</button>

            <button className="loginButton testButton" onClick={guestLoginCredentials}>Login to Test</button>
        </div>
    )
}

export default Login;
