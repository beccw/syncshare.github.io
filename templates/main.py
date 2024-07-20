from flask import Flask, render_template, session, redirect, url_for, Blueprint, request, flash
from flask_login import login_required, current_user
from datetime import datetime

# Create a blueprint
main_bp = Blueprint('main', __name__)

# Mock user data
users = {
    'user1': {'username': 'user1', 'password': 'password1'},
    'user2': {'username': 'user2', 'password': 'password2'}
}

# Mock file upload data
uploaded_files = []

# Home page route
@main_bp.route('/')
def index():
    current_year = datetime.now().year
    return render_template('index.html', current_year=current_year)

# About page route
@main_bp.route('/about')
def about():
    return render_template('about.html', current_year=datetime.now().year)

# History page route
@main_bp.route('/history')
@login_required
def history():
    return render_template('history.html', uploaded_files=uploaded_files, current_year=datetime.now().year)

# Login page route
@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username]['password'] == password:
            session['username'] = username
            flash('Login successful!', 'success')
            return redirect(url_for('main.index'))  # Redirect to index page after login
        else:
            flash('Invalid username or password', 'error')
    return render_template('login.html', current_year=datetime.now().year)

# Logout page route
@main_bp.route('/logout')
@login_required
def logout():
    session.pop('username', None)
    flash('You have been logged out', 'info')
    return redirect(url_for('main.index'))  # Redirect to index page after logout

# Register blueprint with the app
app = Flask(__name__)
app.secret_key = '539e635aa283674be12ad56e32b33ea0'
app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True)
