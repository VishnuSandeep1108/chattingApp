import React from "react";
import "./welcome.css";

function Welcome()
{
    return (
        <div className="welcomeClass">
            <h1>Welcome</h1>
            <p>This is a Realtime Videocalling and chatting application</p>
            <label>How to use</label>
            <ul>
                <li>Just Add the unique username of the recepient to the list of your contacts</li>
                <li>and Done!! You are all set to communicate with them all with lowest latency possible and ANONYMOUSLY!!</li>
            </ul>

            <footer>Developed with 🧡 by Vishnu Sandeep</footer>
        </div>
    )
}

export default Welcome;