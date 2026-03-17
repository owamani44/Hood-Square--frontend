import "./register.scss"
import { useState } from "react";
import { Link } from "react-router";
import logo  from '../../assets/ranzo-cropped.png';
import { myAxios } from "../../api";
import VisibilityOffIconOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIconOutlined from '@mui/icons-material/VisibilityOutlined';


const Register = () => {
    const currentYear = new Date().getFullYear();
    const [registerForm, setRegisterForm] = useState({
             firstName: "",
              lastName: "", 
              roles: "",
              password: "" 
             })
   const [visible,setVisible]  =useState("true");        
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
              <img src={logo} alt="Ranzo Logo" />
            </div>
            
          <h4>First Name
             <br/> 
             <input
              name="firstName"
              type="text"
               onChange={handleInput} 
               value={registerForm.firstName} 
               placeholder={"First Name"}/>
            </h4>
            <h4>Last Name
             <br/> 
             <input
              name="lastName"
              type="text"
               onChange={handleInput} 
               value={registerForm.lastName} 
               placeholder={"Last Name"}/>
            </h4>
            <h4>Role
             <br/> 
             <select
                value={registerForm.roles}
               onChange={handleInput} 
               name="roles" 
               >
                    <option value="MANAGER">MANAGER</option>
                    <option value="VET">VET</option>
                    <option value="RANCH OPERATOR">RANCH OPERATOR</option>
                </select>
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
          <button>Register</button>
          <p>Already have an account? <Link to="/">Log in</Link></p>
        </form>
      </div>
      <div className="footer">
        <p>Copyright © {currentYear} Ranzo. All rights reserved.</p>
      </div>
      
    </div>
  )
}

export default Register
