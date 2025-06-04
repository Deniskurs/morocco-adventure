#!/usr/bin/env python3
"""
Simple HTTP server for Morocco Adventure Dashboard
Run this script to start a local web server and automatically open the dashboard
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuration
PORT = 8000
HOST = "localhost"

def find_free_port():
    """Find a free port starting from PORT"""
    import socket
    for port in range(PORT, PORT + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((HOST, port))
                return port
        except OSError:
            continue
    return PORT

def start_server():
    """Start the HTTP server"""
    # Change to the script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Find available port
    port = find_free_port()
    
    # Create server
    handler = http.server.SimpleHTTPRequestHandler
    handler.extensions_map.update({
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.html': 'text/html',
    })
    
    with socketserver.TCPServer((HOST, port), handler) as httpd:
        url = f"http://{HOST}:{port}"
        
        print("🌟 Morocco Adventure Dashboard Server")
        print("=" * 40)
        print(f"📡 Server running at: {url}")
        print(f"📁 Serving files from: {script_dir}")
        print("\n🚀 Opening dashboard in your browser...")
        print("\n⚡ Features enabled:")
        print("   ✅ Real-time weather data")
        print("   ✅ Interactive Google Maps")
        print("   ✅ PWA functionality")
        print("   ✅ Offline support")
        print("\n⏹️  Press Ctrl+C to stop the server")
        print("=" * 40)
        
        # Open browser
        webbrowser.open(url)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped. Thanks for using Morocco Adventure Dashboard!")
            sys.exit(0)

if __name__ == "__main__":
    start_server()
