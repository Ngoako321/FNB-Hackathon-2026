import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faGraduationCap, faStar, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const features = [
    {
        number: "01",
        title: "Discover opportunities",
        description: "Explore internships, learnerships, graduate programmes and entry-level jobs.",
        icon: faBriefcase,
        id: "opportunities",
    },
    {
        number: "02",
        title: "Become work-ready",
        description: "Develop professional skills, improve your CV and prepare for interviews.",
        icon: faGraduationCap,
        id: "readiness",
    },
    {
        number: "03",
        title: "Get AI guidance",
        description: "Receive personalized career advice and identify skills you need to grow.",
        icon: faStar,
        id: "ai-coach",
    },
]

function Features() {
    return (
        <section className="features-section">
            <div className="section-heading">
                <span className="eyebrow">HOW LINK-U HELPS</span>

                <h2>More than a job search. <br/>
                <span>A path forward.</span></h2>
                
                <p>The tools, guidance and opportunities to help you take the next step. </p>
            </div>

            <div className="features-grid">
                {features.map((feature) => (
                    <article 
                    className="feature-card"
                    id={feature.id}
                    key={feature.number}
                    >
                        <div className="feature-top">
                            <span className="feature-number">
                                {feature.number}
                            </span>

                            <span className="feature-icon">
                                <FontAwesomeIcon icon={feature.icon}/>
                            </span>
                        </div>

                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>

                        <a href="#get-started" className="feature-link">
                            Learn more{" "} <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Features;