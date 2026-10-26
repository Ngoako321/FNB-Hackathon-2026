import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft,faArrowRight,faBriefcase,faLocationDot,faMagnifyingGlass,faCheckCircle,faGraduationCap,faLightbulb,faChartLine,faWandMagicSparkles,faCircleExclamation,faSpinner, faFloppyDisk} from "@fortawesome/free-solid-svg-icons";

import "./OpportunityMatches.css";

const API_URL = "http://127.0.0.1:8000";

function OpportunityMatches() {
  const [skills, setSkills] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState(false);

  const user = JSON.parse(localStorage.getItem("linkuUser") || "null");


useEffect(() => {
    async function loadSkills() {
      if (!user?.id) {
        setError("Please log in to load and save your skills.");
        setLoadingSkills(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/users/${user.id}/skills`
        );

        if (!response.ok) {
          throw new Error("Could not load your saved skills.");
        }

        const data = await response.json();
        setSkills((data.skills || []).join(", "));
      } catch (err) {
        setError(
          err.message || "Could not connect to the LinkU API."
        );
      } finally {
        setLoadingSkills(false);
      }
    }

    loadSkills();
  }, [user?.id]);

function getSkillsList() {
    return [
      ...new Set(
        skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      ),
    ];
  }

  // Save skills to the user's profile.
  async function saveSkills() {
    const skillsList = getSkillsList();

    if (!user?.id) {
      setError("Please log in before saving your skills.");
      return;
    }

    if (skillsList.length === 0) {
      setError("Please enter at least one skill.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/users/${user.id}/skills`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ skills: skillsList }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Could not save your skills."
        );
      }

      setSkills((data.skills || skillsList).join(", "));
      setMessage("Your skills have been saved!");
    } catch (err) {
      setError(
        err.message || "Could not connect to the LinkU API."
      );
    } finally {
      setSaving(false);
    }
  }

  // Find opportunities matching the entered skills.
  async function findMatches(event) {
    event.preventDefault();

    const skillsList = getSkillsList();

    if (skillsList.length === 0) {
      setError("Please enter at least one skill.");
      setMatches([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setSearched(true);
    setMatches([]);

    try {
      // Save the latest skills before searching.
      if (user?.id) {
        const saveResponse = await fetch(
          `${API_URL}/users/${user.id}/skills`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ skills: skillsList }),
          }
        );

        if (!saveResponse.ok) {
          const saveData = await saveResponse.json();
          throw new Error(
            saveData.detail || "Could not save your skills."
          );
        }
      }

      const response = await fetch(
        `${API_URL}/match-opportunities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ skills: skillsList }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to find matches. Please try again."
        );
      }

      setMatches(Array.isArray(data) ? data : []);
      setMessage("Your skills are saved and your matches are ready.");
    } catch (err) {
      setError(
        err.message || "Could not connect to the LinkU API."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="matches-page">
      <div className="matches-container">
        <Link to="/opportunities" className="matches-back">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Browse all opportunities</span>
        </Link>

        <section className="matches-hero">
          <span className="matches-eyebrow">
            <FontAwesomeIcon icon={faGraduationCap} />
            YOUR CAREER JOURNEY
          </span>

          <h1>Find opportunities that match your skills.</h1>

          <p>
            Tell LinkU what you can do, and discover opportunities
            ranked by how closely their required skills match yours.
          </p>

          <div className="matches-hero-note">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            <span>
              Personalised recommendations based on your skills
            </span>
          </div>
        </section>

        <section className="matches-form-card">
          <div className="matches-form-heading">
            <div className="matches-form-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>

            <div>
              <h2>Your skills profile</h2>
              <p>
                Your saved skills load automatically. Update them
                whenever you learn something new.
              </p>
            </div>
          </div>

          <form className="matches-form" onSubmit={findMatches}>
            <label htmlFor="skills">
              What skills do you have?
            </label>

            <textarea
              id="skills"
              name="skills"
              value={skills}
              onChange={(event) => {
                setSkills(event.target.value);
                setMessage("");
              }}
              placeholder="e.g. Python, SQL, communication, teamwork"
              rows={4}
              disabled={loadingSkills}
              required
            />

            <p className="matches-hint">
              Separate each skill with a comma.
            </p>

            {loadingSkills && (
              <p className="matches-hint">
                <FontAwesomeIcon icon={faSpinner} spin /> Loading
                your saved skills...
              </p>
            )}

            {error && (
              <p className="matches-error" role="alert">
                <FontAwesomeIcon icon={faCircleExclamation} />
                {error}
              </p>
            )}

            {message && (
              <p className="matches-success" role="status">
                <FontAwesomeIcon icon={faCheckCircle} />
                {message}
              </p>
            )}

            <div className="matches-actions">
              <button
                className="matches-submit"
                type="button"
                onClick={saveSkills}
                disabled={saving || loadingSkills || !user?.id}
              >
                {saving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                    Save My Skills
                  </>
                )}
              </button>

              <button
                className="matches-submit"
                type="submit"
                disabled={loading || loadingSkills}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Finding matches...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    Find My Matches
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {searched && !loading && !error && (
          <section className="matches-results">
            <div className="matches-results-heading">
              <div>
                <span className="matches-eyebrow">
                  YOUR RECOMMENDATIONS
                </span>
                <h2>Your opportunity matches</h2>
                <p>
                  Opportunities are ranked by skills overlap.
                </p>
              </div>

              <span className="matches-count">
                {matches.length}{" "}
                {matches.length === 1
                  ? "opportunity"
                  : "opportunities"}
              </span>
            </div>

            {matches.length === 0 ? (
              <div className="matches-empty">
                <FontAwesomeIcon icon={faBriefcase} />
                <h3>No opportunities available yet</h3>
                <p>
                  Check back later as more opportunities are added
                  to LinkU.
                </p>
              </div>
            ) : (
              <div className="matches-list">
                {matches.map((opportunity) => (
                  <article
                    className="match-card"
                    key={opportunity.id}
                  >
                    <div className="match-card-top">
                      <div className="match-card-title">
                        <span className="match-type">
                          <FontAwesomeIcon icon={faBriefcase} />
                          {opportunity.type}
                        </span>

                        <h3>{opportunity.title}</h3>

                        <p className="match-company">
                          {opportunity.company}
                        </p>

                        <p className="match-location">
                          <FontAwesomeIcon icon={faLocationDot} />
                          {opportunity.location}
                        </p>
                      </div>

                      <div className="match-score">
                        <div className="match-score-circle">
                          {opportunity.match_percentage}%
                        </div>
                        <span>Skills match</span>
                      </div>
                    </div>

                    <p className="match-description">
                      {opportunity.description}
                    </p>

                    <div className="match-skills-section">
                      <h4>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Skills you match
                      </h4>

                      <div className="match-tags">
                        {opportunity.matching_skills?.length > 0 ? (
                          opportunity.matching_skills.map((skill) => (
                            <span className="match-tag" key={skill}>
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="match-no-skills">
                            No direct skill matches yet
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="match-skills-section">
                      <h4>
                        <FontAwesomeIcon icon={faLightbulb} />
                        Skills to develop
                      </h4>

                      <div className="match-tags missing-tags">
                        {opportunity.missing_skills?.length > 0 ? (
                          opportunity.missing_skills.map((skill) => (
                            <span className="match-tag" key={skill}>
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="match-no-skills">
                            You match all listed skills!
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/opportunities/${opportunity.id}`}
                      className="match-view-link"
                    >
                      View opportunity and apply
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default OpportunityMatches;