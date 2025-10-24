import { useEffect } from "react"
import Chat from "./components/chat/chat"
import Detail from "./components/detail/detail"
import List from "./components/list/list"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"

const App = () => {

  const {currentUser,isLoading,fetchUserInfo} = useUserStore();
  useEffect(() => {
    const unSub = onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid);
    })

  return () => unSub();
  }, [fetchUserInfo]);


  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <div className='container'>
      {
        currentUser ? (
          <>
          <List />
          <Chat />
          <Detail/>
          </>
        ):(
          <Login />
        )}
      <Notification />
    </div>
  );
};

export default App