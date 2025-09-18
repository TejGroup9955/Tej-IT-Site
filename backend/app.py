from flask import Flask, request, jsonify, render_template, flash, redirect, url_for, session
from flask_cors import CORS
from functools import wraps
import mysql.connector
from knowledge_base import knowledge_base
from mysql.connector import Error
from datetime import datetime, timedelta
import jwt
import os
import re
import uuid
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import requests
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', '2b8dd5a508de9870b120238f6588a138')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.path.dirname(__file__), 'flask_session')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": os.getenv('FRONTEND_URL', 'http://10.10.50.93:3001')}})

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}

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

def retrieve_relevant_context(query):
    words = re.split(r'\s+', query.lower().strip())
    scores = {}
    for page, text in knowledge_base.items():
        count = 0
        lower_text = text.lower()
        for word in words:
            if word in lower_text:
                count += 1
        if count > 0:
            scores[page] = count
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
    context = ''
    for page, _ in sorted_scores:
        context += f"From {page}:\n{knowledge_base[page]}\n\n"
    return context if context else "No relevant information found in the knowledge base."

def call_openrouter(prompt, user_name=None):
    url = 'https://openrouter.ai/api/v1/chat/completions'
    headers = {
    'Authorization': f'Bearer {os.getenv("OPENROUTER_API_KEY")}',
    'Content-Type': 'application/json'
    }
    greeting = f"Hello{f', {user_name}' if user_name else ''}! Welcome to Tej IT Solutions."
    closing = "How else may I assist you?"
    full_prompt = f"{greeting}\n{prompt}\n\n{closing}"
    data = {
        'model': 'deepseek/deepseek-chat-v3.1:free',
        'messages': [
            {'role': 'system', 'content': '''
                You are TejITbot, a professional AI assistant for Tej IT Solutions, designed to emulate top-tier MNC chatbots. Follow these guidelines:
                - Deliver concise (50-100 words), accurate, and professional responses.
                - Use bullet points for key information, each starting on a new line.
                - Avoid casual language, buzzwords, or repetition.
                - Focus on relevant details from provided context.
                - For location queries, provide:
                  - Pune Office: Office No. 103, "Phoenix", Bund Garden Rd, Opp. Residency Club, Pune, Maharashtra 411001
                - For contact queries, provide:
                  - Email: info@tejitsolutions.com or support@tejitsolutions.com
                  - Pune Office: As above
                - If query is unclear or unrelated, respond:
                  - I’m sorry, I don’t have information on that. Please clarify or ask about Tej IT Solutions’ services.
                - Ensure polished, structured responses with clear formatting.
                - Limit to 100 words; trim excess content cleanly.
            '''},
            {'role': 'user', 'content': full_prompt}
        ]
    }
    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        answer = response.json()['choices'][0]['message']['content']
        lines = answer.split('\n')
        filtered_lines = [line for line in lines if line.strip() and not line.startswith('Hello') and not line.startswith('How else')]
        answer = '\n'.join(filtered_lines)
        words = answer.split()
        if len(words) > 100:
            answer = ' '.join(words[:100]) + '...'
        answer = re.sub(r'-\s*([^\n]+)', r'- \1\n', answer)
        return answer.strip()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            return (
                "- Please contact our support team for assistance.\n"
                "- Email: info@tejitsolutions.com or support@tejitsolutions.com\n"
                "- Pune Office: Office No. 103, 'Phoenix', Bund Garden Rd, Opp. Residency Club, Pune, Maharashtra 411001"
            )
        elif e.response.status_code == 401:
            return (
                "- Please contact support for assistance.\n"
                "- Email: info@tejitsolutions.com"
            )
        return (
            "- I’m sorry, an API error occurred. Please try again.\n"
            "- Contact: info@tejitsolutions.com"
        )
    except Exception as e:
        return (
            "- I’m sorry, an error occurred. Please try again.\n"
            "- Contact: info@tejitsolutions.com"
        )

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
        CREATE TABLE IF NOT EXISTS departments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            status ENUM('Active', 'Inactive') DEFAULT 'Active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(100),
        user_email VARCHAR(100),
        user_phone VARCHAR(20)
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        user_message TEXT NOT NULL,
        bot_response TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            department_id INT,
            location VARCHAR(100) NOT NULL,
            type VARCHAR(50) NOT NULL,
            posted_by VARCHAR(50) NOT NULL,
            status ENUM('Active', 'Inactive') DEFAULT 'Active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
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
            status ENUM('Pending', 'Reviewed', 'Hired', 'Rejected') DEFAULT 'Pending',
            applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employee_testimonials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            employee_name VARCHAR(255) NOT NULL,
            job_role VARCHAR(255) NOT NULL,
            feedback TEXT NOT NULL,
            rating INT NOT NULL,
            status BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", ('admin', 'admin123'))
    cursor.execute("SELECT COUNT(*) FROM about_us")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO about_us (content) VALUES (%s)", ('Default about us content.',))
    cursor.execute("SELECT COUNT(*) FROM departments")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO departments (name) VALUES
            ('HR'), ('Support'), ('Development'), ('Sales'), ('Marketing'),
            ('DevOps'), ('Cloud'), ('Back Office')
        """)
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
    cursor.execute("SELECT COUNT(*) as count FROM departments")
    department_count = cursor.fetchone()['count']
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
                          application_count=application_count, department_count=department_count,
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

@app.route('/admin/user-details')
def admin_user_details():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_dashboard'))
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT ud.id, ud.session_id, ud.user_name, ud.user_email, ud.user_phone, c.created_at
            FROM user_details ud
            LEFT JOIN chat c ON ud.session_id = c.session_id
            """
        )
        users = cursor.fetchall()
        cursor.close()
        connection.close()
        return render_template('user_details_list.html', users=users)
    except Exception as e:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()
        flash(f"Database error: {str(e)}", 'danger')
        return redirect(url_for('admin_dashboard'))


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
        job_role = request.form.get('job_role')
        content = request.form.get('content')
        uploaded_by = session.get('user_id', 'admin')
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
            cursor.execute("INSERT INTO testimonials (name, job_role, content, image, date, is_enabled, uploaded_by) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                           (name, job_role, content, image_path, datetime.now(), is_enabled, uploaded_by))
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
    job_role = request.form.get('job_role')
    content = request.form.get('content')
    uploaded_by = 'anonymous'
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
        cursor.execute("INSERT INTO testimonials (name, job_role, content, image, date, uploaded_by) VALUES (%s, %s, %s, %s, %s, %s)",
                       (name, job_role, content, image_path, datetime.now(), uploaded_by))
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
        job_role = request.form.get('job_role')
        content = request.form.get('content')
        uploaded_by = session.get('user_id', 'admin')
        is_enabled = 'is_enabled' in request.form
        image = request.files.get('image')
        image_path = testimonial['image']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)
            image_path = f'http://10.10.50.93:5000/static/uploads/{filename}'
        try:
            cursor.execute("UPDATE testimonials SET name = %s, job_role = %s, content = %s, image = %s, is_enabled = %s, uploaded_by = %s WHERE id = %s",
                           (name, job_role, content, image_path, is_enabled, uploaded_by, id))
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

