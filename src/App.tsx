import React from 'react'
import { Routes, Route } from 'react-router-dom';
import UserList from './components/userList/UserList';
import UserDetails from './components/userDetails/UserDetails';


function App() {
  return (
    <>
    <Routes>
       <Route path="/" element={<UserList />} />
       <Route path="/UserDetails" element={<UserDetails />} />
       {/* <Route path="/about" element={<About />} /> */}
    </Routes>
 </>

  )
}

export default App