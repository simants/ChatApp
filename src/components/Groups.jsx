import { onSnapshot, where, query, collection } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Groups = () => {
    const [groups, setGroups] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getGroups = () => {

            const unsub = onSnapshot(
                query(
                    collection(db, "users"),
                    where('uid', '==', "0Rh6Hz2NfGNlGpGiIeJEsUv0J193")
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

        "0Rh6Hz2NfGNlGpGiIeJEsUv0J193" && getGroups();

    }, [currentUser.uid])

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    return (
        <div className="groups">
            <span className="titleGroup">My Groups:</span>
            {groups.map((group) => (
                <div
                    className="userGroups"
                    key={group[0]}  
                    onClick={() => handleSelect(group)}
                >
                    <div className="userGroupInfo">
                        <span>{group.groupName}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Groups;
