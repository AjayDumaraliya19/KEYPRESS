import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [fname, setfname] = useState("");
  // const [lname, setlname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  // const [phone, setphone] = useState("");
  // const [address, setaddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const getData = async () => {
    // console.log(fname, lname, email, password, phone, address);
    console.log(fname, email, password);
    const data = await fetch("http://localhost:8080/v1/user/register", {
      method: "post",
      // body: JSON.stringify({ fname, lname, email, password, phone, address }),
      body: JSON.stringify({ fname, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await data.json();
    console.log(result);
    localStorage.setItem("user", JSON.stringify(result));

    if (result) {
      navigate("/");
    }
  };
  return (
    <div className="card">
      <h1>Register</h1>
      <input
        className="cardfield"
        type="text"
        name="fname"
        onChange={(e) => setfname(e.target.value)}
        placeholder="Enter Your First name"
      />
      {/* <input
        className="cardfield"
        type="text"
        name="lname"
        onChange={(e) => setlname(e.target.value)}
        placeholder="Enter Your Last name"
      /> */}
      <input
        className="cardfield"
        type="email"
        name="email"
        onChange={(e) => setemail(e.target.value)}
        placeholder="Enter Your Email"
      />
      <input
        className="cardfield"
        type="password"
        name="password"
        onChange={(e) => setpassword(e.target.value)}
        placeholder="Enter Your Password"
      />
      {/* <input
        className="cardfield"
        type="phone"
        name="phone"
        onChange={(e) => setphone(e.target.value)}
        placeholder="Enter Your Mobile number"
      />
      <input
        className="cardfield"
        type="address"
        name="address"
        onChange={(e) => setaddress(e.target.value)}
        placeholder="Enter Your Address"
      /> */}
      <button onClick={getData} className="subButton">
        Submit
      </button>
    </div>
  );
};

export default Signup;
