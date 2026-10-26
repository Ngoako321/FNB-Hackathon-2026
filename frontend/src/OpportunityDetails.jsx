import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBriefcase, faGraduationCap, faLocationDot, faBuilding, faCheckCircle, faPaperPlane, } from "@fortawesome/free-solid-svg-icons";
import "./OpportunityDetails.css";

function OpportunityDetails() {
    const { id } = useParams();

    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading]  = useState(true);
    const [error, setError] = useState("");

    const [motivation, setMotivation] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState("");
    const [applicationError, setApplicationError] = useState("");

    useEffect(() => {
        const fetchOpportunity = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/opportunities/${id}`
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error ("This opportunity could not be found.");
                    }
                    throw new Error("Unable to load this opportunity.");
            
                }

                const data = await response.json();
                setOpportunity(data);

            } catch(err) {
                console.error("Error fetching opportunity:", err);
                setError(
                    err.message || "Unable to load this opportunity. Please check your API."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchOpportunity();
    }, [id]);

    const handleApplicationSubmit = async (event) => {
        event.preventDefault();

        setApplicationMessage("");
        setApplicationError("");

        const savedUser = localStorage.getItem("linkuUser");

        if (!savedUser) {
            setApplicationError(
                "Please log in before applying for an opportunity."
            );
            return;
        }

        let user;

        try {
            user = JSON.parse(savedUser);
        } catch {
            setApplicationError(
                "Your login information is invalid. Please log in again."
            );
            return;
        }

        if (!user?.id) {
            setApplicationError(
                "Your user information is missing. Please log in again"
            );
            return
        }

        if (!motivation.trim()) {
            setApplicationError(
                "Please explain why you want this opportunity."
            );
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/applications",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        opportunity_id: Number(id),
                        motivation: motivation.trim(),
                    }),
                }
            );

           const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Unable to submit your application."
                );
            }

            setApplicationMessage(
                "Your application has been submitted successfully!"
            );
            setMotivation("");
        } catch (err) {
            console.error("Error submitting application:", err);
            setApplicationError(
                err.message ||
                "Unable to submit your application. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="opportunity-details-page">
                <p className="details-message">
                    Loading opportunity details...
                </p>
            </div>
        );
    }

    if (error || !opportunity) {
        return (
            <div className="opportunity-details-page">
                <Link
                    to="/opportunities"
                    className="details-back-link"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    {" "}Back to opportunities
                </Link>

                <div className="details-message">
                    <h2>Opportunity unavailable</h2>
                    <p>
                        {error || "This opportunity could not be found."}
                    </p>
                </div>
            </div>
        );
    }

    const skills = Array.isArray(opportunity.skills)
        ? opportunity.skills
        : typeof opportunity.skills === "string"
            ? opportunity.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : [];

    return (
        <div className="opportunity-details-page">
            <header className="details-header">
                <Link to="/dashboard" className="details-logo">
                    Link<span>U</span>
                </Link>

                <Link
                    to="/opportunities"
                    className="details-back-link"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    {" "}Back to opportunities
                </Link>
            </header>

            <main className="details-main">
                <p className="details-eyebrow">
                    OPPORTUNITY DETAILS
                </p>

                <section className="details-hero">
                    <div className="details-icon">
                        <FontAwesomeIcon
                            icon={
                                opportunity.type === "Job"
                                    ? faBriefcase
                                    : faGraduationCap
                            }
                        />
                    </div>

                    <span className="details-type">
                        {opportunity.type}
                    </span>

                    <h1>{opportunity.title}</h1>

                    <p className="details-company">
                        <FontAwesomeIcon icon={faBuilding} />
                        {" "}{opportunity.company}
                    </p>

                    <p className="details-location">
                        <FontAwesomeIcon icon={faLocationDot} />
                        {" "}{opportunity.location}
                    </p>
                </section>

                <section className="details-card">
                    <h2>About this opportunity</h2>

                    <p className="details-description">
                        {opportunity.description}
                    </p>

                    <h2>Skills and requirements</h2>

                    {skills.length > 0 ? (
                        <div className="details-skills">
                            {skills.map((skill) => (
                                <span key={skill}>
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                    />
                                    {" "}{skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p>No specific skills have been listed.</p>
                    )}
                </section>

                <section className="details-card application-card">
                    <h2>Apply for this opportunity</h2>

                    <p>
                        Tell the opportunity provider why you are
                        interested and what you hope to contribute.
                    </p>

                    <form
                        className="application-form"
                        onSubmit={handleApplicationSubmit}
                    >
                        <label htmlFor="motivation">
                            Why are you interested?
                        </label>

                        <textarea
                            id="motivation"
                            name="motivation"
                            value={motivation}
                            onChange={(event) => {
                                setMotivation(event.target.value);
                                setApplicationError("");
                                setApplicationMessage("");
                            }}
                            placeholder="Explain your interest, skills, and what you hope to learn..."
                            rows={5}
                            maxLength={2000}
                            required
                            disabled={submitting}
                        />

                        <p className="motivation-count">
                            {motivation.length}/2000 characters
                        </p>

                        {applicationError && (
                            <p className="application-error" role="alert">
                                {applicationError}
                            </p>
                        )}

                        {applicationMessage && (
                            <p
                                className="application-success"
                                role="status"
                            >
                                {applicationMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="application-submit-button"
                            disabled={submitting}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                            {" "}
                            {submitting
                                ? "Submitting..."
                                : "Submit application"}
                        </button>
                    </form>
                </section>

                <Link
                    to="/opportunities"
                    className="details-return-button"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    {" "}Browse opportunities
                </Link>
            </main>
        </div>
    );
}

export default OpportunityDetails;