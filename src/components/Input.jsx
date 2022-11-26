import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  addDoc,
  Timestamp,
  query,
  collection
} from "firebase/firestore";
import { db, storage } from "../firebase";


const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  console.log("Chat Context Data : ", data)

  const handleSend = async () => {

    let messageBlock = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      text,
      date: Timestamp.now(),
      type: "TEXT",
      fileURL: ""
    }

    await addDoc(query(collection(db, 'groups', data.group.groupId, 'chats')),
      messageBlock)



    setText("");
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
