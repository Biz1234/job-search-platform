const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const multer = require('multer');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: './uploads/resumes/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb('Error: Only PDF, DOC, DOCX files are allowed!');
    }
});

// Signup and Login (unchanged)
app.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ error: 'All fields are required' });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
        db.query(query, [email, hashedPassword, role], (err) => {
            if (err) return res.status(400).json({ error: 'Email already exists' });
            res.status(201).json({ message: 'User created successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, role: user.role, user: { id: user.id } }); // Include user id
    });
});

// Search, Jobs, and Featured Jobs (unchanged)
app.get('/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query is required' });
    const query = `
        SELECT * FROM jobs 
        WHERE title LIKE ? OR company LIKE ? OR location LIKE ? OR category LIKE ?
        LIMIT 5
    `;
    const searchTerm = `%${q}%`;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/jobs/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM jobs WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: 'Job not found' });
        res.json(results[0]);
    });
});

// Toggle job status
app.put('/jobs/:id/status', authenticateToken, (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE jobs SET status = ? WHERE id = ? AND user_id = ?';
    db.query(query, [status, id, req.user.id], (err, result) => {
        if (err) return res.status(400).json({ error: 'Error updating status' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Job not found or not owned by you' });
        res.json({ message: 'Job status updated' });
    });
});

app.get('/jobs', (req, res) => {
    const { location, category, salary_range, job_type } = req.query;
    let query = 'SELECT * FROM jobs WHERE status = "active"';
    const params = [];
    if (location) { query += ' AND location = ?'; params.push(location); }
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (salary_range) { query += ' AND salary_range = ?'; params.push(salary_range); }
    if (job_type) { query += ' AND job_type = ?'; params.push(job_type); }
    db.query(query, params, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/featured-jobs', (req, res) => {
    db.query('SELECT * FROM jobs', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Post a job (for employers)
app.post('/jobs', authenticateToken, (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });
    const { title, company, location, category, salary_range, job_type, description, requirements } = req.body;
    const user_id = req.user.id;
    const query = `
        INSERT INTO jobs (title, company, location, category, salary_range, job_type, description, requirements, user_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `;
    db.query(query, [title, company, location, category, salary_range, job_type, description, requirements, user_id], (err, result) => {
        if (err) return res.status(400).json({ error: 'Error posting job' });
        res.status(201).json({ id: result.insertId });
    });
});

// Apply to a job (for job seekers)
app.post('/apply', authenticateToken, (req, res) => {
    if (req.user.role !== 'job_seeker') return res.status(403).json({ error: 'Forbidden' });
    const { job_id } = req.body;
    const query = 'INSERT INTO applications (user_id, job_id) VALUES (?, ?)';
    db.query(query, [req.user.id, job_id], (err) => {
        if (err) return res.status(400).json({ error: 'Already applied or invalid job' });
        res.status(201).json({ message: 'Application submitted' });
    });
});

// Save a job (for job seekers)
app.post('/save-job', authenticateToken, (req, res) => {
    if (req.user.role !== 'job_seeker') return res.status(403).json({ error: 'Forbidden' });
    const { job_id } = req.body;
    const query = 'INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)';
    db.query(query, [req.user.id, job_id], (err) => {
        if (err) return res.status(400).json({ error: 'Already saved or invalid job' });
        res.status(201).json({ message: 'Job saved' });
    });
});

// Remove a saved job
app.delete('/save-job/:job_id', authenticateToken, (req, res) => {
    if (req.user.role !== 'job_seeker') return res.status(403).json({ error: 'Forbidden' });
    const { job_id } = req.params;
    const query = 'DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?';
    db.query(query, [req.user.id, job_id], (err, result) => {
        if (err) return res.status(400).json({ error: 'Error removing saved job' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Job not found in saved list' });
        res.json({ message: 'Job removed from saved list' });
    });
});

// Delete a job
app.delete('/jobs/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const query = 'DELETE FROM jobs WHERE id = ? AND user_id = ?';
    db.query(query, [id, req.user.id], (err, result) => {
        if (err) return res.status(400).json({ error: 'Error deleting job' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Job not found or not owned by you' });
        res.json({ message: 'Job deleted successfully' });
    });
});

// Edit a job
app.put('/jobs/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const { title, company, location, category, salary_range, job_type, description, requirements } = req.body;
    const query = `
        UPDATE jobs 
        SET title = ?, company = ?, location = ?, category = ?, salary_range = ?, job_type = ?, description = ?, requirements = ?
        WHERE id = ? AND user_id = ?
    `;
    db.query(query, [title, company, location, category, salary_range, job_type, description, requirements, id, req.user.id], (err, result) => {
        if (err) return res.status(400).json({ error: 'Error updating job' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Job not found or not owned by you' });
        res.json({ message: 'Job updated successfully' });
    });
});

// Update application status
app.put('/applications/:id/status', authenticateToken, (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const { status } = req.body;
    const query = `
        UPDATE applications a
        JOIN jobs j ON a.job_id = j.id
        SET a.status = ?
        WHERE a.id = ? AND j.user_id = ?
    `;
    db.query(query, [status, id, req.user.id], (err, result) => {
        if (err) return res.status(400).json({ error: 'Error updating application status' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Application not found or not linked to your job' });
        res.json({ message: 'Application status updated' });
    });
});

// Get job seeker's dashboard data
app.get('/dashboard/job-seeker', authenticateToken, (req, res) => {
    if (req.user.role !== 'job_seeker') return res.status(403).json({ error: 'Forbidden' });
    const appliedQuery = `
        SELECT j.*, a.status 
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        WHERE a.user_id = ?
    `;
    const savedQuery = 'SELECT j.* FROM saved_jobs s JOIN jobs j ON s.job_id = j.id WHERE s.user_id = ?';
    
    db.query(appliedQuery, [req.user.id], (err, applied) => {
        if (err) return res.status(500).json({ error: 'Database error fetching applied jobs', details: err.message });
        db.query(savedQuery, [req.user.id], (err, saved) => {
            if (err) return res.status(500).json({ error: 'Database error fetching saved jobs', details: err.message });
            res.json({ applied, saved });
        });
    });
});

// Get employer's dashboard data
app.get('/dashboard/employer', authenticateToken, (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });
    const postedQuery = 'SELECT * FROM jobs WHERE user_id = ?';
    const applicationsQuery = `
        SELECT a.id, a.job_id, a.status, j.title, u.email AS applicant, a.user_id AS applicant_id
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        JOIN users u ON a.user_id = u.id 
        WHERE j.user_id = ?
    `;
    
    db.query(postedQuery, [req.user.id], (err, posted) => {
        if (err) return res.status(500).json({ error: 'Database error fetching posted jobs', details: err.message });
        db.query(applicationsQuery, [req.user.id], (err, applications) => {
            if (err) return res.status(500).json({ error: 'Database error fetching applications', details: err.message });
            res.json({ posted, applications });
        });
    });
});

// Create/Update Profile with Resume Upload
app.post('/profile', authenticateToken, upload.single('resume'), (req, res) => {
    if (req.user.role !== 'job_seeker') return res.status(403).json({ error: 'Forbidden' });
    const { full_name, skills, experience, contact_info } = req.body;
    const user_id = req.user.id;
    const resume_path = req.file ? `/uploads/resumes/${req.file.filename}` : null;

    const query = `
        INSERT INTO profiles (user_id, full_name, skills, experience, contact_info, resume_path)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        skills = VALUES(skills),
        experience = VALUES(experience),
        contact_info = VALUES(contact_info),
        resume_path = COALESCE(VALUES(resume_path), resume_path)
    `;
    db.query(query, [user_id, full_name, skills, experience, contact_info, resume_path], (err, result) => {
        if (err) return res.status(400).json({ error: 'Error saving profile', details: err.message });
        res.json({ message: 'Profile saved successfully' });
    });
});

/* Get Profile (including resume path)
app.get('/profile/:user_id', authenticateToken, (req, res) => {
    const { user_id } = req.params;
    const query = 'SELECT * FROM profiles WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Profile not found' });
        res.json(results[0]);
    });
});
*/
app.get('/', (req, res) => {
    res.send('Job Search Platform Backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});