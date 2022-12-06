import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message'
 
const Register = () => {

    const emailRegEx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const passRegEx = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/);

    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {register, handleSubmit, formState : {errors}} = useForm();
    const onSubmit = async (e) => {

        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const myGroups = [];
        const pendingRequests = [];

        // if(displayName.length > 16) setValidationErr({...validationErr, displayName: true})
        // else setValidationErr({...validationErr, displayName: false})

        // if(!emailRegEx.test(email)) setValidationErr({...validationErr, email: true})
        // else setValidationErr({...validationErr, email: false})

        // if(!passRegEx.test(password)) setValidationErr({...validationErr, password: true})
        // else setValidationErr({...validationErr, password: false})

        // if(validationErr.email || validationErr.displayName || validationErr.password) return;

        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            //Update profile
            await updateProfile(res.user, {
                displayName,
            });

            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                myGroups,
                pendingRequests
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
        }

        catch (err) {
            setErr(err.message)
            console.log(err.message)
        }
        finally {
            setLoading(false)
        };
    };

    // const getDisplayNameForValidator = () => {

    //     return {
    //         register("displayName", {required : true, maxLength : 16}),
    //         setError('displayName', { type: 'custom', message: 'Display name should be between 3 to 16 chars' })
    //     }
    // }

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Secure Chat</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <input required type="text" name="displayName" placeholder="display name" 
                    {
                        ...register("displayName", {required : true, maxLength : 16})
                    } />

                    <ErrorMessage errors={errors} name="displayName"  message="Display name should be less than 16 chars"/>

                    {/* {
                        ...register("displayName", {required : true, maxLength : 16})
                    } */}

                    {/* {validationErr.firstName && <p className="text-error">Provide valid name</p>} */}

                    <input required type="email" name="eMail" placeholder="email" />
                    {/* {...register("email",
                     {
                         required: true,
                         pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                     })} */}

                     {/* {validationErr.email && <p className="text-error">Please provide valid email.</p>} */}

                    <input required type="password" name="passWord" placeholder="password"  />

                    {/* {...register("password", {
                        required: true,
                        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/
                    })} */}

                    {/* {validationErr.password && <p className="text-error">Use different password</p>} */}

                    <button disabled={loading}>Sign up</button>
                    {loading && "Uploading and compressing the image please wait..."}
                    {err && <span>{err}</span>}
                </form>
                <p>
                    You do have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};


export default Register;
