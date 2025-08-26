# backend/app.py (extended from the provided version)

from flask import Flask, request, jsonify, session, render_template, redirect, url_for, flash
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import jwt
from functools import wraps
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            os.getenv("FRONTEND_URL", "http://10.10.50.93:3001"),
            "http://10.10.50.93:3001"
        ],
        "supports_credentials": True  # Enable credentials (cookies/sessions)
    }
})

# Load env
load_dotenv()

# Secret key
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', '2b8dd5a508de9870b120238f6588a138')

# Session configuration
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)  # Session lasts 24 hours
from flask_session import Session
Session(app)

# Upload folder for images
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed extensions for uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# DB Connection
def get_db_connection():
    try:
        return mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            port=int(os.getenv('DB_PORT', 3306)),  # Add port, default to 3306
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Admin required decorator (session-based)
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated

# Initialize database (run once, then comment out)
def initialize_db():
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        
        # Users table (existing)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        """)
        cursor.execute("INSERT IGNORE INTO users (username, password) VALUES (%s, %s)",
                       ('admin', 'admin123'))  # Plain text password
        
        # Blogs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS blogs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image VARCHAR(255),
                date DATETIME NOT NULL,
                priority INT DEFAULT 0
            )
        """)
        
        # Testimonials table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS testimonials (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                rating INT,
                is_enabled BOOLEAN DEFAULT TRUE
            )
        """)
        
        # Enquiries table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS enquiries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                message TEXT NOT NULL,
                date DATETIME NOT NULL
            )
        """)
        
        # Teams table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teams (
                id INT AUTO_INCREMENT PRIMARY KEY,
                photo VARCHAR(255),
                name VARCHAR(100) NOT NULL,
                role VARCHAR(100) NOT NULL,
                description VARCHAR(50)
            )
        """)
        
        # About Us table (single entry assumed, but allows multiple for flexibility)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS about_us (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content TEXT NOT NULL
            )
        """)
        # Insert a default about us if none exists
        cursor.execute("INSERT IGNORE INTO about_us (id, content) VALUES (1, 'Default about us content.')")

        connection.commit()
        cursor.close()
        connection.close()
    else:
        print("Database connection failed during initialization.")

# Admin Login
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'error')
            return render_template('login.html')

        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            session['user_id'] = user['id']
            session.permanent = True
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid credentials', 'error')
            return render_template('login.html')
    return render_template('login.html')

# Admin Logout
@app.route('/admin/logout')
def admin_logout():
    session.pop('user_id', None)
    return redirect(url_for('admin_login'))

# Admin Dashboard
@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    return render_template('dashboard.html')

# Blogs List
@app.route('/admin/blogs')
@admin_required
def admin_blogs():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM blogs ORDER BY priority ASC, date DESC")
    blogs = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('blogs_list.html', blogs=blogs)

# Create Blog
@app.route('/admin/blogs/new', methods=['GET', 'POST'])
@admin_required
def admin_blog_new():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        priority = int(request.form['priority']) if request.form['priority'] else 0
        date = datetime.now()
        image = None

        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image = 'uploads/' + filename

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO blogs (title, content, image, date, priority)
            VALUES (%s, %s, %s, %s, %s)
        """, (title, content, image, date, priority))
        connection.commit()
        cursor.close()
        connection.close()
        flash('Blog created successfully', 'success')
        return redirect(url_for('admin_blogs'))
    return render_template('blog_form.html', action='Create')

