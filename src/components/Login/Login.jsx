import { useRef } from "react";
import { Link } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../firebase.init";



const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
    const [loginFailMessage, setLoginFailMessage] = useState('')

    const emailRef = useRef(null);
    const handelLogin = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        setLoginSuccessMessage('')
        setLoginFailMessage('')

        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) || !email.endsWith('.com')){
            setLoginFailMessage('Enter a Valid Email')
            return;
        }

        if (password.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
            setLoginFailMessage('Enter Valid Password.')
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (!userCredential.user.emailVerified) {
                    setLoginFailMessage('You Mail is not Verified. Check Mail & Verify Your Account.');
                    return;
                }
                if(userCredential.user.emailVerified){
                    console.log(auth.currentUser)
                    const name = userCredential.user.displayName?userCredential.user.displayName:userCredential.user.email;
                    setLoginSuccessMessage('Welcome '+name)
                }
            })
            .catch((error) => {
                loginFailMessage(error.message);
            });
    }

    const handelForgotPassword = () => {
        const email = emailRef.current.value;

        setLoginSuccessMessage('')
        setLoginFailMessage('')

        if(!email){
            setLoginFailMessage('Please Enter Your Mail.')
            return;
        }

        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) || !email.endsWith('.com')){
            setLoginFailMessage('Enter a Valid Email')
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setLoginSuccessMessage('Check Your Mail. Password Reset Mail Sent.')
            })
            .catch((error) => {
                loginFailMessage(error.message);
            });
    }

    return (
        <div>
            <div className="flex justify-center items-center mt-12 ">
                <div className=" w-[500px] flex flex-col justify-center items-center shadow-2xl bg-base-100">
                    <div className="w-[400px] mt-4">
                        {
                            loginSuccessMessage && <p className="text-center font-semibold text-green-500 mb-2">{loginSuccessMessage}</p>
                        }
                        {
                            loginFailMessage && <p className="text-center font-semibold text-red-500 mb-2">{loginFailMessage}</p>
                        }
                    </div>
                    <div>
                        <form onSubmit={handelLogin} className="mx-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" ref={emailRef} name="email" placeholder="email" className="w-[450px] input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" placeholder="password" className="w-full input input-bordered" required />
                                    <span className="absolute right-3 top-4" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <IoEye /> : <IoMdEyeOff IoEye />}</span>
                                </div>
                                <label className="label">
                                    <p onClick={handelForgotPassword} className="label-text-alt link link-hover">Forgot password?</p>
                                </label>
                            </div>
                            <div className="form-control mt-6  mb-3">
                                <button className="btn btn-primary">Login</button>
                            </div>
                        </form>
                        <label className="label mx-6  mb-5">
                            <Link to="/registration">If You Have No Account Please <span className=" link link-hover">Register</span></Link>
                        </label>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;