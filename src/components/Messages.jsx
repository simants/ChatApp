import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  console.log("in msg: ", data);


  useEffect(() => {

    const getChatData = (groupId) => {

      console.log("gid: ", groupId);

      onSnapshot(
        query(
          collection(db, "groups", groupId, "chats"),
          orderBy('date', 'asc')),
        (querySnapshot) => {

          console.log("snap: ", querySnapshot);

          const lst = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })
          )

          console.log("is: ", lst)

          setMessages(lst)

        })
    }


    if (data.group.groupId) getChatData(data.group.groupId);


  }, [data.group]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
