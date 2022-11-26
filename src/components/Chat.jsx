import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import {signOut} from "firebase/auth"
import { auth } from '../firebase'

const Chat = () => {
  const { data } = useContext(ChatContext);
  console.log("Data : ")
  console.log(data)

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.group?.groupName}</span>
        <div className="chatIcons">
          <button onClick={()=>signOut(auth)}>logout</button>
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  );
};

export default Chat;
