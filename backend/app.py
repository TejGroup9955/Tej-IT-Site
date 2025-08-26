from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import jwt
from functools import wraps

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            os.getenv("FRONTEND_URL", "http://localhost:3001"),
            "http://10.10.50.93:3001"
        ],
        "supports_credentials": True  # Enable credentials (cookies/sessions)
    }
})

# Load env
load_dotenv()
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {os.getenv('DB_PASSWORD')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"SECRET_KEY: {os.getenv('SECRET_KEY')}")

# Secret key
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'Xk7p9Lm2Qw4v8Jy6Rt3n1Uz5Hx0cEsAd')

# Session configuration
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)  # Session lasts 24 hours
from flask_session import Session
Session(app)

# DB Connection
def get_db_connection():
    try:
        return mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# JWT token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header and 'user_id' not in session:
            return jsonify({'message': 'Token or session is missing'}), 401

        # Check session first
        if 'user_id' in session:
            return f(*args, **kwargs)

        # Fallback to token if session not present
        try:
            token = auth_header.split(" ")[1]
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            session['user_id'] = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])['user_id']
            return f(*args, **kwargs)
        except Exception:
            return jsonify({'message': 'Invalid or expired token'}), 401

    return decorated

# Initialize database (run once, then comment out)
def initialize_db():
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        """)
        # Insert admin user with plain text password (run once, then comment out)
        cursor.execute("INSERT IGNORE INTO users (username, password) VALUES (%s, %s)", 
                       ('admin', 'admin123'))  # Plain text password
        connection.commit()
        cursor.close()
        connection.close()
    else:
        print("Database connection failed during initialization.")

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500

    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user:
            # Convert password from MySQL (which might be bytes) to string and strip whitespace
            stored_password = user['password'].decode('utf-8') if isinstance(user['password'], bytes) else str(user['password'])
            stored_password = stored_password.strip()
            password = password.strip()

            if stored_password == password:
                session['user_id'] = user['id']
                session.permanent = True
                return jsonify({'message': 'Login successful', 'user_id': user['id']})
        return jsonify({'message': 'Invalid credentials'}), 401
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor: cursor.close()
        connection.close()

# Logout endpoint
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})

# Get all blogs (protected)
@app.route('/api/blogs', methods=['GET'])
@token_required
def get_blogs():
    category = request.args.get('category', 'All')
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500

    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        if category == 'All':
            query = "SELECT * FROM blogs WHERE is_enabled = TRUE ORDER BY priority ASC, date DESC"
            cursor.execute(query)
        else:
            query = "SELECT * FROM blogs WHERE category = %s AND is_enabled = TRUE ORDER BY priority ASC, date DESC"
            cursor.execute(query, (category,))
        blogs = cursor.fetchall()
        return jsonify(blogs)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        connection.close()

# Get a single blog
@app.route('/api/blogs/<slug>', methods=['GET'])
@token_required
def get_blog(slug):
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500

    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM blogs WHERE slug = %s AND is_enabled = TRUE"
        cursor.execute(query, (slug,))
        blog = cursor.fetchone()
        if blog:
            return jsonify(blog)
        return jsonify({"error": "Blog not found"}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        connection.close()
 
# Create a blog
@app.route('/api/blogs', methods=['POST'])
@token_required
def create_blog():
    data = request.get_json()
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500

    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO blogs (title, category, date, excerpt, image, slug, content, priority, is_enabled)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['title'], data['category'], data['date'], data['excerpt'],
            data['image'], data['slug'], data['content'], data.get('priority', 0),
            data.get('is_enabled', True)
        )
        cursor.execute(query, values)
        connection.commit()
        return jsonify({"message": "Blog created successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        connection.close()

# Update blog
@app.route('/api/blogs/<slug>', methods=['PUT'])
@token_required
def update_blog(slug):
    data = request.get_json()
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500

    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        UPDATE blogs
        SET title = %s, category = %s, date = %s, excerpt = %s, image = %s,
            content = %s, priority = %s, is_enabled = %s
        WHERE slug = %s
        """
        values = (
            data['title'], data['category'], data['date'], data['excerpt'],
            data['image'], data['content'], data.get('priority', 0),
            data.get('is_enabled', True), slug
        )
        cursor.execute(query, values)
        connection.commit()
        return jsonify({"message": "Blog updated successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        connection.close()

# Delete blog
@app.route('/api/blogs/<slug>', methods=['DELETE'])
@token_required
def delete_blog(slug):
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'DB connection failed'}), 500

    cursor = None
    try:
        cursor = connection.cursor()
        query = "DELETE FROM blogs WHERE slug = %s"
        cursor.execute(query, (slug,))
        connection.commit()
        return jsonify({"message": "Blog deleted successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        connection.close()

if __name__ == '__main__':
    # Run once, then comment/remove
    initialize_db()
    app.run(host='0.0.0.0', port=5000, debug=True)