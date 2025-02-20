import './App.css';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Warmup from './components/warmup/warmup';
import Combs from './components/combs/combs';
import Stopwatch from './components/stopwatch/stopwatch';
import Timer from './components/timer/timer';
import IntroSteps from './components/introsteps/introsteps';
import Sensai from './components/sensai/sensai';
import ProgressTracker from './components/progtrack/progtrack';
import { useState, useEffect } from 'react';

function App() {
  const [difficulty, setDifficulty] = useState('basic');
  const [trainingFocus, setTrainingFocus] = useState('power');
  const [showCombs, setShowCombs] = useState(false);
  const [showStretches, setShowStretches] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [combKey, setCombKey] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  const [showTimerSection, setShowTimerSection] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [targetRounds, setTargetRounds] = useState('10');

  useEffect(() => {
    const handleTimerComplete = () => {
      // Dispatch timerComplete event when timer hits 00:00
      const event = new Event('timerComplete');
      window.dispatchEvent(event);
    };

    window.addEventListener('timerZero', handleTimerComplete);
    return () => window.removeEventListener('timerZero', handleTimerComplete);
  }, []);

  const handleStretchesComplete = () => {
    setShowStretches(false);
    setShowTimerSection(true);
  };

  const handleGetCombos = () => {
    setCombKey(prevKey => prevKey + 1);
    setShowCombs(true);
  };

  const toggleTimer = () => {
    setShowTimer(!showTimer);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleRoundsChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '' || parseInt(value) < 1) {
      setTargetRounds('');
    } else {
      setTargetRounds(parseInt(value));
    }
  };

  return (
    <div className="App">
      <Analytics />
      <SpeedInsights />
      <header className="App-header">
        <p>TRAIN SMARTER &nbsp;&nbsp;&nbsp;&nbsp; FIGHT HARDER</p>
      </header>

      {!showChat ? (
        <div className="App-body">
          {!hasSeenIntro && <IntroSteps onComplete={() => {
            setShowStretches(true);
            setHasSeenIntro(true);
          }} setHasStarted={setHasStarted} />}
          <div>
            {hasStarted && (
              <>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <label style={{ color: '#f5f5f5' }}>
                    Target Rounds:
                    <input
                      type="text"
                      value={targetRounds}
                      onChange={handleRoundsChange}
                      className="target-rounds-input"
                    />
                  </label>
                  <ProgressTracker totalRounds={targetRounds} />
                </div>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px', 
                    margin: '20px 0' }}>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{
                      padding: '8px',
                      backgroundColor: '#2d2d2d',
                      color: '#f5f5f5',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <select
                    value={trainingFocus}
                    onChange={(e) => setTrainingFocus(e.target.value)}
                    disabled
                    style={{
                      padding: '8px',
                      backgroundColor: '#2d2d2d',
                      color: '#f5f5f5',
                      borderRadius: '4px',
                      cursor: 'not-allowed',
                      opacity: 0.6
                    }}>
                    <option value="power">Training Focus (Coming Soon)</option>
                    <option value="power">Power</option>
                    <option value="speed">Speed</option>
                    <option value="endurance">Endurance</option>
                    <option value="form">Form</option>
                  </select>
                </div>
              </>
            )}
            {hasStarted && (
              <button className="homeBtn" onClick={handleGetCombos}>Generate New Combinations</button>
            )}
            {showStretches && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <Warmup onComplete={handleStretchesComplete} />
                </div>
              </div>
            )}
            {showCombs && <Combs key={combKey} diff={difficulty} />}
          </div>
          {showTimerSection && (
            <div className="timer-section">
              <h2 style={{ 
                marginTop: 40,
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#a1a3a6'
                 }}>Round Clock</h2>
              <button className="homeBtn" onClick={toggleTimer}>
                {showTimer ? 'Switch to Stopwatch' : 'Switch to Timer'}
              </button>
              {showTimer ? <Timer /> : <Stopwatch />}
            </div>
          )}
        </div>
      ) : (
        <Sensai />
      )}

      <footer className='App-footer'>
        created by Azmayen Murshid
        <p>Version 1.0.2</p>
      </footer>

      <button 
        onClick={toggleChat}
        className="chat-toggle-button"
        style={{ zIndex: 1000 }}>
        {showChat ? '✕' : '💬'}
      </button>
    </div>
  );
}

export default App;
