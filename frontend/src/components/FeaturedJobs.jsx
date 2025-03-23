import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FeaturedJobs.css';

function FeaturedJobs() {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/featured-jobs')
            .then(response => setJobs(response.data))
            .catch(error => console.error('Error fetching featured jobs:', error));
    }, []);

    //display featured jobs
    return (
        <section className="featured-jobs">
            <h2>All Jobs</h2>
            <div className="jobs-grid">
                {jobs.map(job => (
                    <div key={job.id} className="job-card">
                        <h3>{job.title}</h3>
                        <p>{job.company} - {job.location}</p>
                        <button onClick={() => navigate(`/jobs/${job.id}`)}>
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeaturedJobs;