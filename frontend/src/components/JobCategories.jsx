import '../styles/JobCategories.css';

function JobCategories() {
    const categories = [
        { name: 'Technology', icon: '💻' },
        { name: 'Marketing', icon: '📈' },
        { name: 'Design', icon: '🎨' },
        { name: 'Finance', icon: '💰' },
    ];

    return (
        <section className="job-categories">
            <h2>Explore Job Categories</h2>
            <div className="categories-grid">
                {categories.map((category, index) => (
                    <div key={index} className="category-card">
                        <span className="category-icon">{category.icon}</span>
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default JobCategories;