import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import "./App.css";

function App() {
  return (
    <>
      <Navbar/>
      
      <main>
        <Hero/>
        <Features/>
      </main>

      <footer className="footer">
        <a href="#home" className="logo">
          Link<span>U</span>
        </a>

        <p>Connecting potential with opportunity.</p>

        <span> &copy; 2026 LinkU</span>
      </footer>
      </>
  );
}

export default App;

