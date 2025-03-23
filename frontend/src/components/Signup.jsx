import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this
import axios from 'axios';
import '../styles/Auth.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('job_seeker');
    const navigate = useNavigate(); // Add this

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/signup', { email, password, role });
            alert('Signup successful! Please log in.');
            navigate('/login'); // Redirect to login page
            setEmail('');
            setPassword('');
        } catch (error) {
            alert(error.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Signup</h2>
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
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="job_seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                </select>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;