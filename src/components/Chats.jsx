import { onSnapshot, where, query, collection  } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [groups, setGroups] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getGroups = () => {

      const unsub = onSnapshot(
        query(
          collection(db, "users"),
          where('uid', '==', currentUser.uid)
        ), (querySnapshot) => {
          const myGroups = []
          querySnapshot.docs.forEach((document) => {
            const groupData = document.data()

            // console.log(groupData);

            groupData.myGroups.forEach((G) => {
              myGroups.push({
                groupId: G.groupId,
                groupName: G.groupName,
                isAdmin: G.isAdmin

              })
            });

            setGroups(myGroups);

          });


          // console.log("Groups Names : ", groups)

        })


      return unsub;


    }

    currentUser.uid && getGroups();

  }, [currentUser.uid])

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_GROUP", payload: u });
  };

  return (
    <div className="chats">
      {groups.map((group) => (
        <div
          className="userChat"
          key={group.groupId}
          onClick={() => handleSelect(group)}
        >
          <div className="userChatInfo">
            <span>{group.groupName}</span>
            
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
