import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();
  console.log("message: ", message)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <span>Just Now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
