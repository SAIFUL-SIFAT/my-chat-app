import { useState } from "react";
import { toast } from "react-toastify";
import "./login.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth,db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  
  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData(e.target);
    const { email, password } = Object.fromEntries(formdata);
  
    try{

        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login successful");
    }
    catch(err){
        console.log(err);
        toast.error(err.message);
    }
    finally {
        setLoading(false);
    }
  };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const formdata = new FormData(e.target);

//     const { username, email, password } = Object.fromEntries(formdata);
    
//     try{

//     const res = await createUserWithEmailAndPassword(auth, email, password);
    
//     await setDoc(doc(db, "users", res.user.uid), {
//         username,
//         email,
//         id: res.user.uid,
//         blocked: [],
//         });

//     await setDoc(doc(db, "userchats", res.user.uid), {
//             chats: [],
//             });
//         toast.success("User registered successfully");


//     }catch(err){
//         console.log(err);
//         toast.error(err.message);
//     }

const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formdata);
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", res.user.uid);
  
      let base64Avatar = "";
      if (avatar.file) {
        base64Avatar = await convertToBase64(avatar.file);
      }
  
      // ✅ Save user data to Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        avatar: base64Avatar,
        blocked: [],
      });
  
      // ✅ Initialize empty user chat collection
      await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });
  
      toast.success("User registered successfully!");
    } catch (err) {
      console.error("Error during registration:", err);
      toast.error(err.message);
    }
    finally {
        setLoading(false);
        }
  };
  
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  


  return (
    <div className="login">
      <div className="item">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button type="submit" disabled={loading}>{loading ? "loading" : "Login" }</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an Image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button type="submit" disabled={loading}>{loading ? "loading" : "SignUp" }</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
