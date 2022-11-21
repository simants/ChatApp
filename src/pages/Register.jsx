import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        console.log(email)
        console.log(password)

        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);
            console.log(res)

            //Update profile
            await updateProfile(res.user, {
                displayName,
                });

            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
        }

        catch (err) {
            setErr(err.message)
            console.log(err)
        }
        finally {
            setLoading(false)
        };
    };

        return (
            <div className="formContainer">
                <div className="formWrapper">
                    <span className="logo">Secure Chat</span>
                    <span className="title">Register</span>
                    <form onSubmit={handleSubmit}>
                        <input required type="text" name="displayName" placeholder="display name" />
                        <input required type="email" name="eMail" placeholder="email" />
                        <input required type="password" name="passWord" placeholder="password" />
                        <button disabled={loading}>Sign up</button>
                        {loading && "Uploading and compressing the image please wait..."}
                        {err && <span>Something went wrong</span>}
                    </form>
                    <p>
                        You do have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        );
    };


    export default Register;
