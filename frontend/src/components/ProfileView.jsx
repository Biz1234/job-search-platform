import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfileView.css';

function ProfileView() {
    const { user_id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/profile/${user_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setProfile(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                setLoading(false);
            });
    }, [user_id, token]);

    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>Profile not found or not available.</p>;

    return (
        <section className="profile-view">
            <h1>{profile.full_name}'s Profile</h1>
            <div className="profile-info">
                <p><strong>Skills:</strong> {profile.skills}</p>
                <p><strong>Experience:</strong> {profile.experience}</p>
                <p><strong>Contact Info:</strong> {profile.contact_info}</p>
                {profile.resume_path && (
                    <p><strong>Resume:</strong> <a href={`http://localhost:5000${profile.resume_path}`} target="_blank" rel="noopener noreferrer">Download Resume</a></p>
                )}
            </div>
            <button onClick={() => navigate(-1)}>Back</button>
        </section>
    );
}

export default ProfileView;