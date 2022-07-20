
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Chat from './components/chat/Chat';
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js'
import axios from './axios.js'
import Login from './components/login/Login';
import { AuthContext } from './contexts/AuthContext';
import {getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {initializeApp} from 'firebase/app'
import firebaseConfig from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // User
  const [user,setUser] = useState(null)
  const [combinedId,setCombinedId] = useState(null)
  const [currentName,setCurrentName] = useState(null)
  const [currPhoto,setCurrPhoto]
   = useState(null)

  // Firebase Initialization and  Google Auth 
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider();

  // Function To Login
  const login = () => {
    signInWithPopup(auth,provider).then((result)=> {
      const user = result.user;
      // Set the user details 
      const friend = {name: "BaatCheet Team",email:"baatcheetSupport@gmail.com",photoURL:"","friends":[],"_id":"ashish1322g"} // set the very first friend

      const u = {name: user.displayName, email: user.email, photoUrl: user.photoURL,friends: [friend]}
      // try to add this user to database and if this already exists then api will return it else api will add new then return it
      axios.post('/adduser',u).then( response => {
        setUser(response.data)
        
        // Set the detais in Local Storage
        localStorage.setItem('user',JSON.stringify(response.data))
      })
      
       
    }).catch((error)=> 
    toast.error(' Please Try Again!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      }))
  }

  // Function to logout
  const logout = () => {
    localStorage.removeItem('user')
    auth.signOut()
    setUser(null)
  }

  // To get unique id of message, combination of both the persons id
  const getCombinedId = (id1,id2) => {
    if(id1>id2)
    {
      return id1+id2;

    }

    return id2+id1
  }

  const [messages, setMessages] = useState([])
  
  // Initial Loading of messages and current user and it's first friend
  useEffect ( ()=> {
    // if user is logged in only then fetch messages
    if ( localStorage.getItem("user"))
    {
      const parsedUser = JSON.parse(localStorage.getItem("user"))
      setUser(parsedUser)
      // Setting the combined id of user and very first friend for caht
      const id = getCombinedId(parsedUser._id,((parsedUser.friends)[0])._id)
      setCombinedId(id)
      
      // Setting the current Chat user name
      setCurrentName(((parsedUser.friends)[0]).name)
      // Setting the photo of curretn Chat user
      setCurrPhoto(((parsedUser.friends)[0]).photoUrl)

}

  }, [])


  // This will Load the messags of only the combined id of teh user and the current chat person
  useEffect( ()=> {
  
    if (user)
    {
     
        axios.get(`/messages/sync/${combinedId}`).then( response => {
          setMessages(response.data)
        })
      
     
    }
    
  },[combinedId])


 
 
  // Listening to change by subscribing the channel
  useEffect(()=> {
    // Message channle
    const pusher = new Pusher('pusher id here', {
      cluster: 'ap2'
    });
    // User Channel
    const userPusher = new Pusher('pusher id here', {
      cluster: 'ap2'
    });
    
    // Subscribinng and listning to message
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(data) {
   
   
      if(data.combinedId===combinedId)
      {
      setMessages([...messages,data])
      }

    });
    // Subscribinng and listning to User change and it will give use updated user from backend
     const userChannel = userPusher.subscribe('users');
     userChannel.bind('updated',function(data){
      
     // If updated user is the current login user then update he current login user in local storage
      if(data._id === user._id)
      {
        setUser(data) // update the current state 
        localStorage.setItem('user',JSON.stringify(data))

      }
    })

  return () => {
    channel.unbind_all()
    channel.unsubscribe()
    userChannel.unbind_all()
    userChannel.unsubscribe()
  }

  },[messages,user])
  
 
  return (
    <AuthContext.Provider value={{login,logout,user,setCombinedId,getCombinedId,setCurrentName,setCurrPhoto}}>

    <ToastContainer />
    <div className='app' >

      {
        user ?  
        <div className="app__body">
          <Sidebar />
          <Chat photo={currPhoto} name={currentName} messages = {messages} user={user} combinedId={combinedId} />
        </div> :

        <Login />
      }
     
     
    </div>


    </AuthContext.Provider>
  );
}

export default App;
