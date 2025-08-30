from flask import Flask, request, jsonify, render_template, flash, redirect, url_for, session
from flask_cors import CORS
from functools import wraps
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import requests

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.path.dirname(__file__), 'flask_session')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": os.getenv('FRONTEND_URL', 'http://10.10.50.93:3001')}})

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
    os.chmod(app.config['UPLOAD_FOLDER'], 0o775)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    try:
        return mysql.connector.connect(
            host=os.getenv('DB_HOST', '10.10.50.93'),
            port=int(os.getenv('DB_PORT', '3306')),
            user=os.getenv('DB_USER', 'testing'),
            password=os.getenv('DB_PASSWORD', 'testing@9955'),
            database=os.getenv('DB_NAME', 'tej_it_db')
        )
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def initialize_db():
    connection = get_db_connection()
    if not connection:
        print("Failed to connect to database for initialization")
        return
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS blogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            image VARCHAR(255),
            date DATETIME NOT NULL,
            priority INT DEFAULT 0,
            category VARCHAR(50) DEFAULT 'General',
            excerpt TEXT,
            slug VARCHAR(255) UNIQUE,
            is_enabled BOOLEAN DEFAULT TRUE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS testimonials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            company VARCHAR(255),
            content TEXT NOT NULL,
            rating INT DEFAULT 0,
            image VARCHAR(255),
            date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            is_enabled BOOLEAN DEFAULT TRUE
        )
    """)
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
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS teams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            role VARCHAR(100) NOT NULL,
            description VARCHAR(50),
            photo VARCHAR(255)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS about_us (
            id INT AUTO_INCREMENT PRIMARY KEY,
            content TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS site_visits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ip_address VARCHAR(45) NOT NULL,
            country VARCHAR(100),
            visit_time DATETIME NOT NULL,
            session_id VARCHAR(255) NOT NULL,
            page VARCHAR(100) DEFAULT 'home'
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            location VARCHAR(100) NOT NULL,
            type VARCHAR(50) NOT NULL,
            posted_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS job_applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            job_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            resume VARCHAR(255),
            cover_letter TEXT,
            permanent_address TEXT,
            current_location VARCHAR(100),
            highest_education VARCHAR(100),
            skills TEXT,
            applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
        )
    """)
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", ('admin', 'admin123'))
    cursor.execute("SELECT COUNT(*) FROM about_us")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO about_us (content) VALUES (%s)", ('Default about us content.',))
    connection.commit()
    cursor.close()
    connection.close()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
            session['user_id'] = data['user_id']
        except:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    if user and user['password'] == password:
        token = jwt.encode({'user_id': user['id']}, app.secret_key, algorithm='HS256')
        session['user_id'] = user['id']
        session.permanent = True
        return jsonify({'token': token, 'message': 'Login successful'})
    return jsonify({'error': 'Login failed: Invalid credentials'}), 401

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_login'))
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()
        if user and user['password'] == password:
            session['user_id'] = user['id']
            session.permanent = True
            flash('Login successful', 'success')
            return redirect(url_for('admin_dashboard'))
        flash('Invalid credentials', 'danger')
    return render_template('login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('user_id', None)
    flash('Logged out successfully', 'success')
    return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
def admin_dashboard():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_dashboard'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(*) as count FROM blogs")
    blog_count = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM testimonials")
    testimonial_count = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM enquiries")
    enquiry_count = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM teams")
    team_count = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM jobs")
    job_count = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM job_applications")
    application_count = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM site_visits")
    visit_count = cursor.fetchone()['count']
    cursor.execute("SELECT country, COUNT(*) as count FROM site_visits GROUP BY country ORDER BY count DESC LIMIT 5")
    top_countries = cursor.fetchall()
    cursor.execute("SELECT page, COUNT(*) as count FROM site_visits GROUP BY page ORDER BY count DESC LIMIT 5")
    top_pages = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('dashboard.html', blog_count=blog_count, testimonial_count=testimonial_count,
                          enquiry_count=enquiry_count, team_count=team_count, job_count=job_count,
                          application_count=application_count, visit_count=visit_count,
                          top_countries=top_countries, top_pages=top_pages)

@app.route('/admin/blogs')
def admin_blogs():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_blogs'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM blogs ORDER BY date DESC")
    blogs = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('blogs_list.html', blogs=blogs)

@app.route('/admin/blog/new', methods=['GET', 'POST'])
def admin_blog_new():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        priority = request.form.get('priority', 0)
        category = request.form.get('category', 'General')
        excerpt = request.form.get('excerpt', content[:200] if content else '')
        sequence = request.form.get('sequence', 0)
        slug = request.form.get('slug') or title.lower().replace(' ', '-').replace('/', '-') if title else ''
        is_enabled = 'is_enabled' in request.form
        image = request.files.get('image')
        image_path = None
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)
            image_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_blog_new'))
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO blogs (title, content, image, date, priority, category, excerpt, slug, is_enabled, sequence) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                           (title, content, image_path, datetime.now(), priority, category, excerpt, slug, is_enabled, sequence))
            connection.commit()
            flash('Blog created successfully', 'success')
        except Error as e:
            print(f"Error inserting blog: {e}")
            flash('Failed to create blog due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_blogs'))
    default_blog = {'is_enabled': True}
    return render_template('blog_form.html', action='Create', categories=['General', 'ERP', 'BDM', 'Payroll', 'Cloud Services'], blog=default_blog)

