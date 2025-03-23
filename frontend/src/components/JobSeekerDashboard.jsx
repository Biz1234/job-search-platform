import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/JobSeekerDashboard.css'; // New CSS import

function JobSeekerDashboard() {
    const [data, setData] = useState({ applied: [], saved: [], allJobs: [] });
    const [filters, setFilters] = useState({ location: '', category: '', job_type: '' });
    const [hasProfile, setHasProfile] = useState(true); // Assume true initially
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchData = () => {
        axios.get('http://localhost:5000/dashboard/job-seeker', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setData(prev => ({ ...prev, applied: response.data.applied, saved: response.data.saved }));
            })
            .catch(error => console.error('Error fetching dashboard:', error));

        const query = new URLSearchParams(filters).toString();
        axios.get(`http://localhost:5000/jobs?${query}`)
            .then(response => {
                setData(prev => ({ ...prev, allJobs: response.data }));
            })
            .catch(error => console.error('Error fetching all jobs:', error));

        axios.get(`http://localhost:5000/profile/${localStorage.getItem('user_id')}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => setHasProfile(true))
            .catch(() => setHasProfile(false));
    };

    useEffect(() => {
        fetchData();
    }, [token, filters]);

    const handleApply = (jobId) => {
        axios.post('http://localhost:5000/apply', { job_id: jobId }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Application submitted!');
                setData(prev => ({
                    ...prev,
                    applied: [...prev.applied, prev.allJobs.find(job => job.id === jobId)]
                }));
            })
            .catch(error => alert(error.response?.data?.error || 'Error applying'));
    };

    const handleSave = (jobId) => {
        axios.post('http://localhost:5000/save-job', { job_id: jobId }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Job saved!');
                setData(prev => ({
                    ...prev,
                    saved: [...prev.saved, prev.allJobs.find(job => job.id === jobId)]
                }));
            })
            .catch(error => alert(error.response?.data?.error || 'Error saving'));
    };

    const handleRemoveSaved = (jobId) => {
        axios.delete(`http://localhost:5000/save-job/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Job removed from saved list!');
                setData(prev => ({
                    ...prev,
                    saved: prev.saved.filter(job => job.id !== jobId)
                }));
            })
            .catch(error => alert(error.response?.data?.error || 'Error removing saved job'));
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <section className="job-seeker-dashboard"> {/* Updated class */}
            <h1>Job Seeker Dashboard</h1>
            {!hasProfile && (
                <div className="profile-prompt">
                    <p>Complete your profile to stand out to employers!</p>
                    <button onClick={() => navigate('/profile/edit')}>Complete Profile</button>
                </div>
            )}
            {hasProfile && (
                <button className="edit-profile-btn" onClick={() => navigate('/profile/edit')}>
                    Edit Profile
                </button>
            )}
            <div className="section">
                <h2>All Posted Jobs</h2>
                <div className="filters">
                    <input
                        type="text"
                        name="location"
                        placeholder="Filter by Location"
                        value={filters.location}
                        onChange={handleFilterChange}
                    />
                    <select name="category" value={filters.category} onChange={handleFilterChange}>
                        <option value="">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Design">Design</option>
                        <option value="Finance">Finance</option>
                    </select>
                    <select name="job_type" value={filters.job_type} onChange={handleFilterChange}>
                        <option value="">All Job Types</option>
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="remote">Remote</option>
                    </select>
                </div>
                {data.allJobs.length > 0 ? (
                    <ul>
                        {data.allJobs.map(job => (
                            <li key={job.id}>
                                <span>{job.title} - {job.company} ({job.location})</span>
                                <div>
                                    <button className="view-details" onClick={() => navigate(`/jobs/${job.id}`)}>View Details</button>
                                    <button className="apply-btn" onClick={() => handleApply(job.id)}>Apply</button>
                                    <button className="save-btn" onClick={() => handleSave(job.id)}>Save</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <p>No jobs match your filters.</p>}
            </div>
            <div className="section">
                <h2>Applied Jobs</h2>
                {data.applied.length > 0 ? (
                    <ul>
                        {data.applied.map(job => (
                            <li key={job.id} className={`status-${job.status}`}>
                                <span>{job.title} - {job.company} ({job.status})</span>
                                <div>
                                    <button className="view-details" onClick={() => navigate(`/jobs/${job.id}`)}>View Details</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <p>No applied jobs yet.</p>}
            </div>
            <div className="section">
                <h2>Saved Jobs</h2>
                {data.saved.length > 0 ? (
                    <ul>
                        {data.saved.map(job => (
                            <li key={job.id}>
                                <span>{job.title} - {job.company}</span>
                                <div>
                                    <button className="view-details" onClick={() => navigate(`/jobs/${job.id}`)}>View Details</button>
                                    <button className="remove-btn" onClick={() => handleRemoveSaved(job.id)}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <p>No saved jobs yet.</p>}
            </div>
        </section>
    );
}

export default JobSeekerDashboard;