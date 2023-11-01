import React,{useRef, useState} from "react";
import "./videoCall.css";

function videoCall(props)
{
    const {myVideoRef, remoteVideoRef, endCall} = props;
    return (
        <div>
            <div className="videoArea">
                <div className="remoteVideo"><video className="remoteVideoInside" autoPlay ref={remoteVideoRef}></video></div>
                <div className="myVideo"><video className="myVideoInside" autoPlay ref={myVideoRef}></video></div>
            </div>

            <button onClick={()=>{endCall()}} className="endCallButton">END CALL</button>
        </div>
    )
}

export default videoCall;