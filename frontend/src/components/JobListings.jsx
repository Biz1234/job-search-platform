import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/JobListings.css';

function JobListings() {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        salary_range: '',
        job_type: ''
    });
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const queryParams = new URLSearchParams({
            ...filters,
            ...(searchQuery && { q: searchQuery })
        }).toString();
        axios.get(`http://localhost:5000/search?${queryParams}`)
            .then(response => setJobs(response.data))
            .catch(error => console.error('Error fetching jobs:', error));
    }, [filters, searchQuery]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <section className="job-listings">
            <h1>Job Listings {searchQuery ? `for "${searchQuery}"` : ''}</h1>
            <div className="filters">
                <select name="location" onChange={handleFilterChange}>
                    <option value="">All Locations</option>
                    <option value="Remote">Remote</option>
                    <option value="New York">New York</option>
                    <option value="San Francisco">San Francisco</option>
                </select>
                <select name="category" onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                </select>
                <select name="job_type" onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="remote">Remote</option>
                </select>
            </div>
            <div className="jobs-grid">
                {jobs.map(job => (
                    <div key={job.id} className="job-card">
                        <h3>{job.title}</h3>
                        <p>{job.company} - {job.location}</p>
                        <p>{job.job_type} | {job.salary_range}</p>
                        <button onClick={() => navigate(`/jobs/${job.id}`)}>
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default JobListings;