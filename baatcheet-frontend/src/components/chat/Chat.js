import { AttachFile, InsertEmoticon, Mic } from '@mui/icons-material'
import MoreVert from '@mui/icons-material/MoreVert'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import { Avatar, IconButton } from '@mui/material'
import React, {useState} from 'react'
import './chat.css'
import axios from '../../axios.js'
import { toast } from 'react-toastify'
import Picker from 'emoji-picker-react';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import bath from '../../assets/baath.png'
export default function Chat({messages,name, photo,user,combinedId,showName}) {

  const [msg,setMsg] = useState("")
  
  const [showEmojiPicker,setShowEmojiPicker] = useState(false)

  const showPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const onEmojiClick = (event, emojiObject) => {
   setMsg(msg + emojiObject.emoji)
  };

  const getDate = () => {
    let d = new Date()
    let hour = d.getHours()
    let suffix = hour >= 12 ? "PM" : "AM"
    let minute = d.getMinutes()
    let time = hour + ":" + minute + " " + suffix
    let date = d.toDateString()
    return date + "," + time


  }
  const sendMessage = (e) =>
  {
    let temp = msg
    temp = temp.trim()

    if(temp===" " || temp==="")
    return
    e.preventDefault()
    axios.post("/messages/new",{
    "message":temp,
    "name":user.name,
    "timestamp": getDate(),
    "combinedId": combinedId,
    "senderId": user._id
    })
    setMsg("")

  }

  const soon = () => {
    toast.info('Feature will be available soon!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }
  return (
   <div className="chat">
       
       <div className="chat__header">

        {
          // If the current chat is automated account then show the logo else show the avtaar
          name === "BaatCheet Team" ? <Avatar src={bath}  /> :     <Avatar src={photo} />
        }
       

          <div className="chat__headerInfo">
            <h2>{name}</h2>
            
          </div>

          <div className="chat__headerIcons">
            <IconButton onClick={soon}>
              <SearchOutlined />
            </IconButton >
            <IconButton onClick={soon}>
              <AttachFile />
            </IconButton>
            <IconButton onClick={soon}>
              <MoreVert />
            </IconButton>
          </div>
       </div>

       <div className="chat__body">

         {
           messages.map ( (item,index) => {
          return <p  key={index} className={`chat__message ${user._id !== item.senderId && "chat__receiver"}`}>
         
             {item.message}
            <span className='chat__date'>{item.timestamp}</span>
          </p>
          
           })
         }
        


      

         
       </div>

       <div className="chat__footer">

         {
       
           showEmojiPicker ?  <>
           <IconButton onClick={showPicker}>
             <CloseIcon  />
           </IconButton>
           <div className="emojiCont">
           <Picker  onEmojiClick={onEmojiClick} />
           </div>
           </> :

           
          <IconButton onClick={showPicker}>
          <InsertEmoticon  />
           </IconButton>
         }
        

  
       

      
     
         <form onSubmit={sendMessage} >
           <input value={msg} onChange={(t)=>setMsg(t.target.value)} type="text" placeholder='Type a Message' />
           <button type='submit'>Send a Message</button>
         </form>
        <IconButton onClick={sendMessage}>
        <SendIcon />  
        </IconButton >
     

       </div>
   </div>
  )
}
