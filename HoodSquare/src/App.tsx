import { BrowserRouter,Routes,Route } from "react-router";
import Login from "./Pages/login/Login";
import Register from "./Pages/register/Register";
import Chats from "./Pages/chats/Chats";
import Services from "./Pages/services/Services";
import Lost from "./Pages/lostAndFound/Lost";
import Alert from "./Pages/alert/Alert";
import Profile from "./Pages/profile/Profile";

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
          <Route path="lost" element={<Lost/>}/>
          <Route path="alerts" element={<Alert/>}/>
          <Route path="profile" element={<Profile/> }/>
          </Route> 
        </Routes>
        </BrowserRouter>
        
    </>
  )
}

export default App
