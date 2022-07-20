import React, { useState } from 'react'
import './sidebar.css'
import LogoutIcon from '@mui/icons-material/Logout';
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import { IconButton , Avatar} from '@mui/material';
import SiderbarChat from './SiderbarChat';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../../axios.js'
export default function Sidebar() {
  const {logout,user} = useContext(AuthContext)
  const [mail,setMail] = useState(null)

  const search = (e) => {
    e.preventDefault()
    // If mail is of current Account
   if ( mail === user.email)
   {
    toast.error('Email should not be of current account', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      })
      return
   }
   // If mail alreday exists in the friends
   for ( var i = 0 ; i < user.friends.length ; i ++)
   {
     let p = user.friends[i]
  
     if(p.email === mail)
     {
      toast.error('User is already in Chats', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
      return
     }
    
   }
   // api call to find the user by mail
   axios.get(`getuser/${mail}`).then( response => {

    // if user not exists
    const data = response.data
    if( data.length === 0)
    {
      toast.error("User with this email doesn't exits", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
      return
    }
    // If user Exists then call the api to add the users in the friend list of each other
    axios.post('/addfriend',[ user, data[0]]).then((res)=>toast.success("User added in the Friends", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      }))
  
  
   })


  }
  return (
    <div className="sidebar">
        
        <div className="sidebar__header">

        <Avatar src={user.photoUrl} />
        <h2>{user.name}</h2>

        <div className="sidebar_headerRight">
             Logout
            <IconButton onClick={logout}>
                <LogoutIcon  />
            </IconButton>  

        </div>

        </div>

        <div className="sidebar__search">
          <div className="siderbar__searchContainer">
            <SearchOutlined />
            <form style={{width: "70%"}} onSubmit={search}>
               <input onChange={ (e)=> setMail(e.currentTarget.value)} type="text" placeholder='Search a friend by email' className="siderbar__input" />
            </form>
           
          </div>
        </div>

        <div className="siderbar__chats">
          {
            user.friends.map ( (item,index) =>  <SiderbarChat  key={index} currUser={item} />)
          }
         
        
        </div>
        
    </div>
  )
}
