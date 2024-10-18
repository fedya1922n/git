import React from 'react'
import NotesProvider from './components/context/NotesProvider'
import Github from './components/github'

const App = () => {
  return (
   <NotesProvider>
    <Github/>       
   </NotesProvider>
  )
}

export default App
