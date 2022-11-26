import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [groupName, setGroupName] = useState("");
  const [group, setGroup] = useState(null);
  const [err, setErr] = useState(false);
  const { dispatch } = useContext(ChatContext);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "groups"),
      where("groupName", "==", groupName)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const ele = doc.data()
        setGroup({
          groupName: ele.groupName,
          groupId: doc.id
        });
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {

    console.log("clicked!!");

    try {

      const docRef = await getDoc(doc(db, 'groups', group.groupId));
      const gp = docRef.data();

      console.log("gp: ", gp);
      let flag = true;
      const isMember = gp.members.find((m) => m.uid === currentUser.uid)

      console.log("isMem: ", isMember);

      if (gp.admin.uid === currentUser.uid || isMember) {
        flag = false;
      }

      console.log("g: ", group);
      console.log("flg: ", flag);

      if (flag) {

        let result = window.confirm('Do You want to join this group?');

        if (result) {

          await updateDoc(doc(db, 'groups', group.groupId), {
            members: arrayUnion({
              uid: currentUser.uid,
              displayName: currentUser.displayName
            })
          })

          await updateDoc(doc(db, 'users', currentUser.uid), {
            myGroups: arrayUnion({
              ...group,
              isAdmin: false,
              requests: []
            })
          })

          dispatch({ type: "CHANGE_GROUP", payload: group })

        }

      }
      else {

        console.log("else here...")

        dispatch({ type: "CHANGE_GROUP", payload: group })

      }
    } catch (err) { }


    setGroup(null);
    setGroupName("")
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a group"
          onKeyDown={handleKey}
          onChange={(e) => setGroupName(e.target.value)}
          value={groupName}
        />
      </div>
      {err && <span>Group not found!</span>}
      {group && (
        <div className="userChat" onClick={handleSelect}>
          <div className="userChatInfo">
            <span>{group.groupName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
