import "./navbar.css"

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import logo from '../../assets/hood (2).png';
import { NavLink } from "react-router";
import { Chat, Diversity3, Handyman, Help, ReportProblem } from "@mui/icons-material";


const Navbar = () => {
  return (
    <div className="sidebar">
        <div className="wrapper">
        <div className="top">
            <span className="logo">
                <img src={logo} alt="Hood Square Logo" />
                <h3>HoodSquare</h3>
            </span>
            </div>
            <hr />
        
        <div className="centre">
            <ul className="item">
                
                <li>
                <NavLink to="/chats" className="link">
                    <Chat className="icon"/>
                    
                </NavLink>
                </li>

                <li>
                    <NavLink to="/users" className="link">
                    <Diversity3 className="icon"/>
                    
                    </NavLink>
                </li>
                
                <li>
                    <NavLink to="/services" className="link">
                    <Handyman className="icon"/>
                    
                    </NavLink>
                </li>
                
                <li>
                    <NavLink to="/lost" className="link">
                    <Help className="icon"/>
                    
                    </NavLink>
                </li>
                
                <li>
                    <NavLink to="/alerts" className="link">
                    <ReportProblem className="icon"/>
                   
                    </NavLink>
                </li>
               
                <li>
                    <NavLink to="/profile" className="link">
                    <AccountBoxIcon className="icon"/>
                     
                    </NavLink>
                </li>
                
            </ul>
        </div>
        
                    
        </div>
    </div>
  )
}

export default Navbar
