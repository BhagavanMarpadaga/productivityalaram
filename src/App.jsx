// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React from 'react';
import audioFile from './assets/mixkit-truck-reversing-beeps-loop-1077.wav'; // Import the audio file

import './App.css'
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  //create the the time gap in sec, min, hours
  // on click of the start after every that gap beep tone should come
  // if the user want to pause it reset the timer
  // const [count, setCount] = useState(0)
  const [timer,setTimer] = useState("")
  const audio_tag = React.useRef(null);
  const [toggle,setToggle] = useState(true)
  const intervalRef = React.useRef(null);
  const [cursec,setCursec] = useState(0);
  const handleCreateTimer =(e)=>{
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log('data s ',formData)
    const seconds = formData.get('second')
    const minutes = formData.get('minute')
    const hour = formData.get('hour')
   const totalSec = (hour * 3600) + (minutes * 60) + parseInt(seconds)
    console.log('total seconds are ',totalSec)
    setTimer(totalSec)

  }
  useEffect(()=>{
    if(cursec>0){
      const timerInterval = setInterval(() => {
        setCursec(prevSec => {
          if (prevSec <= 1) {
            clearInterval(timerInterval);
            // handlePauseTimer(); // Stop the audio when the timer reaches 
            return 0; // Reset to 0
          }
          return prevSec - 1; // Decrease the current seconds
        });
      }, 1000); // Update every second

      return () => clearInterval(timerInterval); // Cleanup on unmount or when cursec changes
    }
  }, [toggle]);
  const handleStartTimer =()=>{
    setCursec(timer)
    setToggle((prev)=>!prev)
    if (timer && audio_tag.current) {
      intervalRef.current = setInterval(async () => {
        audio_tag.current.play();
        await new Promise((res)=> setTimeout(()=>{res("ok")},1000))
        setCursec(()=>timer)
        setToggle((prev)=>!prev)
      }, timer * 1000); // Convert seconds to milliseconds

      // Clear the interval when the component unmounts or timer changes
      return () => clearInterval(intervalRef.current);
    }

  }
  const handlePauseTimer =()=>{
    if (audio_tag.current) {
      audio_tag.current.pause();
      audio_tag.current.currentTime = 0; // Reset the audio to the beginning
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Clear the interval reference
    }
   

  }
  return (
    <>
    <form onSubmit={handleCreateTimer}>
    <label htmlFor='second'>seconds</label>  
    <input type='number' name='second' min={0} max={60}/>
    <label htmlFor='mnute'>Minutes</label>  
    <input type='number' name='mnute' min={0} max={60}/>
    <label htmlFor='hour'>Hours</label>  
    <input type='number' name='hour' min={0} max={24}/>
    <button type='submit'>Create timer</button>
    
    </form>
    {
      timer && <p> your alarm will beep in an interval of  {timer}</p>
    }
    <div>
      
    <audio ref={audio_tag} src={audioFile} controls/>
  </div>
  <p>cur sec : {cursec}</p>
  <button onClick={handleStartTimer}>start</button>
  <button onClick={handlePauseTimer}>pause</button>
    </>
  )
}

export default App
