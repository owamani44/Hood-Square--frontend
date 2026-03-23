import { BrowserRouter,Routes,Route } from "react-router";
import Login from "./Pages/login/Login";
import Register from "./Pages/register/Register";
import Chats from "./Pages/chats/Chats";
import Skills from "./Pages/services/Skills";

import Alerts from "./Pages/alert/Alerts";
import Profile from "./Pages/profile/Profile";
import LostAndFound from "./Pages/lostAndFound/LostAndFound";
import Connect from "./Pages/connect/Connect";

function App() {
  

  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/">
          <Route index element={<Login/>}/>
          <Route path="signup" element={<Register/>}/>
          <Route path="chats" element={<Chats/>}/>
          <Route path="/connect" element={<Connect/>}/>
          <Route path="services" element={<Skills/>}/>
          <Route path="lost" element={<LostAndFound/>}/>
          <Route path="alerts" element={<Alerts/>}/>
          <Route path="profile" element={<Profile/> }/>
          </Route> 
        </Routes>
        </BrowserRouter>
        
    </>
  )
}

export default App
