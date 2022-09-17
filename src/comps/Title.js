import React from 'react';
import GoogleLogin from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSignedIn,
  setSignedIn,
  setUserData,
} from "../features/userSlice";
import "../styling/home.css";

const Title = () => {
  const isSignedIn = useSelector(selectSignedIn);

  const dispatch = useDispatch();
  const login = (response) => {
    dispatch(setSignedIn(true));
    dispatch(setUserData(response.profileObj));
    
  };
  const onFailure=(res)=>{
    alert("Login failed")
  }
  return (
    <div className="home__page">
       <h2>Your Pictures</h2>
      <p>A picture is a poem without words.</p>
      {!isSignedIn ? (<GoogleLogin
            clientId="816863996365-86ju8qfuctklfde91bu1moacoip0qugh.apps.googleusercontent.com"
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="login__button"
              >
                Login with Google
              </button>
            )}
            onSuccess={login}
            onFailure={onFailure}
            isSignedIn={true}
            approvalPrompt="force"
            prompt="consent"
            cookiePolicy={"single_host_origin"}
            accessType='offline'
          />):("")}
    </div>
  )
}

export default Title;
