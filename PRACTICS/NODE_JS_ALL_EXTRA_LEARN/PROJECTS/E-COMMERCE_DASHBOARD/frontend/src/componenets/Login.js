import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const LoginHandler = async () => {
    console.log(email, password);

    const data = await fetch("http://localhost:8080/v1/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await data.json();
    console.log(result);
    if (result) {
      localStorage.setItem("user", JSON.stringify(result));
      navigate("/");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="card">
      <h1>Login</h1>
      <input
        className="cardfield"
        type="email"
        name="email"
        onChange={(e) => setemail(e.target.value)}
        value={email}
        placeholder="Enter Your Email"
      />
      <input
        className="cardfield"
        type="password"
        name="password"
        onChange={(e) => setpassword(e.target.value)}
        value={password}
        placeholder="Enter Your Password"
      />
      <button onClick={LoginHandler} className="subButton">
        Submit
      </button>
    </div>
  );
};

export default Login;
