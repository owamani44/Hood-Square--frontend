import "./register.css"
import { useState } from "react";
import { Link } from "react-router";
import { myAxios } from "../../api";
import VisibilityOffIconOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIconOutlined from '@mui/icons-material/VisibilityOutlined';
import logo from '../../assets/hood.png';


const Register = () => {
    const currentYear = new Date().getFullYear();
    const [registerForm, setRegisterForm] = useState({
             fullName: "",
              username: "",
              phoneNumber:"", 
              password: "" 
             })
   const [visible,setVisible]  =useState(true);        
           const handleInput = (event:React.ChangeEvent<HTMLInputElement| HTMLSelectElement >)=>{
                 setRegisterForm({...registerForm, [event.target.name]: event.target.value})
           }
           function handleSubmit (event:React.ChangeEvent<HTMLFormElement>){
             event.preventDefault();
             myAxios.post("/auth/register", registerForm)
             .then(res=>{
               console.log("Registration successfull", res.data)
             })
             .catch(err=>{
               console.error("Error registering", err) 
             })
           }
  return (
    <div className="register">
        <div className="centre">
        <form  onSubmit={handleSubmit} className="registerForm">
            <div className="logoContainer">
             <img src={logo} alt="Hood Square Logo" />
            </div>
            
          <h4>Full Name
             <br/> 
             <input
              name="fullName"
              type="text"
               onChange={handleInput} 
               value={registerForm.fullName} 
               placeholder={"Full Name"}/>
            </h4>

            <h4>Tel.
             <br/> 
             <input
              name="phoneNumber"
              type="tel"
               onChange={handleInput} 
               value={registerForm.phoneNumber} 
               placeholder={"Phone Number"}/>
            </h4>
            <h4>Username
             <br/> 
             <input
              name="username"
              type="text"
               onChange={handleInput} 
               value={registerForm.username} 
               placeholder={"Enter your desired username"}/>
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
                {visible? (<><VisibilityIconOutlined/> Hide password</>) :
                (<><VisibilityOffIconOutlined/> Show password</>) }
                
              </span>
             
             </h4> 
          <button>Register</button>
          <p>Already have an account? <Link to="/">Log in</Link></p>
        </form>
      </div>
      <div className="footer">
        <p>Copyright © {currentYear} Hood Square. All rights reserved.</p>
      </div>
      
    </div>
  )
}

export default Register
