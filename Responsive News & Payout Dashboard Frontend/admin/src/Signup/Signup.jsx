import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Signup.css";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid Gmail address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/signup", {
        username,
        email,
        password,
        role,
      });

      if (response.status === 200) {
        toast.success("Signup successful");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after signup
        }, 3000);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      if (error.response?.data?.message === "User already exists") {
        toast.error("User already exists. Please log in.");
      } else {
        toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer />
      <h1 className="signup-heading">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="signup-form-group">
          <label htmlFor="username" className="signup-label">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
            className="signup-input"
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="email" className="signup-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="signup-input"
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password" className="signup-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="signup-input"
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="role" className="signup-label">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="signup-select"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="signup-submit-btn" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {/* Message and link to login if user already exists */}
      <div className="login-link-container">
        <p>Already have an account? <Link to="/login" className="login-link">Login here</Link></p>
      </div>
    </div>
  );
}

export default SignUp;
