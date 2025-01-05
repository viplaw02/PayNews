import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Gmail regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state

    // Validate email format
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid Gmail address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { id, name, email, role } = response.data.findUser || response.data.user;
        const user = { id, name, email, role };

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        toast.success('Login successful! Redirecting...');

        setTimeout(() => {
          navigate(role === 'Admin' ? '/admin' : '/user'); // Navigate based on role
        }, 2000);
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <main className="form-signin w-100 m-auto">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal text-center">Log In</h1>

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </main>
  );
};

export default Login;
