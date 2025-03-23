import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/ProfileEdit.css';

function ProfileEdit() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        full_name: '',
        skills: '',
        experience: '',
        contact_info: '',
        resume: null
    });
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== 'job_seeker') {
            navigate('/');
            return;
        }
        axios.get(`http://localhost:5000/profile/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setFormData({
                    full_name: response.data.full_name || '',
                    skills: response.data.skills || '',
                    experience: response.data.experience || '',
                    contact_info: response.data.contact_info || '',
                    resume: null // File input starts empty, existing resume is fetched separately
                });
            })
            .catch(() => {
                // Ignore 404, use empty form
            });
    }, [user, token, navigate]);

    const handleChange = (e) => {
        if (e.target.name === 'resume') {
            setFormData({ ...formData, resume: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('full_name', formData.full_name);
        data.append('skills', formData.skills);
        data.append('experience', formData.experience);
        data.append('contact_info', formData.contact_info);
        if (formData.resume) {
            data.append('resume', formData.resume);
        }

        axios.post('http://localhost:5000/profile', data, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                alert('Profile saved successfully!');
                navigate('/dashboard/job-seeker');
            })
            .catch(error => alert(error.response?.data?.error || 'Error saving profile'));
    };

    return (
        <section className="profile-edit">
            <h1>{formData.full_name ? 'Edit Profile' : 'Complete Your Profile'}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="skills"
                    placeholder="Skills (e.g., JavaScript, Python, UI/UX)"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="experience"
                    placeholder="Experience (e.g., 2 years as a Web Developer at XYZ)"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="contact_info"
                    placeholder="Contact Info (e.g., email or phone)"
                    value={formData.contact_info}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                />
                <p className="file-note">Accepted formats: PDF, DOC, DOCX (max 5MB)</p>
                <div className="form-actions">
                    <button type="submit">Save Profile</button>
                    <button type="button" onClick={() => navigate('/dashboard/job-seeker')}>Cancel</button>
                </div>
            </form>
        </section>
    );
}

export default ProfileEdit;