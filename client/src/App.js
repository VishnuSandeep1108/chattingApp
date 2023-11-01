import React,{useRef, useState} from "react";
import io from "socket.io-client";

import Peer from "peerjs";

import Login from "./components/Login/login";
import Register from "./components/Login/register.js";
import Home from "./components/Home/home.js";

import Videocall from "./components/Videocall/videoCall";

const socket = io.connect("http://localhost:8000",{ transports : ['websocket'] });


function App() {

  var peer = new Peer();

  const [isRegistered, updateisRegistered]=useState(true);
  const [isLoggedin, updateisLoggedin]=useState(false);

  const [username, updateusername]=useState("");
  const [password, updatepassword]=useState("");
  const [chatHistory, updatechatHistory]=useState("");

  const [guestUsername, setguestUsername] = useState("test");
  const [guestPassword, setguestPassword] = useState("123");

  const [receiver, updatereceiver]=useState("");
  const [message, updatemessage]=useState("");
  const [sender, updatesender]=useState("");

  const [otherUser, setOtherUser] = useState("");

  const [newMessageAlert, updatenewMessageAlert]=useState(false);

  const [acceptCall, setacceptCall] = useState(false);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);


  function checkLoginCredentials()
  {
    if(username!="")
    socket.emit("checkLoginCredentials", {username, password});

    socket.on("noUserFound", ()=>{
      updateisRegistered(false);
    })

    socket.on("loginSuccess", (chatHistory)=>{
      updatechatHistory(chatHistory);
      updateisLoggedin(true);
    })
  }

  function guestLoginCredentials()
  {
    updateusername(guestUsername);
    updatepassword(guestPassword);
    socket.emit("guestLoginCredentials", {guestUsername, guestPassword});

    socket.on("noUserFound", ()=>{
      updateisRegistered(false);
    })

    socket.on("loginSuccess", (chatHistory)=>{
      updatechatHistory(chatHistory);
      updateisLoggedin(true);
    })
  }

  function initiateRegistration()
  {
    updateisRegistered(false);
  }

  function newRegistration()
  {
    if(username!="")
    socket.emit("newRegistration", {username, password});

    socket.on("registrationSuccess",()=>{
      updateisRegistered(true);
    })
  }

  function sendMessage()
  {
    if(message!="" && message!=" ")
    socket.emit("sendMessage", {username, receiver, message});

    socket.on("sendSuccess", (chatHistory)=>{
      updatechatHistory(chatHistory);
      updatenewMessageAlert(true);
    })
  }

  function addSender()
  {
    socket.emit("addSender", {sender, username});

    socket.on("senderAddSuccess", (chatHistory)=>{
      updatechatHistory(chatHistory);
    })
  }

React.useEffect(()=>{
  socket.on("newMessageReceived", (chatHistory)=>{
    updatechatHistory(chatHistory);
    updatenewMessageAlert(true);
  })
}, [])



function handleVideoCall()
{
  console.log(username, receiver);
  console.log(peer.id);

  let senderPeerId = peer.id;
  let senderRoomId = username;

  setOtherUser(receiver);
  socket.emit("initiateVideoCall", {receiver, senderPeerId, senderRoomId});
}

function endCall()
{
  socket.emit("endCall", {otherUser, username});
}

React.useEffect(()=>{
  socket.on("requestVideoCall", (requestVideoCallDetails)=>{
    const {senderPeerId, senderRoomId} = requestVideoCallDetails;

    console.log(requestVideoCallDetails);

    //ask if the user is interested

    let userChoice = window.confirm(`Incoming call from \"${senderRoomId}\". Do you want to accept the call?`);

    console.log("UserChoice: "+userChoice);

    if(userChoice)
    {
      setOtherUser(senderRoomId);
      let receiverPeerId=peer.id;
      socket.emit("acceptVideoCall", {receiverPeerId, senderRoomId});
    }

    peer.on("call", (call)=>{
      setacceptCall(true);
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      }).then((receiverStream)=>{
        myVideoRef.current.srcObject = receiverStream;
        call.answer(receiverStream);
      })

      call.on("stream", (remoteStream)=>{
        console.log('Received remote stream up');

        remoteVideoRef.current.srcObject = remoteStream;
      })

    })
  })

  socket.on("userJoined", async (acceptVideoCallDetails)=>{
    console.log("Accepted");
    setacceptCall(true);
    const {receiverPeerId} = acceptVideoCallDetails;

    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    }).then((senderStream)=>{
      myVideoRef.current.srcObject = senderStream;
      const call = peer.call(receiverPeerId, senderStream);

      call.on("stream", (remoteStream)=>{
        console.log('Received remote stream down');

        remoteVideoRef.current.srcObject = remoteStream;
      })
    })
  })

  socket.on("endCall", ()=>{
    console.log("ENdCmd Received");

    const trackPromises = myVideoRef.current.srcObject.getTracks().map(track => track.stop());

    Promise.all(trackPromises).then(()=>{
      myVideoRef.current.srcObject = null;
      setacceptCall(false);
    })
    .catch(error=>{
      console.log("Error: "+ error);
    })
  })
}, [])




  return (
    <div>
      {isRegistered?(isLoggedin?(acceptCall?(<Videocall myVideoRef={myVideoRef} remoteVideoRef={remoteVideoRef} endCall={endCall}/>):<Home username={username} chatHistory={chatHistory} updatereceiver={updatereceiver} updatemessage={updatemessage} sendMessage={sendMessage} updatesender={updatesender} addSender={addSender} newMessageAlert={newMessageAlert} updatenewMessageAlert={updatenewMessageAlert} handleVideoCall={handleVideoCall}/>):<Login updateusername={updateusername} updatepassword={updatepassword} checkLoginCredentials={checkLoginCredentials} guestLoginCredentials={guestLoginCredentials} initiateRegistration={initiateRegistration}/>):<Register updateusername={updateusername} updatepassword={updatepassword} newRegistration={newRegistration}/>}
    </div>
  );
}

export default App;
