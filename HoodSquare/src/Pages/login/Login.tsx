import "./Login.scss"
import logo from '../../assets/ranzo-cropped.png';
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { myAxios } from "../../api"
import VisibilityOffIconOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIconOutlined from '@mui/icons-material/VisibilityOutlined';

function Login() {
  const currentYear = new Date().getFullYear();
  const navigate=useNavigate();
  const [visible,setVisible]  =useState(true); 
  const [registerForm, setRegisterForm] = useState({
                username: "",
                password: "" 
               })
             const handleInput = (event:React.ChangeEvent<HTMLInputElement| HTMLSelectElement >)=>{
                   setRegisterForm({...registerForm, [event.target.name]: event.target.value})
             }
             function handleSubmit (event:React.ChangeEvent<HTMLFormElement>){
               event.preventDefault();
               myAxios.post("/auth/login", registerForm)
               .then(res=>{
                 console.log("Log in successfull", res.data)
                  localStorage.setItem("token", res.data.token);
                 navigate("/home");
               })
               .catch(err=>{
                  if (err.response?.status === 401) {
                          alert("Invalid username or password");
                  } else {
                        alert("Something went wrong");
                   }
               })
             }
  return (
    <div className="login">
      
        <div className="centre">
        <form onSubmit={handleSubmit} className="loginForm">
            <div className="logoContainer">
              <img src={logo} alt="Ranzo Logo" />
            </div>
            
          <h4>
            Username 
            <br/> 
            <input 
            name="username"
            type="text"
            onChange={handleInput}
            value={registerForm.username}
             placeholder={"Username"}/>
             </h4>
          <h4 className="passwordField">Password 
                      <br/> 
                      <input
                      name="password"
                       type={visible ? "text":"password"}
                       value={registerForm.password}
                       onChange={handleInput}  
                       placeholder={"Password"}/>
                        <span className="showPassword" onClick={()=>setVisible(!visible)}>
                          {visible? <VisibilityIconOutlined/> : <VisibilityOffIconOutlined/>}
                        </span>
                       
                       </h4>  
          <button >Log in</button>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </form>
      </div>
      <div className="footer">
        <p>Copyright © {currentYear} Ranzo. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Login
