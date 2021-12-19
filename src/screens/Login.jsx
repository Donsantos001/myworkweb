import React, { Component } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()

    const [name, setName] = useState("")


    const loginUser = () => {
        navigate('/home', { state : { name: name}})
    }

    return ( 
        <div style={{  height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div>
                Student Name : <input style={{  fontSize: "20px" }} onChange={(evt) => setName(evt.target.value)} type="text"></input>
                <button style={{  height: "30px" }}onClick={() => loginUser()}>Login</button>
            </div>
        </div>
     );
}
 
export default Login;