@app.route('/api/departments', methods=['GET'])
def get_departments():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM departments WHERE status = 'Active' ORDER BY name")
        departments = cursor.fetchall()
    except Error as e:
        print(f"Error fetching departments: {e}")
        return jsonify({'error': 'Failed to fetch departments'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify(departments)

@app.route('/api/jobs/<int:id>', methods=['GET'])
def get_job(id):
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT j.*, d.name AS department FROM jobs j LEFT JOIN departments d ON j.department_id = d.id WHERE j.id = %s", (id,))
        job = cursor.fetchone()
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        return jsonify(job)
    except Error as e:
        print(f"Error fetching job: {e}")
        return jsonify({'error': 'Failed to fetch job'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/job-openings', methods=['GET'])
def get_job_openings():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    department = request.args.get('department', 'All')
    location = request.args.get('location', 'All')
    try:
        query = "SELECT j.*, d.name AS department FROM jobs j LEFT JOIN departments d ON j.department_id = d.id WHERE j.status = 'Active'"
        params = []
        if department != 'All':
            query += " AND d.name = %s"
            params.append(department)
        if location != 'All':
            query += " AND j.location = %s"
            params.append(location)
        query += " ORDER BY j.posted_date DESC"
        cursor.execute(query, params)
        jobs = cursor.fetchall()
        print(f"API /job-openings fetched jobs: {jobs}")
    except Error as e:
        print(f"Error fetching jobs: {e}")
        return jsonify({'error': 'Failed to fetch jobs'}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify(jobs)

@app.route('/api/job/add', methods=['POST'])
@token_required
def add_job():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    title = request.form.get('title')
    description = request.form.get('description')
    department_id = request.form.get('department_id')
    location = request.form.get('location')
    type = request.form.get('type')
    posted_by = session.get('user_id', 'admin')
    connection = get_db_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO jobs (title, description, department_id, location, type, posted_by, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                       (title, description, department_id, location, type, posted_by, datetime.now()))
        connection.commit()
        return jsonify({'success': True, 'message': 'Job added successfully'}), 200
    except Error as e:
        print(f"Error inserting job: {e}")
        connection.rollback()
        return jsonify({'success': False, 'message': 'Failed to add job'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/testimonial/add', methods=['POST'])
@token_required
def add_testimonial():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    name = request.form.get('name')
    job_role = request.form.get('job_role')
    content = request.form.get('content')
    uploaded_by = session.get('user_id', 'admin')
    is_enabled = request.form.get('is_enabled', 'false') == 'true'
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
        cursor.execute("INSERT INTO testimonials (name, job_role, content, image, date, is_enabled, uploaded_by) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                       (name, job_role, content, image_path, datetime.now(), is_enabled, uploaded_by))
        connection.commit()
        return jsonify({'success': True, 'message': 'Testimonial added successfully'}), 200
    except Error as e:
        print(f"Error inserting testimonial: {e}")
        connection.rollback()
        return jsonify({'success': False, 'message': 'Failed to add testimonial'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/employee_testimonials', methods=['GET'])
def get_employee_testimonials():
    connection = get_db_connection()
    if not connection:
        print("Database connection failed")
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, employee_name, job_role, feedback, rating, status, created_at FROM employee_testimonials WHERE status = TRUE")
        testimonials = cursor.fetchall()
        print(f"Fetched testimonials: {testimonials}")  # Debug log
        return jsonify(testimonials), 200
    except Error as e:
        print(f"Error fetching employee testimonials: {e}")
        return jsonify({'success': False, 'message': 'Failed to fetch employee testimonials'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/admin/departments')
def admin_departments():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_departments'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM departments ORDER BY name")
        departments = cursor.fetchall()
    except Error as e:
        print(f"Error fetching departments: {e}")
        flash('Failed to fetch departments', 'danger')
        departments = []
    finally:
        cursor.close()
        connection.close()
    return render_template('departments_list.html', departments=departments)

@app.route('/admin/department/new', methods=['GET', 'POST'])
def admin_department_new():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    if request.method == 'POST':
        name = request.form.get('name')
        status = request.form.get('status', 'Active')
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_department_new'))
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO departments (name, status, created_at) VALUES (%s, %s, %s)",
                           (name, status, datetime.now()))
            connection.commit()
            flash('Department added successfully', 'success')
        except Error as e:
            print(f"Error inserting department: {e}")
            flash('Failed to add department due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_departments'))
    return render_template('department_form.html', action='Add', department={'name': '', 'status': 'Active'})

@app.route('/admin/department/edit/<int:id>', methods=['GET', 'POST'])
def admin_department_edit(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_departments'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM departments WHERE id = %s", (id,))
    department = cursor.fetchone()
    if not department:
        cursor.close()
        connection.close()
        flash('Department not found', 'danger')
        return redirect(url_for('admin_departments'))
    if request.method == 'POST':
        name = request.form.get('name')
        status = request.form.get('status')
        try:
            cursor.execute("UPDATE departments SET name = %s, status = %s WHERE id = %s",
                           (name, status, id))
            connection.commit()
            flash('Department updated successfully', 'success')
        except Error as e:
            print(f"Error updating department: {e}")
            flash('Failed to update department due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_departments'))
    cursor.close()
    connection.close()
    return render_template('department_form.html', department=department, action='Edit')

@app.route('/admin/department/delete/<int:id>')
def admin_department_delete(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_departments'))
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM departments WHERE id = %s", (id,))
        connection.commit()
        flash('Department deleted successfully', 'success')
    except Error as e:
        print(f"Error deleting department: {e}")
        flash('Failed to delete department due to database error', 'danger')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('admin_departments'))

@app.route('/admin/jobs')
def admin_jobs():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        print("Redirecting to login: user_id not in session")
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        print("Database connection failed")
        return redirect(url_for('admin_jobs'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM jobs ORDER BY posted_date DESC")
        jobs = cursor.fetchall()
        print(f"Fetched jobs for admin: {jobs}")
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
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_job_new'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT id, name FROM departments WHERE status = 'Active' ORDER BY name")
    departments = cursor.fetchall()
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        department_id = request.form.get('department_id') or None
        location = request.form.get('location')
        type = request.form.get('type')
        status = 'Active' if request.form.get('status') == 'on' else 'Inactive'
        try:
            cursor.execute("INSERT INTO jobs (title, description, department_id, location, type, status, posted_date) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                           (title, description, department_id, location, type, status, datetime.now()))
            connection.commit()
            flash('Job opening created successfully', 'success')
        except Error as e:
            print(f"Error inserting job: {e}")
            flash('Failed to create job due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_jobs'))
    cursor.close()
    connection.close()
    return render_template('job_form.html', action='Create', job={'title': '', 'description': '', 'department_id': '', 'location': '', 'type': '', 'status': 'Active'}, departments=departments)

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
    cursor.execute("SELECT id, name FROM departments WHERE status = 'Active' ORDER BY name")
    departments = cursor.fetchall()
    if not job:
        cursor.close()
        connection.close()
        flash('Job opening not found', 'danger')
        return redirect(url_for('admin_jobs'))
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        department_id = request.form.get('department_id') or None
        location = request.form.get('location')
        type = request.form.get('type')
        status = 'Active' if request.form.get('status') == 'on' else 'Inactive'
        try:
            cursor.execute("UPDATE jobs SET title = %s, description = %s, department_id = %s, location = %s, type = %s, status = %s WHERE id = %s",
                           (title, description, department_id, location, type, status, id))
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
    return render_template('job_form.html', job=job, action='Edit', departments=departments)

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

@app.route('/admin/toggle_job', methods=['POST'])
def toggle_job():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    data = request.get_json()
    id = data.get('id')
    status = data.get('status')
    connection = get_db_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    cursor = connection.cursor()
    try:
        cursor.execute("UPDATE jobs SET status = %s WHERE id = %s", (status, id))
        connection.commit()
        return jsonify({'success': True})
    except Error as e:
        print(f"Error toggling job: {e}")
        connection.rollback()
        return jsonify({'success': False, 'message': 'Failed to toggle job'}), 500
    finally:
        cursor.close()
        connection.close()

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
    if not job_id or not name or not email:
        return jsonify({'success': False, 'message': 'Required fields missing'}), 400
    if resume and not allowed_file(resume.filename):
        return jsonify({'success': False, 'message': 'Invalid file type. Only PDF or DOC/DOCX allowed'}), 400
    resume_path = None
    if resume:
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
                highest_education, skills, cover_letter, resume, applied_date, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (job_id, name, email, phone, permanent_address, current_location,
              highest_education, skills, cover_letter, resume_path, datetime.now(), 'Pending'))
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
        print("Redirecting to login: user_id not in session")
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        print("Database connection failed")
        return redirect(url_for('admin_applications'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT ja.*, j.title AS job_title, d.name AS department
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            LEFT JOIN departments d ON j.department_id = d.id
            ORDER BY ja.applied_date DESC
        """)
        applications = cursor.fetchall()
        print(f"Fetched applications: {applications}")
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
    cursor.execute("SELECT id, title FROM jobs WHERE status = 'Active' ORDER BY title")
    jobs = cursor.fetchall()
    cursor.execute("SELECT id, name FROM departments WHERE status = 'Active' ORDER BY name")
    departments = cursor.fetchall()
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
        status = request.form.get('status', 'Pending')
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
                    highest_education, skills, cover_letter, resume, applied_date, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (job_id, name, email, phone, permanent_address, current_location,
                  highest_education, skills, cover_letter, resume_path, datetime.now(), status))
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
                                      'highest_education': '', 'skills': '', 'cover_letter': '', 'status': 'Pending'},
                         jobs=jobs, departments=departments)

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

@app.route('/admin/application/update_status/<int:id>', methods=['POST'])
def admin_application_update_status(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    status = request.form.get('status')
    if status not in ['Pending', 'Reviewed', 'Hired', 'Rejected']:
        flash('Invalid status', 'danger')
        return redirect(url_for('admin_applications'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_applications'))
    cursor = connection.cursor()
    try:
        cursor.execute("UPDATE job_applications SET status = %s WHERE id = %s", (status, id))
        connection.commit()
        flash('Application status updated successfully', 'success')
    except Error as e:
        print(f"Error updating application status: {e}")
        flash('Failed to update application status', 'danger')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('admin_applications'))

@app.route('/admin/employee_testimonials')
def admin_employee_testimonials():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_dashboard'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM employee_testimonials ORDER BY created_at DESC")
        testimonials = cursor.fetchall()
    except Error as e:
        print(f"Error fetching employee testimonials: {e}")
        flash('Failed to fetch employee testimonials', 'danger')
        testimonials = []
    finally:
        cursor.close()
        connection.close()
    return render_template('employee_testimonials_list.html', testimonials=testimonials)

@app.route('/admin/employee/testimonial/new', methods=['GET', 'POST'])
def admin_employee_testimonial_new():
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    if request.method == 'POST':
        employee_name = request.form.get('employee_name')
        job_role = request.form.get('job_role')
        feedback = request.form.get('feedback')
        rating = request.form.get('rating')
        status = 'status' in request.form  # Checkbox for Active/Inactive
        connection = get_db_connection()
        if not connection:
            flash('Database connection failed', 'danger')
            return redirect(url_for('admin_employee_testimonials'))
        cursor = connection.cursor()
        try:
            cursor.execute(
                "INSERT INTO employee_testimonials (employee_name, job_role, feedback, rating, status, created_at) VALUES (%s, %s, %s, %s, %s, %s)",
                (employee_name, job_role, feedback, rating, status, datetime.now())
            )
            connection.commit()
            flash('Employee testimonial created successfully', 'success')
        except Error as e:
                        flash('Failed to create employee testimonial due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_employee_testimonials'))
    return render_template('employee_testimonial_form.html', action='Create', testimonial={'employee_name': '', 'job_role': '', 'feedback': '', 'rating': 0, 'status': False})

@app.route('/admin/employee/testimonial/edit/<int:id>', methods=['GET', 'POST'])
def admin_employee_testimonial_edit(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_employee_testimonials'))
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM employee_testimonials WHERE id = %s", (id,))
    testimonial = cursor.fetchone()
    if not testimonial:
        cursor.close()
        connection.close()
        flash('Employee testimonial not found', 'danger')
        return redirect(url_for('admin_employee_testimonials'))
    if request.method == 'POST':
        employee_name = request.form.get('employee_name')
        job_role = request.form.get('job_role')
        feedback = request.form.get('feedback')
        rating = request.form.get('rating')
        status = 'status' in request.form
        try:
            cursor.execute(
                "UPDATE employee_testimonials SET employee_name = %s, job_role = %s, feedback = %s, rating = %s, status = %s WHERE id = %s",
                (employee_name, job_role, feedback, rating, status, id)
            )
            connection.commit()
            flash('Employee testimonial updated successfully', 'success')
        except Error as e:
            print(f"Error updating employee testimonial: {e}")
            flash('Failed to update employee testimonial due to database error', 'danger')
        finally:
            cursor.close()
            connection.close()
        return redirect(url_for('admin_employee_testimonials'))
    cursor.close()
    connection.close()
    return render_template('employee_testimonial_form.html', testimonial=testimonial, action='Edit')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '').strip()
    session_id = data.get('session_id', str(uuid.uuid4()))
    user_name = data.get('user_name')
    user_email = data.get('user_email')
    user_phone = data.get('user_phone')

    # 1. ✅ Ensure user details are mandatory before chat starts
    if not user_name or not user_email or not user_phone:
        return jsonify({
            'session_id': session_id,
            'response': "⚠️ Please provide your Name, Email, and Phone Number before starting the chat.",
            'requires_details': True   # 🔑 extra flag for frontend
        })

    # Save user details (only once all are provided)
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO user_details (session_id, user_name, user_email, user_phone)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                user_name = COALESCE(%s, user_name),
                user_email = COALESCE(%s, user_email),
                user_phone = COALESCE(%s, user_phone)
                """,
                (session_id, user_name, user_email, user_phone, user_name, user_email, user_phone)
            )
            connection.commit()
        except Error as e:
            print(f"Error saving user details: {e}")
        finally:
            cursor.close()
            connection.close()

    # 2. ✅ Handle button clicks differently (don’t auto-start chat flow)
    if user_message.lower() in ["i have a question", "explore services", "start chat"]:
        if user_message.lower() == "i have a question":
            bot_response = "👋 What would you like to know? Please type your query."
        elif user_message.lower() == "explore services":
            bot_response = (
                "Here are our key services:\n"
                "- 💼 IT Consulting\n"
                "- ☁️ Cloud Solutions\n"
                "- 🤖 AI & Automation\n"
                "- 🛡️ Cybersecurity\n\n"
                "Please select one to continue."
            )
        else:  # Start chat button
            bot_response = (
                "✅ Thank you for sharing your details!\n"
                "Here’s a quick overview of our offerings:\n"
                "- 💼 IT Consulting\n"
                "- ☁️ Cloud Solutions\n"
                "- 🤖 AI & Automation\n"
                "- 🛡️ Cybersecurity\n\n"
                "Please select one to explore further."
            )
    else:
        # 3. ✅ Normal chat with context (no wrong "user says how can we help you")
        context = retrieve_relevant_context(user_message)
        prompt = f"User query: {user_message}\n\nContext:\n{context}"
        bot_response = call_openrouter(prompt, user_name)

    # Save chat to DB
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute(
                "INSERT INTO chat (session_id, user_message, bot_response, created_at) VALUES (%s, %s, %s, %s)",
                (session_id, user_message, bot_response, datetime.now())
            )
            connection.commit()
        except Error as e:
            print(f"Error saving chat: {e}")
        finally:
            cursor.close()
            connection.close()

    return jsonify({
        'session_id': session_id,
        'response': bot_response,
        'requires_details': False   # 🔑 means user can continue
    })


@app.route('/api/chat_history/<session_id>', methods=['GET'])
def get_chat_history(session_id):
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT user_message, bot_response, created_at FROM chat WHERE session_id = %s ORDER BY created_at",
            (session_id,)
        )
        history = cursor.fetchall()
        return jsonify(history)
    except Error as e:
        print(f"Error fetching chat history: {e}")
        return jsonify({'error': 'Failed to fetch chat history'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/admin/chats')
def admin_chats():
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_dashboard'))
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT DISTINCT c.session_id, u.user_name, u.user_email, u.user_phone,
                           (SELECT user_message FROM chat c2 WHERE c2.session_id = c.session_id ORDER BY created_at DESC LIMIT 1) as last_message
            FROM chat c
            LEFT JOIN user_details u ON c.session_id = u.session_id
            ORDER BY last_message DESC
        """)
        chats = cursor.fetchall()
        return render_template('chats_list.html', chats=chats)
    except Error as e:
        print(f"Error fetching chats: {e}")
        flash('Failed to fetch chat sessions', 'danger')
        return redirect(url_for('admin_dashboard'))
    finally:
        cursor.close()
        connection.close()

@app.route('/admin/employee/testimonial/delete/<int:id>', methods=['POST'])
def admin_employee_testimonial_delete(id):
    if 'user_id' not in session:
        flash('Please login first', 'danger')
        return redirect(url_for('admin_login'))
    connection = get_db_connection()
    if not connection:
        flash('Database connection failed', 'danger')
        return redirect(url_for('admin_employee_testimonials'))
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM employee_testimonials WHERE id = %s", (id,))
        connection.commit()
        flash('Employee testimonial deleted successfully', 'success')
    except Error as e:
        print(f"Error deleting employee testimonial: {e}")
        flash('Failed to delete employee testimonial due to database error', 'danger')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('admin_employee_testimonials'))

if __name__ == '__main__':
    initialize_db()
    app.run(host='0.0.0.0', port=5000, debug=True)