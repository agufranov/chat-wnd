import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useMessages } from './useMessages'
import Chat from './Chat'

function App() {
  const messages = useMessages()

  return (
    <Chat messages={messages} />
  )
}

export default App
