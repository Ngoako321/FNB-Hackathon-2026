import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./Dashboard";
import Opportunities from "./Opportunities";
import OpportunityDetails from "./OpportunityDetails";
import MyApplications from "./MyApplications";
import OpportunityMatches from "./OpportunityMatches";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails />}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-applications" element={<MyApplications />}/>
          <Route path="/match-opportunities" element={<OpportunityMatches />}/>
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

