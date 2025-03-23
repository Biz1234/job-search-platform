import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            // Store token and user_id in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user.id);
            // Update AuthContext with user data
            login(response.data.token, response.data.role);
            alert('Logged in successfully!');
            // Redirect based on role
            if (response.data.role === 'job_seeker') {
                navigate('/dashboard/job-seeker');
            } else if (response.data.role === 'employer') {
                navigate('/dashboard/employer');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;