import { BrowserRouter,Routes,Route } from "react-router-dom";

function App() {
  

  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/">
          <Route index element={<Login/>}/>
          <Route path="signup" element={<Register/>}/>
          <Route path="chats" element={<Chats/>}/>
          <Route path="services" element={<Services/>}/>
          <Route path="lost" element={<LostAndFound/>}/>
          <Route path="alert" element={<Alert/>}/>
          <Route path="profile" element={<Profile/> }/>
          </Route> 
        </Routes>
        </BrowserRouter>
        
    </>
  )
}

export default App
