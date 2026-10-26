import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faGraduationCap, faArrowRightToBracket, } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    return (
        <nav className="navbar">
            <a href="#home" className="logo">
                Link<span>U</span>
            </a>

            <div className="nav-links">
                <a href="#home">Home</a>

                <a href="#opportunities"><FontAwesomeIcon icon={faBriefcase} /> {" "}Opportunities</a>

                <a href="#readiness"><FontAwesomeIcon icon={faGraduationCap}/> {" "}Career Readiness</a>
            </div>

            <div className="nav-actions">
                <Link to="/login" className="login-link">
                <FontAwesomeIcon icon={faArrowRightToBracket}/> Log in
                </Link>

                <Link to="/register" className="nav-button"> Get Started
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;