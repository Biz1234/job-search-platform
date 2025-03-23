import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

function Hero() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery.length > 1) {
            axios.get(`http://localhost:5000/search?q=${searchQuery}`)
                .then(response => setSuggestions(response.data))
                .catch(error => console.error('Error fetching suggestions:', error));
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/jobs?q=${searchQuery}`);
        }
    };

    const handleSuggestionClick = (jobId) => {
        navigate(`/jobs/${jobId}`);
        setSearchQuery('');
        setSuggestions([]);
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Find Your Dream Job</h1>
                <p>Explore thousands of job opportunities with ease.</p>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                    {suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map(job => (
                                <li
                                    key={job.id}
                                    onClick={() => handleSuggestionClick(job.id)}
                                >
                                    {job.title} - {job.company} ({job.location})
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
            </div>
        </section>
    );
}

export default Hero;