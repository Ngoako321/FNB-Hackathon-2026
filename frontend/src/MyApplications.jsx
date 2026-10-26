
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faBriefcase,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import "./MyApplications.css";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const savedUser = localStorage.getItem("linkuUser");

                if (!savedUser) {
                    throw new Error(
                        "Please log in to view your applications."
                    );
                }

                const user = JSON.parse(savedUser);

                if (!user?.id) {
                    throw new Error(
                        "Your login information is invalid. Please log in again."
                    );
                }

                const [
                    applicationsResponse,
                    opportunitiesResponse,
                ] = await Promise.all([
                    fetch("http://127.0.0.1:8000/applications"),
                    fetch("http://127.0.0.1:8000/opportunities"),
                ]);

                if (
                    !applicationsResponse.ok ||
                    !opportunitiesResponse.ok
                ) {
                    throw new Error(
                        "Unable to load your applications."
                    );
                }

                const applicationsData =
                    await applicationsResponse.json();

                const opportunitiesData =
                    await opportunitiesResponse.json();

                setOpportunities(opportunitiesData);

                setApplications(
                    applicationsData.filter(
                        (application) =>
                            application.user_id === Number(user.id)
                    )
                );
            } catch (err) {
                setError(
                    err.message || "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    return (
        <div className="my-applications-page">
            <header className="my-applications-header">
                <Link
                    to="/dashboard"
                    className="my-applications-logo"
                >
                    Link<span>U</span>
                </Link>

                <Link
                    to="/opportunities"
                    className="my-applications-back"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    {" "}Browse opportunities
                </Link>
            </header>

            <main className="my-applications-main">
                <p className="my-applications-eyebrow">
                    YOUR JOURNEY
                </p>

                <h1>My Applications</h1>

                <p className="my-applications-intro">
                    Keep track of the opportunities you have applied for.
                </p>

                {loading && (
                    <p>Loading your applications...</p>
                )}

                {error && (
                    <p className="my-applications-error">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    applications.length === 0 && (
                        <section className="my-applications-empty">
                            <FontAwesomeIcon icon={faBriefcase} />
                            <h2>No applications yet</h2>
                            <p>
                                Explore opportunities and submit your
                                first application.
                            </p>
                            <Link to="/opportunities">
                                Browse opportunities
                            </Link>
                        </section>
                    )}

                {!loading &&
                    !error &&
                    applications.length > 0 && (
                        <section className="my-applications-list">
                            {applications.map((application) => {
                                const opportunity = opportunities.find(
                                    (item) =>
                                        item.id ===
                                        application.opportunity_id
                                );

                                return (
                                    <article
                                        className="my-application-card"
                                        key={application.id}
                                    >
                                        <div className="my-application-top">
                                            <div>
                                                <h2>
                                                    Application #
                                                    {application.id}
                                                </h2>

                                                <p className="my-application-opportunity">
                                                    {opportunity
                                                        ? `${opportunity.title} at ${opportunity.company}`
                                                        : `Opportunity #${application.opportunity_id}`}
                                                </p>

                                                {opportunity && (
                                                    <p>
                                                        {opportunity.location}
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={`application-status status-${(
                                                    application.status || "pending"
                                                )
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}`}
                                            >
                                                {application.status}
                                            </span>
                                        </div>

                                        <h3>Your motivation</h3>

                                        <p className="my-application-motivation">
                                            {application.motivation}
                                        </p>

                                        <p className="my-application-date">
                                            <FontAwesomeIcon icon={faClock} />
                                            {" "}Submitted:{" "}
                                            {application.created_at
                                                ? new Date(
                                                    application.created_at
                                                ).toLocaleString()
                                                : "Date unavailable"}
                                        </p>
                                    </article>
                                );
                            })}
                        </section>
                    )}
            </main>
        </div>
    );
}

export default MyApplications;

