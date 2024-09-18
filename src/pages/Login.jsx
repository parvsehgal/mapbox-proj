import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const Login = () => {
  const handleSuccess = (response) => {
    console.log(response); // You will get the access token here
  };

  const handleFailure = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="<YOUR CLIENT ID>">
      <div className="App">
        <h1>Google OAuth in React</h1>
        <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
