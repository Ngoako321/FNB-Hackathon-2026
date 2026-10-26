import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBriefcase, faStar, } from "@fortawesome/free-solid-svg-icons";

function Hero() {
    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <div className="hero-badge">
                    Your future starts here
                </div>

                <h1>Your potential.<br/>
                    Your future.<br/>
                    <span>Your Link.</span>
                </h1>
                
                <p className="hero-description">Finding your first opportunity shouldn't be the hardest part of your career. Build your skills, prepare for work and discover opportunities made for you.</p>

                <div className="hero-actions">
                    <a href = "#opportunities" className="primary-button">Explore Opportunities {" "} <FontAwesomeIcon icon={faArrowRight}/></a>
                    <a href="#readiness" className="secondary-button">Build Your Skills</a>
                </div>

                <div className="hero-note">
                    Built for young people. Designed for opportunity.
                </div>
            </div>

            <div className="hero-visual">
                <div className="visual-card">
                    <div className="visual-top">
                        <span className="status-dot"></span>
                        YOUR CAREER JOURNEY
                    </div>

                    <h3>Ready for what's next?</h3>
                    <p>Every skill you build brings you closer to your next opportunity.</p>

                    <div className="progress-label">
                        <span>Work readiness</span>
                        <span>Getting started</span>
                    </div>

                    <div className="progress-track">
                        <div className="progress-fill"></div>
                    </div>

                    <div className="visual-footer">
                        <div className="visual-icon">
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                        <div>
                            <strong>Your AI Career Coach</strong>
                            <p>Guidance for your next step</p>
                        </div>
                    </div>
                </div>

                <div className="floating-tag">
                    <FontAwesomeIcon icon={faBriefcase} /> {" "}Your next chapter starts now
                </div>
            </div>
        </section>
    );
}

export default Hero;