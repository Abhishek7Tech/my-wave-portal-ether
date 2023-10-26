import logo from './logo.svg';
import './App.css';

function App() {

  const wave = () => {
    
  }
  return (
    <div className="mainContainer">

    <div className="dataContainer">
      <div className="header">
      👋 Hey there!
      </div>

      <div className="bio">
      I am Abhishek and I am a web developer so that's pretty cool right? Connect your Ethereum wallet and wave at me!
      </div>

      <button className="waveButton" onClick={wave}>
        Wave at Me
      </button>
    </div>
  </div>
  );
}

export default App;
