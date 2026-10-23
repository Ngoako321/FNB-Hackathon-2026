import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faGraduationCap, faArrowRightToBracket, } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    return (
        <nav className="navbar">
            <a href="#home" className="logo">
                Link<span>U</span>
            </a>

            <div className="nav-links">
                <a href="home">Home</a>

                <a href="#oppportunities"><FontAwesomeIcon icon={faBriefcase} /> {" "}Opportunities</a>

                <a href="#readiness"><FontAwesomeIcon icon={faGraduationCap}/> {" "}Career Readiness</a>
            </div>

            <div className="nav-actions">
                <a href="#login" className="login-link"><FontAwesomeIcon icon={faArrowRightToBracket}/> {" "}Log in</a>
                <a href="#get-started" className="nav-button">Get Started</a>
            </div>
        </nav>
    );
}

export default Navbar;