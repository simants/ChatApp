import React, { useContext, useState } from "react";
import {
    collection,
    query,
    getDocs,
    updateDoc,
    doc,
    arrayUnion,
    addDoc,
    serverTimestamp,
    where
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from "react-router-dom";


const GroupInfo = () => {
    const [checked, setChecked] = useState([]);
    const [checklist, setchecklist] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log("currentUser: ",currentUser)
    useEffect(() => {
        const getchecklist = async (currentUser) => {
            const q = query(
                collection(db, "users"),
                where("uid", "!=", currentUser.uid)
            );

            try {
                const emptylist = [];
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    emptylist.push(doc.data());
                });
                setchecklist(emptylist)
            } catch (err) {
                console.log(err)
            }
        };
        getchecklist(currentUser);
    }, [currentUser]);

    const handleCheck = (event) => {
        var updatedList = [...checked];
        if (event.target.checked) {
            let foundItem = checklist.find((elem) => elem.uid === event.target.value)
            updatedList = [...checked, { uid: foundItem.uid, displayName: foundItem.displayName }];
        } else {
            let filteredList = updatedList.filter((obj) => obj.uid != event.target.value);
            updatedList = [...filteredList];
        }
        setChecked(updatedList);
    };

    const handleCreateGroup = async () => {

        let groupDetails = {
            groupName: document.getElementsByName('groupNameInput')[0].value,
            members: [...checked],
            admin: {
                uid: currentUser.uid,
                admin: currentUser.displayName
            }
        }
        console.log(groupDetails)

        const groupSnapshot = await addDoc(query(collection(db, 'groups')), {...groupDetails,timestamp: serverTimestamp()})
        console.log(groupSnapshot)

        if (groupSnapshot) {
            await updateDoc(doc(db, 'users', currentUser.uid),
                {
                    myGroups: arrayUnion({
                        groupId: groupSnapshot.id,
                        groupName: groupDetails.groupName,
                        isAdmin: true,
                        requests: []
                    })
                })

            for (let idx = 0; idx < groupDetails.members.length; idx++) {
                const member = groupDetails.members[idx];
                await updateDoc(doc(db, 'users', member.uid), {
                    myGroups: arrayUnion({
                        groupId: groupSnapshot.id,
                        groupName: groupDetails.groupName,
                        isAdmin: false,
                        requests: []
                    })
                })
            }
        }
        navigate("/")
    }

    var isChecked = (item) =>
        checked.includes({ uid: item.uid, displayName: item.displayName }) ? "checked-item" : "not-checked-item";

    return (
        <div className='groupContainer'>
            <form>
            <span className='groupinfo'>Group Name: </span>
                <input required type="text" name='groupNameInput' placeholder='Enter Group name'></input>
                <span className='groupinfo'>Choose members for group</span>
                <div className='list-container'>
                    {checklist.map((item, index) => (
                        <div key={index}>
                            <input value={item.uid} type='checkbox' onChange={handleCheck} />

                            <span className={isChecked(item)}>{item.displayName}</span>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={()=> {handleCreateGroup()}}>Create Group</button>
            </form>
        </div>
    )
};

export default GroupInfo