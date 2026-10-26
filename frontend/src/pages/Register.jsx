import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import "./Auth.css";
import { useState } from "react";

function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(event) {
        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    full_name: fullName.trim(),
                    email: email.trim().toLowerCase(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data.detail === "string"
                        ? data.detail
                        : "Registration failed. Please check your details."
                );
            }

            setMessage("Account created successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(
                err.message === "Failed to fetch"
                    ? "Cannot connect to the server. Make sure the FastAPI backend is running."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <Link to="/" className="logo auth-logo">
            Link<span>U</span></Link>

            <section className="auth-card">
                <div className="auth-heading">
                    <span className="eyebrow">START YOUR JOURNEY</span>
                    <h1>Create your account.</h1>
                    <p>Take the first step towards your future career.</p>
                </div>

                <form onSubmit={handleRegister}>
                    <label htmlFor="fullName">Full name</label>
                    <div className="auth-input">
                        <FontAwesomeIcon icon={faUser}/>
                        <input type="text" id="fullName" placeholder="Your full name" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2}  maxLength={100} required/>
                    </div>

                    <label htmlFor="registerEmail">Email address</label>
                    <div className="auth-input">
                        <FontAwesomeIcon icon={faEnvelope}/>
                        <input type="email" id="registerEmail" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                    </div>

                    <label htmlFor="registerPassword">Password</label>
                    <div className="auth-input">
                        <FontAwesomeIcon icon={faLock}/>
                        <input type="password" id="registerPassword" placeholder="Create a password" autoComplete="new-password" minLength={8} maxLength={128} value={password}  onChange={(event) => setPassword(event.target.value)} required/>
                    </div>

                    {error && (
                        <p role="alert" className="auth-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p role="status" className="auth-success">
                            {message}
                        </p>
                    )}

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Creating account...": "Create account"}
                        {" "} 
                        {!loading && <FontAwesomeIcon icon={faArrowRight} />}
                        </button>
                </form>

                <p className="auth-switch"> Already have an account?{" "} <Link to="/login">Log in</Link></p>
            </section>

            <p className="auth-footer">Connecting potential with opportunity.</p>
        </main>
    );
}

export default Register;