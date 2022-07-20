import { Avatar } from '@mui/material'
import React, {useContext} from 'react'
import './sidebarchat.css'
import { AuthContext } from '../../contexts/AuthContext'
import baath from '../../assets/baath.png'
export default function SiderbarChat({currUser}) {
 
  const {user,getCombinedId,setCombinedId,setCurrentName,setCurrPhoto} = useContext(AuthContext)


  return (
    <a  onClick={()=> {
      setCombinedId(getCombinedId(user._id,currUser._id));
      setCurrentName(currUser.name)
      setCurrPhoto(currUser.photoUrl)
    }} className='sidebar__chat'>
          {
            // If the friend is autamted account then show the logo of baatcheet else show friends logo
            currUser._id === "ashish1322g" ? <Avatar src={baath}  /> : <Avatar src={currUser.photoUrl}  />
          }
         
         <div className="sidebarchat__info">
             <h2>{currUser.name}</h2>
           
         </div>


    </a>
  )
}
