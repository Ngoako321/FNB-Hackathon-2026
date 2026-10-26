import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faArrowRight, } from "@fortawesome/free-solid-svg-icons";
import "./Auth.css";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Login failed. Please try again."
                );
            }

            localStorage.setItem("linkuUser", JSON.stringify(data.user));
            setMessage(`Welcome back, ${data.user.full_name}!`);

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (err) {
            setError(
                err.message === "Failed to fetch" ? "Cannot connect to LinkU. Check that the backend is running." : err.message
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
                    <span className="eyebrow">WELCOME BACK</span>
                    <h1>Good to see you.</h1>
                    <p>Continue your journey towards your next opportunity.</p>
                </div>

                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email Address</label>
                    <div className="auth-input">
                        <FontAwesomeIcon icon={faEnvelope}/>
                        <input type="email" id="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                    </div>

                    <label htmlFor="password">Password</label>
                    <div className="auth-input">
                        <FontAwesomeIcon icon={faLock}/>
                        <input type="password" id="password" placeholder="Enter your password..." autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
                    </div>

                    {error && (
                        <p className="auth-error" role="alert">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="auth-success" role="status">
                            {message}
                        </p>
                    )}

                    <button type="submit" className="auth-submit" disabled={loading} >
                        {loading ? "Logging in...": "Log In"}
                        {" "}
                        {!loading && <FontAwesomeIcon icon={faArrowRight}/>}
                    </button>
                </form>

                <p className="auth-switch"> Don't have an account? {" "}
                    <Link to="/register">Create one</Link></p>
            </section>

            <p className="auth-footer">Connecting potential with opportunity.</p>
        </main>
    );
}

export default Login;