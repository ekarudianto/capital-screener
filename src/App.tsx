import React, {useState} from 'react';
import './App.css';
import Screener from "./components/Screener";
import APICredentials from "./components/APICredentials";

function App() {
  const [securityToken, setSecurityToken] = useState('');
  const [cst, setCst] = useState('');

  return (
    <div className="App">
      <APICredentials
        updateSecurityToken={setSecurityToken}
        updateCst={setCst}
      />
      <Screener credentials={{ securityToken, cst }} />
    </div>
  );
}

export default App;
