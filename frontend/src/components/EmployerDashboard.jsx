import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

function EmployerDashboard() {
    const [data, setData] = useState({ posted: [], applications: [] });
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchData = () => {
        axios.get('http://localhost:5000/dashboard/employer', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching dashboard:', error));
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleDeleteJob = (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            axios.delete(`http://localhost:5000/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    alert('Job deleted successfully!');
                    setData(prev => ({
                        ...prev,
                        posted: prev.posted.filter(job => job.id !== jobId),
                        applications: prev.applications.filter(app => app.job_id !== jobId)
                    }));
                })
                .catch(error => alert(error.response?.data?.error || 'Error deleting job'));
        }
    };

    const handleToggleStatus = (jobId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        axios.put(`http://localhost:5000/jobs/${jobId}/status`, { status: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert(`Job ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
                setData(prev => ({
                    ...prev,
                    posted: prev.posted.map(job => 
                        job.id === jobId ? { ...job, status: newStatus } : job
                    )
                }));
            })
            .catch(error => alert(error.response?.data?.error || 'Error toggling status'));
    };

    const handleApplicationStatus = (appId, newStatus) => {
        axios.put(`http://localhost:5000/applications/${appId}/status`, { status: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert(`Application ${newStatus}!`);
                setData(prev => ({
                    ...prev,
                    applications: prev.applications.map(app => 
                        app.id === appId ? { ...app, status: newStatus } : app
                    )
                }));
            })
            .catch(error => alert(error.response?.data?.error || 'Error updating application status'));
    };

    return (
        <section className="dashboard">
            <h1>Employer Dashboard</h1>
            <button className="post-job-btn" onClick={() => navigate('/post-job')}>
                Post a Job
            </button>
            <div className="section">
    <h2>Posted Jobs</h2>
    {data.posted.length > 0 ? (
        <ul>
            {data.posted.map(job => (
                <li key={job.id}>
                    <span>{job.title} ({job.status})</span>
                    <div>
                        <button className="view-details" onClick={() => navigate(`/jobs/${job.id}`)}>View Details</button>
                        <button className="delete-btn"  onClick={() => handleDeleteJob(job.id)}>Delete</button>
                        <button 
                            className={job.status === 'active' ? 'deactivate-btn' : 'activate-btn'}
                            onClick={() => handleToggleStatus(job.id, job.status)}
                        >
                            {job.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    ) : <p>No jobs posted yet.</p>}
</div>
<div className="section">
    <h2>Applications Received</h2>
    {data.applications.length > 0 ? (
        <ul>
            {data.applications.map(app => (
                <li key={app.id}>
                    <span>{app.title} - Applicant: <a href={`/profile/${app.applicant_id}`}>{app.applicant}</a> ({app.status})</span>
                    <div>
                        <button className="view-details" onClick={() => navigate(`/jobs/${app.job_id}`)}>View Job</button>
                        {app.status === 'pending' && (
                            <>
                                <button className="accept-btn" onClick={() => handleApplicationStatus(app.id, 'accepted')}>Accept</button>
                                <button className="reject-btn" onClick={() => handleApplicationStatus(app.id, 'rejected')}>Reject</button>
                            </>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    ) : <p>No applications yet.</p>}
</div>
        </section>
    );
}

export default EmployerDashboard;