# Edit Blog
@app.route('/admin/blogs/<int:id>/edit', methods=['GET', 'POST'])
@admin_required
def admin_blog_edit(id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM blogs WHERE id = %s", (id,))
    blog = cursor.fetchone()

    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        priority = int(request.form['priority']) if request.form['priority'] else 0
        image = blog['image']

        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image = 'uploads/' + filename

        cursor.execute("""
            UPDATE blogs SET title = %s, content = %s, image = %s, priority = %s WHERE id = %s
        """, (title, content, image, priority, id))
        connection.commit()
        flash('Blog updated successfully', 'success')
        return redirect(url_for('admin_blogs'))

    cursor.close()
    connection.close()
    return render_template('blog_form.html', action='Edit', blog=blog)

# Delete Blog
@app.route('/admin/blogs/<int:id>/delete')
@admin_required
def admin_blog_delete(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM blogs WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    connection.close()
    flash('Blog deleted successfully', 'success')
    return redirect(url_for('admin_blogs'))

# Testimonials List
@app.route('/admin/testimonials')
@admin_required
def admin_testimonials():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM testimonials")
    testimonials = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('testimonials_list.html', testimonials=testimonials)

# Create Testimonial
@app.route('/admin/testimonials/new', methods=['GET', 'POST'])
@admin_required
def admin_testimonial_new():
    if request.method == 'POST':
        name = request.form['name']
        content = request.form['content']
        rating = int(request.form['rating']) if 'rating' in request.form and request.form['rating'] else None
        is_enabled = 'is_enabled' in request.form

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO testimonials (name, content, rating, is_enabled)
            VALUES (%s, %s, %s, %s)
        """, (name, content, rating, is_enabled))
        connection.commit()
        cursor.close()
        connection.close()
        flash('Testimonial created successfully', 'success')
        return redirect(url_for('admin_testimonials'))
    return render_template('testimonial_form.html', action='Create')

# Edit Testimonial
@app.route('/admin/testimonials/<int:id>/edit', methods=['GET', 'POST'])
@admin_required
def admin_testimonial_edit(id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM testimonials WHERE id = %s", (id,))
    testimonial = cursor.fetchone()

    if request.method == 'POST':
        name = request.form['name']
        content = request.form['content']
        rating = int(request.form['rating']) if 'rating' in request.form and request.form['rating'] else None
        is_enabled = 'is_enabled' in request.form

        cursor.execute("""
            UPDATE testimonials SET name = %s, content = %s, rating = %s, is_enabled = %s WHERE id = %s
        """, (name, content, rating, is_enabled, id))
        connection.commit()
        flash('Testimonial updated successfully', 'success')
        return redirect(url_for('admin_testimonials'))

    cursor.close()
    connection.close()
    return render_template('testimonial_form.html', action='Edit', testimonial=testimonial)

# Delete Testimonial
@app.route('/admin/testimonials/<int:id>/delete')
@admin_required
def admin_testimonial_delete(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM testimonials WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    connection.close()
    flash('Testimonial deleted successfully', 'success')
    return redirect(url_for('admin_testimonials'))

# Enquiries List (View Only)
@app.route('/admin/enquiries')
@admin_required
def admin_enquiries():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM enquiries ORDER BY date DESC")
    enquiries = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('enquiries_list.html', enquiries=enquiries)

# Teams List
@app.route('/admin/teams')
@admin_required
def admin_teams():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM teams")
    teams = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('teams_list.html', teams=teams)

# Create Team Member
@app.route('/admin/teams/new', methods=['GET', 'POST'])
@admin_required
def admin_team_new():
    if request.method == 'POST':
        name = request.form['name']
        role = request.form['role']
        description = request.form['description'][:50]
        photo = None

        if 'photo' in request.files:
            file = request.files['photo']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                photo = 'uploads/' + filename

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO teams (photo, name, role, description)
            VALUES (%s, %s, %s, %s)
        """, (photo, name, role, description))
        connection.commit()
        cursor.close()
        connection.close()
        flash('Team member created successfully', 'success')
        return redirect(url_for('admin_teams'))
    return render_template('team_form.html', action='Create')

# Edit Team Member
@app.route('/admin/teams/<int:id>/edit', methods=['GET', 'POST'])
@admin_required
def admin_team_edit(id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM teams WHERE id = %s", (id,))
    team = cursor.fetchone()

    if request.method == 'POST':
        name = request.form['name']
        role = request.form['role']
        description = request.form['description'][:50]
        photo = team['photo']

        if 'photo' in request.files:
            file = request.files['photo']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                photo = 'uploads/' + filename

        cursor.execute("""
            UPDATE teams SET photo = %s, name = %s, role = %s, description = %s WHERE id = %s
        """, (photo, name, role, description, id))
        connection.commit()
        flash('Team member updated successfully', 'success')
        return redirect(url_for('admin_teams'))

    cursor.close()
    connection.close()
    return render_template('team_form.html', action='Edit', team=team)

# Delete Team Member
@app.route('/admin/teams/<int:id>/delete')
@admin_required
def admin_team_delete(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM teams WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    connection.close()
    flash('Team member deleted successfully', 'success')
    return redirect(url_for('admin_teams'))

# About Us (Assuming single entry, id=1)
@app.route('/admin/about_us', methods=['GET', 'POST'])
@admin_required
def admin_about_us():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM about_us LIMIT 1")
    about = cursor.fetchone()
    if not about:
        # Create default if none
        cursor.execute("INSERT INTO about_us (content) VALUES (%s)", ('Default content',))
        connection.commit()
        cursor.execute("SELECT * FROM about_us LIMIT 1")
        about = cursor.fetchone()

    if request.method == 'POST':
        content = request.form['content']
        cursor.execute("UPDATE about_us SET content = %s WHERE id = %s", (content, about['id']))
        connection.commit()
        flash('About Us updated successfully', 'success')
        return redirect(url_for('admin_about_us'))

    cursor.close()
    connection.close()
    return render_template('about_form.html', about=about)

# Existing API routes remain here (omitted for brevity, but keep them as is)

if __name__ == '__main__':
    # Run once, then comment/remove
    initialize_db()
    app.run(host='0.0.0.0', port=5000, debug=True)