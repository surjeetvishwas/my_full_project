import React, { useEffect, useState } from "react";
import background from "../assets/img/background.jpg";
import logo from "../assets/img/logo.png";
import LoginInput from "../components/LoginInput";
import { FaEnvelope, FaLock, FcGoogle } from "../assets/icons";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../config/firebase.config";
import { validateUserJWTToken } from "../api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../context/actions/userActions";
import { alertInfo, alertWarning } from "../context/actions/alertAction";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      firebaseAuth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUserJWTToken(token).then((data) => {
              dispatch(setUserDetails(data));
            });
            navigate("/", { replace: true });
          });
        }
      });
    });
  };

  const signUpWithEmailPassword = async () => {
    if (userEmail === "" || password === "" || confirm_password === "") {
      dispatch(alertInfo("Required fields should not be empty"));
    } else {
      if (password === confirm_password) {
        setUserEmail("");
        setPassword("");
        setConfirm_password("");
        await createUserWithEmailAndPassword(
          firebaseAuth,
          userEmail,
          password
        ).then((userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then((data) => {
                  dispatch(setUserDetails(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        });
      } else {
        dispatch(alertWarning("Password does'nt match"));
      }
    }
  };

  const signINWithEmailPassword = async () => {
    if (userEmail !== "" && password !== "") {
      await signInWithEmailAndPassword(firebaseAuth, userEmail, password).then(
        (userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then((data) => {
                  dispatch(setUserDetails(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        }
      );
    } else {
      dispatch(alertWarning("Password does'nt match"));
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      <img
        src={background}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt=""
      />
      <div className="flex flex-col items-center bg-lightOverlay w-[40%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12">
        <div className="flex items-center justify-start gab-4 w-full" />
        <img src={logo} className="w-20" alt="" />
        <p className="text-white font-semibold text-2xl">Food App</p>
        <p className="text-3xl font-semibold pt-4 text-white">Welcome Back</p>
        <p className="text-xl text-white">
          {" "}
          {isSignUp ? "Sign Up" : "Sign In"}
        </p>
        <div className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4 ">
          <LoginInput
            placeHolder="Email"
            icon={<FaEnvelope className="text-textColor" />}
            inputState={userEmail}
            inputStateFunc={setUserEmail}
            type="email"
            isSignUp={isSignUp}
          />
          <LoginInput
            placeHolder="Password"
            icon={<FaLock className="text-textColor" />}
            inputState={password}
            inputStateFunc={setPassword}
            type="password"
            isSignUp={isSignUp}
          />
          {isSignUp && (
            <LoginInput
              placeHolder="Confirm Password "
              icon={<FaLock className="text-textColor" />}
              inputState={confirm_password}
              inputStateFunc={setConfirm_password}
              type="password"
              isSignUp={isSignUp}
            />
          )}
          {!isSignUp ? (
            <p>
              Doesn't have an account:{" "}
              <motion.button
                {...buttonClick}
                className="text-red-400 underline cursor-pointer bg-transparent"
                onClick={() => {
                  console.log("Sign In button clicked");
                  setIsSignUp(true);
                }}
              >
                Create Account
              </motion.button>
            </p>
          ) : (
            <p>
              Already have an account:{" "}
              <motion.button
                {...buttonClick}
                className="text-red-400 underline cursor-pointer bg-transparent"
                onClick={() => {
                  console.log("Sign In button clicked");
                  setIsSignUp(false);
                }}
              >
                Sign In
              </motion.button>
            </p>
          )}
          {isSignUp ? (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 rounded-md bg-red-400 text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signUpWithEmailPassword}
            >
              Sign Up
            </motion.button>
          ) : (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 rounded-md bg-red-400 text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signINWithEmailPassword}
            >
              Sign In
            </motion.button>
          )}
        </div>
        <div className="flex items-center justify-between gap-16">
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
          <p className="text-white">or</p>
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
        </div>
        <motion.div
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-white backdrop-blur-md cursor-pointer rounded-3xl mt-4"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-2xl" />
          <p className="capitalize text-base text-headingColor ml-4">
            Signin With Google
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
