import { Link } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { useState } from "react";
import auth from "../../firebase.init";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "firebase/auth";


const Registration = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [userMail, setUserMai] = useState('')
    const [userPassword, setUserPassword] = useState('');
    const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState('');
    const [registrationFailMessage, setRegistrationFailMessage] = useState('');

    const handelVerify = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        setUserMai(email)
        setUserPassword(password)
        setRegistrationSuccessMessage('')
        setRegistrationFailMessage('')

        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) || !email.endsWith('.com')){
            setRegistrationFailMessage('Enter a Valid Email')
            return;
        }

        if(password.length < 7 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,}$/.test(password)){
            setRegistrationFailMessage('Enter Valid Password.')
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log(auth.currentUser)
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        setRegistrationSuccessMessage('Check Your Mail.Sent Activition Link.')
                    })
                    .catch(error => {
                        setRegistrationFailMessage(error.message);
                    })
            })
            .catch((error) => {
                setRegistrationFailMessage(error.message);
            });
    }

    const handelRegistration = e => {

        e.preventDefault();
        const name = e.target.name.value;
        setRegistrationSuccessMessage('')
        setRegistrationFailMessage('')
        signInWithEmailAndPassword(auth, userMail, userPassword)
            .then((userCredential) => {
                if (!userCredential.user.emailVerified) {
                    setRegistrationFailMessage('Check Mail & Verify Your Account.');
                    return;
                }

                if (userCredential.user.emailVerified) {
                    updateProfile(auth.currentUser, {
                        displayName: name,
                    }).then(() => {
                        console.log(auth.currentUser)
                        setRegistrationSuccessMessage(auth.currentUser.displayName+', Your Account is created.')
                    }).catch((error) => {
                        setRegistrationFailMessage(error.message);
                    });
                }
            })
            .catch((error) => {
                setRegistrationFailMessage(error.message);
            });
    }
    return (
        <div>
            <div className="flex justify-center items-center mt-12 ">
                <div className=" w-[500px] w-full shadow-2xl bg-base-100 rounded-lg px-6 py-4 flex flex-col justify-cneter items-center">
                    <div className="w-[400px]">
                        {
                            registrationSuccessMessage && <p className="text-center font-semibold text-green-500 mb-2">{registrationSuccessMessage}</p>
                        }
                        {
                            registrationFailMessage && <p className="text-center font-semibold text-red-500 mb-2">{registrationFailMessage}</p>
                        }
                    </div>
                    <div>
                        <form onSubmit={handelVerify} className="border border-2 p-2 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="gorw">
                                    <div className="form-control w-full ">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input type="email" name="email" placeholder="email" className="w-[355px] input input-bordered" required />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Create Password</span>
                                        </label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} name="password" placeholder="password" className="w-full input input-bordered" required />
                                            <span className="absolute right-3 top-4" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <IoEye /> : <IoMdEyeOff />}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-control mt-6">
                                    <button className="btn btn-primary">Verify</button>
                                </div>
                            </div>
                        </form>
                        <form onSubmit={handelRegistration} className="">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text" name="name" placeholder="Name" className="input input-bordered" required />
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Registration</button>
                            </div>
                        </form>
                        <label className="label  mb-2">
                            <Link to="/login">If You Have an Account Please <span className=" link link-hover">Login</span></Link>
                        </label>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Registration;