@app.route('/admin/blog/edit/<int:id>', methods=['GET', 'POST'])
def admin_blog_edit(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_blogs'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM blogs WHERE id = %s", (id,))
    blog = cursor.fetchone()
    if not blog:
        cursor.close()
        connection.close()
        flash('Blog not found', 'danger')
        return redirect(url_for('admin_blogs'))
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        priority = request.form.get('priority', 0)
        category = request.form.get('category', 'General')
        excerpt = request.form.get('excerpt', content[:200] if content else '')
        sequence = request.form.get('sequence', 0)
        slug = request.form.get('slug') or title.lower().replace(' ', '-').replace('/', '-') if title else ''
        is_enabled = 'is_enabled' in request.form
        image = request.files.get('image')
        image_path = blog['image']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)
            image_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
        try:
            cursor.execute("UPDATE blogs SET title = %s, content = %s, image = %s, priority = %s, category = %s, excerpt = %s, slug = %s, is_enabled = %s, sequence = %s WHERE id = %s",
                           (title, content, image_path, priority, category, excerpt, slug, is_enabled, sequence, id))
            connection.commit()
            flash('Blog updated successfully', 'success')
        except Error as e:
            print(f"Error updating blog: {e}")
            flash('Failed to update blog due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_blogs'))
    cursor.close()
    connection.close()
    return render_template('blog_form.html', blog=blog, action='Edit', categories=['General', 'ERP', 'BDM', 'Payroll', 'Cloud Services'])

@app.route('/admin/blog/delete/<int:id>')
def admin_blog_delete(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_blogs'))
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM blogs WHERE id = %s", (id,))
        connection.commit()
        flash('Blog deleted successfully', 'success')
    except Error as e:
        print(f"Error deleting blog: {e}")
        flash('Failed to delete blog due to database error', 'danger')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('admin_blogs'))

