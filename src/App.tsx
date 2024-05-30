import React, {useState} from 'react';
import './App.css';
import Screener from "./components/Screener";
import APICredentials from "./components/APICredentials";
import Filter from "./components/Filter";
import {MarketType} from "./config/constants";

function App() {
  const [securityToken, setSecurityToken] = useState('');
  const [cst, setCst] = useState('');
  const [marketType, setMarketType] = useState(MarketType.SHARES);

  return (
    <div className="App">
      <APICredentials
        updateSecurityToken={setSecurityToken}
        updateCst={setCst}
      />
      <Filter updateMarketType={setMarketType} />
      <Screener credentials={{ securityToken, cst }} filter={{ marketType }} />
    </div>
  );
}

export default App;
