#!/usr/bin/env python3
"""
Endpoint Scanner for Tej IT Site
Scans backend Flask routes and frontend API calls to generate endpoints.json
"""

import os
import re
import json
import ast
from pathlib import Path

def scan_flask_routes(backend_dir):
    """Scan Flask app.py for route definitions"""
    routes = []
    app_py_path = os.path.join(backend_dir, 'app.py')
    
    if not os.path.exists(app_py_path):
        print(f"Warning: {app_py_path} not found")
        return routes
    
    with open(app_py_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find Flask route decorators
    route_pattern = r"@app\.route\(['\"]([^'\"]+)['\"](?:,\s*methods\s*=\s*\[([^\]]+)\])?\)"
    matches = re.findall(route_pattern, content)
    
    for match in matches:
        path = match[0]
        methods = match[1] if match[1] else 'GET'
        methods = [m.strip().strip("'\"") for m in methods.split(',')]
        
        routes.append({
            "path": path,
            "methods": methods,
            "type": "flask_route",
            "file": "app.py"
        })
    
    # Also scan for API endpoints pattern
    api_pattern = r"@app\.route\(['\"](/api/[^'\"]+)['\"]"
    api_matches = re.findall(api_pattern, content)
    
    for api_path in api_matches:
        if not any(route['path'] == api_path for route in routes):
            routes.append({
                "path": api_path,
                "methods": ["GET", "POST"],
                "type": "api_endpoint",
                "file": "app.py"
            })
    
    return routes

def scan_frontend_api_calls(frontend_dir):
    """Scan frontend files for API calls"""
    api_calls = []
    
    # Scan TypeScript/JavaScript files
    for root, dirs, files in os.walk(frontend_dir):
        # Skip node_modules and .next directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', '.git']]
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Find fetch calls to backend
                    fetch_pattern = r"fetch\s*\(\s*['\"]([^'\"]+)['\"]"
                    matches = re.findall(fetch_pattern, content)
                    
                    for match in matches:
                        if 'http://10.10.50.93:5000' in match or '/api/' in match:
                            api_calls.append({
                                "url": match,
                                "file": os.path.relpath(file_path, frontend_dir),
                                "type": "fetch_call"
                            })
                    
                    # Find axios calls
                    axios_pattern = r"axios\.(get|post|put|delete)\s*\(\s*['\"]([^'\"]+)['\"]"
                    axios_matches = re.findall(axios_pattern, content)
                    
                    for method, url in axios_matches:
                        if 'http://10.10.50.93:5000' in url or '/api/' in url:
                            api_calls.append({
                                "url": url,
                                "method": method.upper(),
                                "file": os.path.relpath(file_path, frontend_dir),
                                "type": "axios_call"
                            })
                
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return api_calls

def main():
    """Main function to scan and generate endpoints.json"""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_dir = os.path.join(project_root, 'backend')
    frontend_dir = os.path.join(project_root, 'frontend')
    
    print("🔍 Scanning Tej IT Site for endpoints...")
    
    # Scan backend routes
    print("📡 Scanning Flask backend routes...")
    backend_routes = scan_flask_routes(backend_dir)
    print(f"Found {len(backend_routes)} backend routes")
    
    # Scan frontend API calls
    print("🌐 Scanning frontend API calls...")
    frontend_calls = scan_frontend_api_calls(frontend_dir)
    print(f"Found {len(frontend_calls)} frontend API calls")
    
    # Generate endpoints.json
    endpoints_data = {
        "project": "Tej IT Solutions",
        "scanned_at": "2025-01-27",
        "backend": {
            "base_url": "http://10.10.50.93:5001",
            "routes": backend_routes
        },
        "frontend": {
            "base_url": "http://10.10.50.93:3001",
            "api_calls": frontend_calls
        },
        "summary": {
            "total_backend_routes": len(backend_routes),
            "total_frontend_calls": len(frontend_calls),
            "api_endpoints": [route for route in backend_routes if route['path'].startswith('/api/')]
        }
    }
    
    # Write to endpoints.json
    endpoints_file = os.path.join(project_root, 'endpoints.json')
    with open(endpoints_file, 'w', encoding='utf-8') as f:
        json.dump(endpoints_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Generated {endpoints_file}")
    print(f"📊 Summary: {len(backend_routes)} routes, {len(frontend_calls)} API calls")

if __name__ == "__main__":
    main()