@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    category = request.args.get('category', 'All')
    search = request.args.get('search', '')
    try:
        query = "SELECT * FROM blogs WHERE is_enabled = TRUE"
        params = []
        if category != 'All':
            query += " AND category = %s"
            params.append(category)
        if search:
            query += " AND (title LIKE %s OR content LIKE %s)"
            params.extend([f'%{search}%', f'%{search}%'])
        query += " ORDER BY priority DESC, date DESC"
        cursor.execute(query, params)
        blogs = cursor.fetchall()
    except Error as e:
        print(f"Error fetching blogs: {e}")
        return jsonify({'error': 'Failed to fetch blogs'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify(blogs)

@app.route('/api/blogs/<slug>', methods=['GET'])
def get_blog_by_slug(slug):
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM blogs WHERE slug = %s AND is_enabled = TRUE", (slug,))
        blog = cursor.fetchone()
        if not blog:
            return jsonify({'error': 'Blog not found'}), 404
    except Error as e:
        print(f"Error fetching blog: {e}")
        return jsonify({'error': 'Failed to fetch blog'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify(blog)

@app.route('/admin/toggle_blog', methods=['POST'])
def toggle_blog():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    data = request.get_json()
    id = data.get('id')
    is_enabled = data.get('is_enabled')
    connection = get_db_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    cursor = connection.cursor()
    try:
        cursor.execute("UPDATE blogs SET is_enabled = %s WHERE id = %s", (is_enabled, id))
        connection.commit()
        return jsonify({'success': True})
    except Error as e:
        print(f"Error toggling blog: {e}")
        connection.rollback()
        return jsonify({'success': False, 'message': 'Failed to toggle blog'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/admin/testimonial/new', methods=['GET', 'POST'])
def admin_testimonial_new():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    if request.method == 'POST':
        name = request.form.get('name')
        company = request.form.get('company')
        content = request.form.get('content')
        rating = request.form.get('rating', 0)
        is_enabled = 'is_enabled' in request.form
        image = request.files.get('image')
        image_path = None
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)
            image_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_testimonial_new'))
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO testimonials (name, company, content, rating, image, date, is_enabled) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                           (name, company, content, rating, image_path, datetime.now(), is_enabled))
            connection.commit()
            flash('Testimonial created successfully', 'success')
        except Error as e:
            print(f"Error inserting testimonial: {e}")
            flash('Failed to create testimonial due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_testimonials'))
    default_testimonial = {'is_enabled': True}
    return render_template('testimonial_form.html', action='Create', testimonial=default_testimonial)

@app.route('/api/submit_testimonial', methods=['POST'])
def submit_testimonial():
    name = request.form.get('name')
    company = request.form.get('company')
    content = request.form.get('content')
    rating = request.form.get('rating', 0)
    image = request.files.get('image')
    image_path = None
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)
        image_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
    connection = get_db_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO testimonials (name, company, content, rating, image, date) VALUES (%s, %s, %s, %s, %s, %s)",
                       (name, company, content, rating, image_path, datetime.now()))
        connection.commit()
        return jsonify({'success': True, 'message': 'Testimonial submitted successfully'}), 200
    except Error as e:
        print(f"Error submitting testimonial: {e}")
        connection.rollback()
        return jsonify({'success': False, 'message': 'Failed to submit testimonial'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM testimonials WHERE is_enabled = TRUE ORDER BY date DESC")
        testimonials = cursor.fetchall()
    except Error as e:
        print(f"Error fetching testimonials: {e}")
        return jsonify({'error': 'Failed to fetch testimonials'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify(testimonials)

@app.route('/api/teams', methods=['GET'])
@token_required
def get_teams():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM teams")
        teams = cursor.fetchall()
    except Error as e:
        print(f"Error fetching teams: {e}")
        return jsonify({'error': 'Failed to fetch teams'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify(teams)

@app.route('/api/about_us', methods=['GET'])
@token_required
def get_about_us():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM about_us LIMIT 1")
        about = cursor.fetchone()
    except Error as e:
        print(f"Error fetching about us: {e}")
        return jsonify({'error': 'Failed to fetch about us'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify(about)

@app.route('/admin/testimonials')
def admin_testimonials():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_dashboard'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM testimonials ORDER BY date DESC")
    testimonials = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('admin_testimonials.html', testimonials=testimonials)

@app.route('/admin/testimonial/edit/<int:id>', methods=['GET', 'POST'])
def admin_testimonial_edit(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_testimonials'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM testimonials WHERE id = %s", (id,))
    testimonial = cursor.fetchone()
    if not testimonial:
        cursor.close()
        connection.close()
        flash('Testimonial not found', 'danger')
        return redirect(url_for('admin_testimonials'))
    if request.method == 'POST':
        name = request.form.get('name')
        company = request.form.get('company')
        content = request.form.get('content')
        rating = request.form.get('rating', 0)
        is_enabled = 'is_enabled' in request.form
        image = request.files.get('image')
        image_path = testimonial['image']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)
            image_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
        try:
            cursor.execute("UPDATE testimonials SET name = %s, company = %s, content = %s, rating = %s, image = %s, is_enabled = %s WHERE id = %s",
                           (name, company, content, rating, image_path, is_enabled, id))
            connection.commit()
            flash('Testimonial updated successfully', 'success')
        except Error as e:
            print(f"Error updating testimonial: {e}")
            flash('Failed to update testimonial due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_testimonials'))
    cursor.close()
    connection.close()
    return render_template('testimonial_form.html', testimonial=testimonial, action='Edit')

@app.route('/admin/toggle_testimonial', methods=['POST'])
def toggle_testimonial():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    data = request.get_json()
    id = data.get('id')
    is_enabled = data.get('is_enabled')
    connection = get_db_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    cursor = connection.cursor()
    try:
        cursor.execute("UPDATE testimonials SET is_enabled = %s WHERE id = %s", (is_enabled, id))
        connection.commit()
        return jsonify({'success': True})
    except Error as e:
        print(f"Error toggling testimonial: {e}")
        connection.rollback()
        return jsonify({'success': False, 'message': 'Failed to toggle testimonial'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/admin/testimonial/delete/<int:id>', methods=['POST'])
def admin_testimonial_delete(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_testimonials'))
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM testimonials WHERE id = %s", (id,))
        connection.commit()
        flash('Testimonial deleted successfully', 'success')
    except Error as e:
        print(f"Error deleting testimonial: {e}")
        flash('Failed to delete testimonial due to database error', 'danger')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('admin_testimonials'))

@app.route('/api/enquiries', methods=['OPTIONS', 'POST'])
def add_enquiry():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        return response
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor()
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        message = data.get('message')
        date = datetime.utcnow()
        cursor.execute("INSERT INTO enquiries (name, email, phone, message, date) VALUES (%s, %s, %s, %s, %s)",
                       (name, email, phone, message, date))
        connection.commit()
        return jsonify({'message': 'Enquiry submitted successfully'}), 200
    except Error as e:
        print(f"Error submitting enquiry: {e}")
        connection.rollback()
        return jsonify({'error': 'Failed to submit enquiry'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/admin/enquiries')
def admin_enquiries():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_enquiries'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM enquiries ORDER BY date DESC")
        enquiries = cursor.fetchall()
    except Error as e:
        print(f"Error fetching enquiries: {e}")
        flash('Failed to fetch enquiries', 'danger')
    finally:
        cursor.close()
        connection.close()
    return render_template('enquiries_list.html', enquiries=enquiries)

@app.route('/admin/teams')
def admin_teams():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_teams'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM teams")
        teams = cursor.fetchall()
    except Error as e:
        print(f"Error fetching teams: {e}")
        flash('Failed to fetch teams', 'danger')
    finally:
        cursor.close()
        connection.close()
    return render_template('teams_list.html', teams=teams)

@app.route('/admin/team/new', methods=['GET', 'POST'])
def admin_team_new():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    if request.method == 'POST':
        name = request.form.get('name')
        role = request.form.get('role')
        description = request.form.get('description')
        photo = request.files.get('photo')
        photo_path = None
        if photo and allowed_file(photo.filename):
            try:
                filename = secure_filename(photo.filename)
                photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                photo.save(photo_path)
                photo_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
            except Exception as e:
                print(f"Error saving photo: {e}")
                flash('Failed to upload photo', 'danger')
                return redirect(url_for('admin_team_new'))
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_team_new'))
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO teams (name, role, description, photo) VALUES (%s, %s, %s, %s)",
                           (name, role, description, photo_path))
            connection.commit()
            flash('Team member added successfully', 'success')
        except Error as e:
            print(f"Error adding team member: {e}")
            flash('Failed to add team member due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_teams'))
    return render_template('team_form.html', action='Add')

@app.route('/admin/team/edit/<int:id>', methods=['GET', 'POST'])
def admin_team_edit(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_teams'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM teams WHERE id = %s", (id,))
        team = cursor.fetchone()
        if not team:
            flash('Team member not found', 'danger')
            return redirect(url_for('admin_teams'))
    except Error as e:
        print(f"Error fetching team member: {e}")
        flash('Failed to fetch team member', 'danger')
        cursor.close()
        connection.close()
        return redirect(url_for('admin_teams'))
    if request.method == 'POST':
        name = request.form.get('name')
        role = request.form.get('role')
        description = request.form.get('description')
        photo = request.files.get('photo')
        photo_path = team['photo']
        if photo and allowed_file(photo.filename):
            try:
                filename = secure_filename(photo.filename)
                photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                photo.save(photo_path)
                photo_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
            except Exception as e:
                print(f"Error saving photo: {e}")
                flash('Failed to upload photo', 'danger')
                return redirect(url_for('admin_team_edit', id=id))
        try:
            cursor.execute("UPDATE teams SET name = %s, role = %s, description = %s, photo = %s WHERE id = %s",
                           (name, role, description, photo_path, id))
            connection.commit()
            flash('Team member updated successfully', 'success')
        except Error as e:
            print(f"Error updating team member: {e}")
            flash('Failed to update team member due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_teams'))
    cursor.close()
    connection.close()
    return render_template('team_form.html', team=team, action='Edit')

@app.route('/admin/team/delete/<int:id>')
def admin_team_delete(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_teams'))
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM teams WHERE id = %s", (id,))
        connection.commit()
        flash('Team member deleted successfully', 'success')
    except Error as e:
        print(f"Error deleting team member: {e}")
        flash('Failed to delete team member due to database error', 'danger')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('admin_teams'))

@app.route('/admin/about_us', methods=['GET', 'POST'])
def admin_about_us():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_about_us'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM about_us LIMIT 1")
        about = cursor.fetchone()
    except Error as e:
        print(f"Error fetching about us: {e}")
        flash('Failed to fetch about us content', 'danger')
        cursor.close()
        connection.close()
        return redirect(url_for('admin_about_us'))
    if request.method == 'POST':
        content = request.form.get('content')
        try:
            cursor.execute("UPDATE about_us SET content = %s WHERE id = %s", (content, about['id']))
            connection.commit()
            flash('About Us updated successfully', 'success')
        except Error as e:
            print(f"Error updating about us: {e}")
            flash('Failed to update about us content', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_about_us'))
    cursor.close()
    connection.close()
    return render_template('about_form.html', about=about)

@app.route('/track_visit')
def track_visit():
    ip_address = request.remote_addr
    page = request.args.get('page', 'home')
    session_id = session.get('visit_session_id')
    if not session_id:
        session_id = os.urandom(16).hex()
        session['visit_session_id'] = session_id
        try:
            response = requests.get(f"https://ipapi.co/{ip_address}/json/")
            print(f"ipapi.co response for {ip_address}: {response.status_code}, {response.text}")
            if response.status_code == 200:
                data = response.json()
                country = data.get('country_name', 'Unknown')
            else:
                country = 'Unknown'
        except Exception as e:
            print(f"Error fetching geolocation for {ip_address}: {e}")
            country = 'Unknown'
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            try:
                cursor.execute("INSERT INTO site_visits (ip_address, country, visit_time, session_id, page) VALUES (%s, %s, %s, %s, %s)",
                               (ip_address, country, datetime.now(), session_id, page))
                connection.commit()
            except Error as e:
                print(f"Error inserting visit: {e}")
            finally:
                cursor.close()
                connection.close()
        else:
            print("Failed to connect to database for tracking visit")
    return '', 204

@app.route('/api/job-openings', methods=['GET'])
def get_job_openings():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM jobs ORDER BY posted_date DESC")
        jobs = cursor.fetchall()
        print(f"API /job-openings fetched jobs: {jobs}")  # Debug
    except Error as e:
        print(f"Error fetching jobs: {e}")
        return jsonify({'error': 'Failed to fetch jobs'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify(jobs)

@app.route('/admin/jobs')
def admin_jobs():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        print("Redirecting to login: user_id not in session")  # Debug
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        print("Database connection failed")  # Debug
        return redirect(url_for('admin_jobs'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM jobs ORDER BY posted_date DESC")
        jobs = cursor.fetchall()
        print(f"Fetched jobs for admin: {jobs}")  # Debug
    except Error as e:
        print(f"Error fetching jobs: {e}")
        flash('Failed to fetch jobs', 'danger')
        jobs = []
    finally:
        cursor.close()
        connection.close()
    return render_template('jobs_list.html', jobs=jobs)

@app.route('/admin/job/new', methods=['GET', 'POST'])
def admin_job_new():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        location = request.form.get('location')
        type = request.form.get('type')
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_job_new'))
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO jobs (title, description, location, type, posted_date) VALUES (%s, %s, %s, %s, %s)",
                           (title, description, location, type, datetime.now()))
            connection.commit()
            flash('Job opening created successfully', 'success')
        except Error as e:
            print(f"Error inserting job: {e}")
            flash('Failed to create job due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_jobs'))
    return render_template('job_form.html', action='Create', job={'title': '', 'description': '', 'location': '', 'type': ''})

@app.route('/admin/job/edit/<int:id>', methods=['GET', 'POST'])
def admin_job_edit(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_jobs'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jobs WHERE id = %s", (id,))
    job = cursor.fetchone()
    if not job:
        cursor.close()
        connection.close()
        flash('Job opening not found', 'danger')
        return redirect(url_for('admin_jobs'))
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        location = request.form.get('location')
        type = request.form.get('type')
        try:
            cursor.execute("UPDATE jobs SET title = %s, description = %s, location = %s, type = %s WHERE id = %s",
                           (title, description, location, type, id))
            connection.commit()
            flash('Job opening updated successfully', 'success')
        except Error as e:
            print(f"Error updating job: {e}")
            flash('Failed to update job due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_jobs'))
    cursor.close()
    connection.close()
    return render_template('job_form.html', job=job, action='Edit')

@app.route('/admin/job/delete/<int:id>')
def admin_job_delete(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_jobs'))
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM jobs WHERE id = %s", (id,))
        connection.commit()
        flash('Job opening deleted successfully', 'success')
    except Error as e:
        print(f"Error deleting job: {e}")
        flash('Failed to delete job due to database error', 'danger')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('admin_jobs'))

@app.route('/api/submit-application', methods=['POST'])
def submit_application():
    job_id = request.form.get('job_id')
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    permanent_address = request.form.get('permanent_address')
    current_location = request.form.get('current_location')
    highest_education = request.form.get('highest_education')
    skills = request.form.get('skills')
    cover_letter = request.form.get('cover_letter')
    resume = request.files.get('resume')
    resume_path = None
    if resume and allowed_file(resume.filename):
        filename = secure_filename(resume.filename)
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        resume.save(resume_path)
        resume_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
    connection = get_db_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    cursor = connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO job_applications (
                job_id, name, email, phone, permanent_address, current_location, 
                highest_education, skills, cover_letter, resume, applied_date
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (job_id, name, email, phone, permanent_address, current_location, 
              highest_education, skills, cover_letter, resume_path, datetime.now()))
        connection.commit()
        return jsonify({'success': True, 'message': 'Application submitted successfully'}), 200
    except Error as e:
        print(f"Error submitting application: {e}")
        connection.rollback()
        return jsonify({'success': False, 'message': 'Failed to submit application'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/admin/applications')
def admin_applications():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        print("Redirecting to login: user_id not in session")  # Debug
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        print("Database connection failed")  # Debug
        return redirect(url_for('admin_applications'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT ja.*, j.title AS job_title
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            ORDER BY ja.applied_date DESC
        """)
        applications = cursor.fetchall()
        print(f"Fetched applications: {applications}")  # Debug
    except Error as e:
        print(f"Error fetching applications: {e}")
        flash('Failed to fetch applications', 'danger')
        applications = []
    finally:
        cursor.close()
        connection.close()
    return render_template('applications_list.html', applications=applications)

@app.route('/admin/application/new', methods=['GET', 'POST'])
def admin_application_new():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_application_new'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT id, title FROM jobs ORDER BY title")
    jobs = cursor.fetchall()
    if request.method == 'POST':
        job_id = request.form.get('job_id')
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        permanent_address = request.form.get('permanent_address')
        current_location = request.form.get('current_location')
        highest_education = request.form.get('highest_education')
        skills = request.form.get('skills')
        cover_letter = request.form.get('cover_letter')
        resume = request.files.get('resume')
        resume_path = None
        if resume and allowed_file(resume.filename):
            filename = secure_filename(resume.filename)
            resume_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            resume.save(resume_path)
            resume_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
        try:
            cursor.execute("""
                INSERT INTO job_applications (
                    job_id, name, email, phone, permanent_address, current_location, 
                    highest_education, skills, cover_letter, resume, applied_date
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (job_id, name, email, phone, permanent_address, current_location, 
                  highest_education, skills, cover_letter, resume_path, datetime.now()))
            connection.commit()
            flash('Application created successfully', 'success')
        except Error as e:
            print(f"Error inserting application: {e}")
            flash('Failed to create application due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_applications'))
    cursor.close()
    connection.close()
    return render_template('application_form.html', action='Create', 
                         application={'job_id': '', 'name': '', 'email': '', 'phone': '', 
                                      'permanent_address': '', 'current_location': '', 
                                      'highest_education': '', 'skills': '', 'cover_letter': ''}, 
                         jobs=jobs)

@app.route('/admin/application/delete/<int:id>')
def admin_application_delete(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_applications'))
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM job_applications WHERE id = %s", (id,))
        connection.commit()
        flash('Application deleted successfully', 'success')
    except Error as e:
        print(f"Error deleting application: {e}")
        flash('Failed to delete application due to database error', 'danger')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('admin_applications'))

if __name__ == '__main__':
    initialize_db()
    app.run(host='0.0.0.0', port=5000, debug=True)