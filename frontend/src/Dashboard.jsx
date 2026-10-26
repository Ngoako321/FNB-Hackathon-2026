import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faGraduationCap, faFileLines, faComments, faArrowRight, faMagnifyingGlass, faLightbulb, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("linkuUser");
        navigate("/login", {replace: true});
    }

    const [user] = useState(() =>{
        const savedUser = localStorage.getItem("linkuUser");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    return (
        <div className="dashboard-page">
            <aside className="dashboard-sidebar">
                <Link to="/" className="logo">
                    Link<span>U</span>
                </Link>

                <p className="sidebar-label">MENU</p>

                <Link to="/dashboard" className="sidebar-link active">
                    <FontAwesomeIcon icon={faBriefcase} />Dashboard
                </Link>

                <Link to="/opportunities" className="sidebar-link">
                    <FontAwesomeIcon icon={faGraduationCap} />Opportunities
                </Link>

                <a href="#career-tools" className="sidebar-link">
                    <FontAwesomeIcon icon={faFileLines}/> Career Preparation
                </a>

                <div className="sidebar-bottom">
                    <div className="user-avatar">
                        {user?.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <strong>{user?.full_name || "LinkU Member"}</strong>
                    <p>Career Seeker</p>

                    <button type="button" className="logout-btn" onClick={handleLogout} aria-label="Sign out" title="Sign out">
                        <FontAwesomeIcon icon={faRightFromBracket}/>
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <p className="dashboard-eyebrow">YOUR CAREER JOURNEY</p>
                        <h1>Welcome{user?.full_name ? `, ${user.full_name}` : " to LinkU"}!</h1>
                        <p>Let's take the next step towards your future.</p>
                    </div>

                    <Link to="/opportunities" className="dashboard-primary-btn">
                    Explore opportunities
                    <FontAwesomeIcon icon={faArrowRight}/>
                    </Link>
                </header>

                <section className="dashboard-banner">
                    <div>
                        <span className="banner-tag">YOUR FUTURE STARTS HERE</span>
                        <h2>Your potential deserves an opportunity.</h2>
                        <p>Discover opportunities, build your skills and get ready to launch your career.</p>

                        <Link to="/opportunities" className="banner-btn">
                        Find opportunities
                        </Link>
                    </div>

                    <div className="banner-icon">
                        <FontAwesomeIcon icon={faLightbulb}/>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-heading">
                        <div>
                            <h2>Your career toolkit</h2>
                            <p>Everything you need to prepare for work.</p>
                            </div>
                        </div>

                    <div className="toolkit-grid">
                        <Link to="/opportunities" className="toolkit-card">
                            <div className="toolkit-icon opportunities-icon">
                                <FontAwesomeIcon icon={faBriefcase} />
                            </div>
                            <h3>Find Opportunities</h3>
                            <p>Explore jobs, internships, learnerships and graduate programmes.</p>
                            <span>Explore now <FontAwesomeIcon icon={faArrowRight} /></span>
                        </Link>

                        <a href="#career-tools" className="toolkit-card">
                            <div className="toolkit-icon cv-icon">
                                <FontAwesomeIcon icon={faFileLines} />
                            </div>
                            <h3>CV Assistance</h3>
                            <p>Learn how to present your experience and skills to employers.
                            </p>
                            <span>Coming soon</span>
                        </a>

                        <a href="#career-tools" className="toolkit-card">
                            <div className="toolkit-icon interview-icon">
                                <FontAwesomeIcon icon={faComments} />
                            </div>
                            <h3>Interview Practice</h3>
                            <p>Prepare for interviews and build confidence before meeting employers.
                            </p>
                            <span>Coming soon</span>
                        </a>
                    </div>
                </section>

                <section className="dashboard-section" id="career-tools">
                    <div className="section-heading">
                        <div>
                            <h2>Take your next step</h2>
                            <p>Small steps today can open doors tomorrow.</p>
                        </div>
                    </div>

                    <div className="next-step-card">
                        <div className="next-step-icon">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <div>
                            <h3>Start exploring your options</h3>
                            <p>
                                Browse opportunities that can help you gain
                                experience and develop your career.
                            </p>
                        </div>
                        <Link to="/opportunities" aria-label="Browse opportunities">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </section>

                <footer className="dashboard-footer">
                    LinkU — Connect. Prepare. Succeed.
                </footer>
            </main>
        </div>
    );
}

export default Dashboard;