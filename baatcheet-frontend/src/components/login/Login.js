import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "./login.css";
import ShieldIcon from "@mui/icons-material/Shield";
import ChatIcon from "@mui/icons-material/Chat";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SendIcon from "@mui/icons-material/Send";
import bath from '../../assets/baath.png'
export default function Login() {
  const {login} = useContext(AuthContext);

  return (
    <div className="card">
      <h2>Welcome in BaatCheet</h2>
      <div className="login__info">

      <div className="child"> 
        <img style={{borderRadius: "30px"}}  width="200px" src={bath} alt="" />
      </div>

      <div className="child">
      <li>
          <ShieldIcon /> Login With Google.
        </li>
        <li>
          <PersonSearchIcon />
          Connect with your friends using email.
        </li>
        <li>
        <ChatIcon />  Start BaatCheet with your buddy.
        </li>
        <li>
          <SendIcon /> Stay Connected For updates.
        </li>

        <div onClick={login} className="google-btn">
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
          </div>
          <p className="btn-text">
            <b>Sign in with google</b>
          </p>
        </div>
      </div>
       
      </div>

    </div>
  );
}
