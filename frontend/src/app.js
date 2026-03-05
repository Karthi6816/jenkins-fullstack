import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [message, setMessage] = useState("");

  const getBackendMessage = async () => {
    try {

      const response = await axios.get("http://100.55.158.242:5000/api");

      setMessage(response.data.message);

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="container">

      <h1>Full Stack Deployment using Jenkins</h1>

      <button onClick={getBackendMessage}>
        Call Python Backend
      </button>

      <p>{message}</p>

    </div>
  );
}

export default App;
