
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBriefcase,faGraduationCap,faMagnifyingGlass,faArrowRight,faArrowLeft,faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./Opportunities.css";

function Opportunities() {
    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/opportunities"
                );

                if (!response.ok) {
                    throw new Error("Could not load opportunities.");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error(
                        "The API returned an invalid response."
                    );
                }

                setOpportunities(data);
            } catch (err) {
                console.error(
                    "Error fetching opportunities:",
                    err
                );

                setError(
                    "Unable to load opportunities. Please make sure the LinkU API is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    // Get available locations from the API data.
    const locations = [
        ...new Set(
            opportunities
                .map((item) => item.location)
                .filter(Boolean)
        ),
    ].sort();

    // Filter opportunities by search, type, and location.
    const filteredOpportunities = opportunities.filter((item) => {
        const skills = Array.isArray(item.skills)
            ? item.skills
            : typeof item.skills === "string"
                ? item.skills.split(",").map((skill) => skill.trim())
                : [];

        const searchableText = [
            item.title,
            item.company,
            item.location,
            item.description,
            ...skills,
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(
            search.trim().toLowerCase()
        );

        const matchesType =
            selectedType === "All" ||
            item.type === selectedType;

        const matchesLocation =
            selectedLocation === "All" ||
            item.location === selectedLocation;

        return (
            matchesSearch &&
            matchesType &&
            matchesLocation
        );
    });

    return (
        <div className="opportunities-page">
            <header className="opportunities-header">
                <Link
                    to="/dashboard"
                    className="opportunities-logo"
                >
                    Link<span>U</span>
                </Link>

                <Link
                    to="/dashboard"
                    className="back-link"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    {" "}Back to Dashboard
                </Link>
            </header>

            <main className="opportunities-main">
                <section className="opportunities-intro">
                    <p className="opportunities-eyebrow">
                        YOUR NEXT OPPORTUNITY
                    </p>

                    <h1>Find your next opportunity.</h1>

                    <p>
                        Discover jobs, internships, learnerships and
                        graduate programmes to help you start your career.
                    </p>
                </section>

                {/* Search bar */}
                <section className="opportunities-search">
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                    />

                    <input
                        type="text"
                        placeholder="Search roles, companies or skills..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </section>

                {/* Location filter */}
                <section className="opportunities-location-filter">
                    <label htmlFor="location-filter">
                        Filter by location
                    </label>

                    <select
                        id="location-filter"
                        value={selectedLocation}
                        onChange={(event) =>
                            setSelectedLocation(event.target.value)
                        }
                    >
                        <option value="All">
                            All locations
                        </option>

                        {locations.map((location) => (
                            <option
                                key={location}
                                value={location}
                            >
                                {location}
                            </option>
                        ))}
                    </select>
                </section>

                {/* Opportunity type filters */}
                <section className="opportunities-filters">
                    {[
                        "All","Job","Internship","Learnership","Graduate Programme",
                    ].map((type) => (
                        <button
                            key={type}
                            type="button"
                            className={
                                selectedType === type
                                    ? "filter active"
                                    : "filter"
                            }
                            onClick={() =>
                                setSelectedType(type)
                            }
                        >
                            {type === "All"
                                ? "All opportunities"
                                : type}
                        </button>
                    ))}
                </section>

                {/* Results */}
                <section className="opportunities-results">
                    <div className="results-heading">
                        <div>
                            <h2>Explore opportunities</h2>

                            <p>
                                {loading
                                    ? "Loading opportunities..."
                                    : `${filteredOpportunities.length} opportunities found`}
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="no-opportunities">
                            <h3>Loading opportunities...</h3>
                            <p>
                                Please wait while we fetch opportunities.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="no-opportunities">
                            <h3>Unable to load opportunities</h3>
                            <p>{error}</p>

                            <button
                                type="button"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try again
                            </button>
                        </div>
                    ) : filteredOpportunities.length > 0 ? (
                        <div className="opportunities-grid">
                            {filteredOpportunities.map((item) => {
                                const skills = Array.isArray(item.skills)
                                    ? item.skills
                                    : typeof item.skills === "string"
                                        ? item.skills
                                            .split(",")
                                            .map((skill) => skill.trim())
                                            .filter(Boolean)
                                        : [];

                                return (
                                    <article
                                        className="opportunity-card"
                                        key={item.id}
                                    >
                                        <div className="opportunity-card-top">
                                            <div className="opportunity-icon">
                                                <FontAwesomeIcon
                                                    icon={
                                                        item.type === "Job"
                                                            ? faBriefcase
                                                            : faGraduationCap
                                                    }
                                                />
                                            </div>

                                            <span className="opportunity-type">
                                                {item.type}
                                            </span>
                                        </div>

                                        <h3>{item.title}</h3>

                                        <p className="opportunity-company">
                                            {item.company}
                                        </p>

                                        <p className="opportunity-location">
                                            <FontAwesomeIcon
                                                icon={faLocationDot}
                                            />
                                            {" "}{item.location}
                                        </p>

                                        <p className="opportunity-description">
                                            {item.description}
                                        </p>

                                        <div className="opportunity-skills">
                                            {skills.map((skill, index) => (
                                                <span key={`${skill}-${index}`}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="opportunity-details-btn"
                                            onClick={() =>
                                                navigate(`/opportunities/${item.id}`
                                                )
                                            }
                                        >
                                            View details{" "}
                                            <FontAwesomeIcon
                                                icon={faArrowRight}
                                            />
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-opportunities">
                            <h3>No opportunities found</h3>

                            <p>Try another search term or select different category or location.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setSelectedType("All");
                                    setSelectedLocation("All");
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Opportunities;

