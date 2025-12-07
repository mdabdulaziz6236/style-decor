import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  
} from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase/Firebase.init";
const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  /* Register User */
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  /* Sign in User  */
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  /* LogOut user */
  const logOut = () => {
    return signOut(auth);
  };
  /* update user profile */
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };
  /* Google login */
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  /* Reset Password */
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  /* Observe use State with useEffect */
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);
  const authInfo = {
    resetPassword,
    updateUserProfile,
    logOut,
    loading,
    user,
    setUser,
    registerUser,
    signInUser,
    googleLogin,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
