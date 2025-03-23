import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/JobDetails.css';

function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/jobs/${id}`)
            .then(response => {
                setJob(response.data);
                setFormData(response.data); // Pre-fill form with current job data
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching job:', error);
                setLoading(false);
            });
    }, [id]);

    const handleApply = () => {
        axios.post('http://localhost:5000/apply', { job_id: id }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => alert('Application submitted!'))
            .catch(error => alert(error.response?.data?.error || 'Error applying'));
    };

    const handleSaveJob = () => {
        axios.post('http://localhost:5000/save-job', { job_id: id }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => alert('Job saved!'))
            .catch(error => alert(error.response?.data?.error || 'Error saving'));
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            axios.delete(`http://localhost:5000/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    alert('Job deleted successfully!');
                    navigate('/dashboard/employer');
                })
                .catch(error => alert(error.response?.data?.error || 'Error deleting job'));
        }
    };

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        axios.put(`http://localhost:5000/jobs/${id}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Job updated successfully!');
                setJob(formData);
                setIsEditing(false);
            })
            .catch(error => alert(error.response?.data?.error || 'Error updating job'));
    };

    const handleCancel = () => {
        setFormData(job);
        setIsEditing(false);
    };

    const handleBack = () => {
        if (user?.role === 'employer') {
            navigate('/dashboard/employer');
        } else if (user?.role === 'job_seeker') {
            navigate('/dashboard/job-seeker');
        } else {
            navigate('/');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!job) return <p>Job not found.</p>;

    const isEmployerOwner = user && user.role === 'employer' && user.id === job.user_id;
    const isEmployer = user && user.role === 'employer';
    const isJobSeeker = user && user.role === 'job_seeker';

    return (
        <section className="job-details">
            {isEditing && isEmployerOwner ? (
                <div className="edit-form">
                    <h1>Edit Job</h1>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Job Title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="company"
                            placeholder="Company Name"
                            value={formData.company || ''}
                            disabled
                            required
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            required
                        />
                        <select name="category" value={formData.category || ''} onChange={handleChange} required>
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
                            value={formData.salary_range || ''}
                            onChange={handleChange}
                            required
                        />
                        <select name="job_type" value={formData.job_type || ''} onChange={handleChange} required>
                            <option value="">Select Job Type</option>
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="remote">Remote</option>
                        </select>
                        <textarea
                            name="description"
                            placeholder="Job Description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="requirements"
                            placeholder="Requirements"
                            value={formData.requirements || ''}
                            onChange={handleChange}
                            required
                        />
                        <div className="form-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <h1>{job.title}</h1>
                    <div className="job-info">
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Category:</strong> {job.category}</p>
                        <p><strong>Salary Range:</strong> {job.salary_range}</p>
                        <p><strong>Type:</strong> {job.job_type}</p>
                    </div>
                    <div className="job-description">
                        <h2>Description</h2>
                        <p>{job.description || 'No description available.'}</p>
                    </div>
                    <div className="job-requirements">
                        <h2>Requirements</h2>
                        <p>{job.requirements || 'No specific requirements listed.'}</p>
                    </div>
                    <div className="job-actions">
                        {isEmployerOwner ? (
                            <>
                                <button className="edit-btn" onClick={handleEditToggle}>Edit</button>
                                <button className="delete-btn" onClick={handleDelete}>Delete</button>
                            </>
                        ) : isJobSeeker ? (
                            <>
                                <button className="apply-btn" onClick={handleApply}>Apply Now</button>
                                <button className="save-btn" onClick={handleSaveJob}>Save Job</button>
                            </>
                        ) : null}
                        <button className="back-btn" onClick={handleBack}>Back</button>
                    </div>
                </>
            )}
        </section>
    );
}

export default JobDetails;