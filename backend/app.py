from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3001"}})  # Allow frontend origin

# Load environment variables
load_dotenv()

# Database connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Get all blogs or filtered by category
@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    category = request.args.get('category', 'All')
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        if category == 'All':
            query = "SELECT * FROM blogs WHERE is_enabled = TRUE ORDER BY priority ASC, date DESC"
            cursor.execute(query)
        else:
            query = "SELECT * FROM blogs WHERE category = %s AND is_enabled = TRUE ORDER BY priority ASC, date DESC"
            cursor.execute(query, (category,))
        blogs = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(blogs)
    except Error as e:
        return jsonify({"error": str(e)}), 500

# Get a single blog by slug
@app.route('/api/blogs/<slug>', methods=['GET'])
def get_blog(slug):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM blogs WHERE slug = %s AND is_enabled = TRUE"
        cursor.execute(query, (slug,))
        blog = cursor.fetchone()
        cursor.close()
        connection.close()
        if blog:
            return jsonify(blog)
        return jsonify({"error": "Blog not found"}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500

# Create a new blog
@app.route('/api/blogs', methods=['POST'])
def create_blog():
    data = request.get_json()
    try:
        connection = get_db_connection()
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
        cursor.close()
        connection.close()
        return jsonify({"message": "Blog created successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500

# Update a blog
@app.route('/api/blogs/<slug>', methods=['PUT'])
def update_blog(slug):
    data = request.get_json()
    try:
        connection = get_db_connection()
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
        cursor.close()
        connection.close()
        return jsonify({"message": "Blog updated successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 500

# Delete a blog
@app.route('/api/blogs/<slug>', methods=['DELETE'])
def delete_blog(slug):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "DELETE FROM blogs WHERE slug = %s"
        cursor.execute(query, (slug,))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Blog deleted successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
