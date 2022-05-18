import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import {ChangeNetworkPage} from "./ChangeNetworkPage/ChangeNetworkPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<ChangeNetworkPage/>}/>
      </Routes>
  );
}

export default App;
