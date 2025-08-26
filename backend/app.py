from flask import Flask, request, jsonify, render_template, flash, redirect, url_for, session
from flask_cors import CORS
from functools import wraps
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
load_dotenv()
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
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads folder if it doesn't exist
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
            slug VARCHAR(255) UNIQUE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS testimonials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            content TEXT NOT NULL,
            rating INT,
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
    cursor.execute("SELECT COUNT(*) as count FROM site_visits")
    visit_count = cursor.fetchone()['count']
    cursor.execute("SELECT country, COUNT(*) as count FROM site_visits GROUP BY country ORDER BY count DESC LIMIT 5")
    top_countries = cursor.fetchall()
    cursor.execute("SELECT page, COUNT(*) as count FROM site_visits GROUP BY page ORDER BY count DESC LIMIT 5")
    top_pages = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('dashboard.html', blog_count=blog_count, testimonial_count=testimonial_count,
                          enquiry_count=enquiry_count, team_count=team_count,
                          visit_count=visit_count, top_countries=top_countries, top_pages=top_pages)

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
        slug = request.form.get('slug', title.lower().replace(' ', '-').replace('/', '-') if title else '')
        image = request.files.get('image')
        image_path = None
        if image and allowed_file(image.filename):
            try:
                filename = secure_filename(image.filename)
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                image.save(image_path)
                image_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
            except Exception as e:
                print(f"Error saving image: {e}")
                flash('Failed to upload image', 'danger')
                return redirect(url_for('admin_blog_new'))
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_blog_new'))
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO blogs (title, content, image, date, priority, category, excerpt, slug) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                           (title, content, image_path, datetime.now(), priority, category, excerpt, slug))
            connection.commit()
            flash('Blog created successfully', 'success')
        except Error as e:
            print(f"Error inserting blog: {e}")
            flash('Failed to create blog due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_blogs'))
    return render_template('blog_form.html', action='Create', categories=['General', 'ERP', 'BDM', 'Payroll', 'Cloud Services'])

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
        slug = request.form.get('slug', title.lower().replace(' ', '-').replace('/', '-') if title else '')
        image = request.files.get('image')
        image_path = blog['image']
        if image and allowed_file(image.filename):
            try:
                filename = secure_filename(image.filename)
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                image.save(image_path)
                image_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
            except Exception as e:
                print(f"Error saving image: {e}")
                flash('Failed to upload image', 'danger')
                return redirect(url_for('admin_blog_edit', id=id))
        try:
            cursor.execute("UPDATE blogs SET title = %s, content = %s, image = %s, priority = %s, category = %s, excerpt = %s, slug = %s WHERE id = %s",
                           (title, content, image_path, priority, category, excerpt, slug, id))
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
        query = "SELECT * FROM blogs WHERE 1=1"
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
        cursor.execute("SELECT * FROM blogs WHERE slug = %s", (slug,))
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

@app.route('/api/testimonials', methods=['GET'])
@token_required
def get_testimonials():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM testimonials WHERE is_enabled = TRUE")
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
        return redirect(url_for('admin_testimonials'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM testimonials")
        testimonials = cursor.fetchall()
    except Error as e:
        print(f"Error fetching testimonials: {e}")
        flash('Failed to fetch testimonials', 'danger')
    finally:
        cursor.close()
        connection.close()
    return render_template('testimonials_list.html', testimonials=testimonials)

@app.route('/admin/testimonial/new', methods=['GET', 'POST'])
def admin_testimonial_new():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    if request.method == 'POST':
        name = request.form.get('name')
        content = request.form.get('content')
        rating = request.form.get('rating')
        is_enabled = 'is_enabled' in request.form
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_testimonial_new'))
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO testimonials (name, content, rating, is_enabled) VALUES (%s, %s, %s, %s)",
                           (name, content, rating, is_enabled))
            connection.commit()
            flash('Testimonial created successfully', 'success')
        except Error as e:
            print(f"Error creating testimonial: {e}")
            flash('Failed to create testimonial due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_testimonials'))
    return render_template('testimonial_form.html', action='Create')

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
    try:
        cursor.execute("SELECT * FROM testimonials WHERE id = %s", (id,))
        testimonial = cursor.fetchone()
        if not testimonial:
            flash('Testimonial not found', 'danger')
            return redirect(url_for('admin_testimonials'))
    except Error as e:
        print(f"Error fetching testimonial: {e}")
        flash('Failed to fetch testimonial', 'danger')
        cursor.close()
        connection.close()
        return redirect(url_for('admin_testimonials'))
    if request.method == 'POST':
        name = request.form.get('name')
        content = request.form.get('content')
        rating = request.form.get('rating')
        is_enabled = 'is_enabled' in request.form
        try:
            cursor.execute("UPDATE testimonials SET name = %s, content = %s, rating = %s, is_enabled = %s WHERE id = %s",
                           (name, content, rating, is_enabled, id))
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

@app.route('/admin/testimonial/delete/<int:id>')
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

@app.route('/api/enquiry', methods=['POST'])
def api_enquiry():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    message = data.get('message')
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO enquiries (name, email, phone, message, date) VALUES (%s, %s, %s, %s, %s)",
                       (name, email, phone, message, datetime.now()))
        connection.commit()
        flash('Enquiry submitted successfully', 'success')
    except Error as e:
        print(f"Error submitting enquiry: {e}")
        return jsonify({'error': 'Failed to submit enquiry'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify({'message': 'Enquiry submitted successfully'})

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

if __name__ == '__main__':
    # initialize_db()  # Commented to prevent table recreation
    app.run(host='0.0.0.0', port=5000, debug=True)