import { useState, useContext, useEffect } from 'react'; // Add useEffect
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/PostJob.css';

function PostJob() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        category: '',
        salary_range: '',
        job_type: '',
        description: '',
        requirements: ''
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, company: user.email || '' })); // Auto-fill company with email
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || user.role !== 'employer') {
            alert('Please log in as an employer to post a job.');
            navigate('/login');
            return;
        }

        try {
            await axios.post('http://localhost:5000/jobs', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Job posted successfully!');
            navigate('/dashboard/employer');
        } catch (error) {
            alert(error.response?.data?.error || 'Error posting job');
        }
    };

    return (
        <section className="post-job">
            <h1>Post a Job</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Job Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleChange}
                    disabled // Disable editing to enforce email
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Finance">Finance</option>
                </select>
                <input
                    type="text"
                    name="salary_range"
                    placeholder="Salary Range (e.g., $50k-$70k)"
                    value={formData.salary_range}
                    onChange={handleChange}
                    required
                />
                <select name="job_type" value={formData.job_type} onChange={handleChange} required>
                    <option value="">Select Job Type</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="remote">Remote</option>
                </select>
                <textarea
                    name="description"
                    placeholder="Job Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="requirements"
                    placeholder="Requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Post Job</button>
            </form>
        </section>
    );
}

export default PostJob;