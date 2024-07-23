from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, login_required, current_user
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from datetime import datetime
import os
from app import db, bcrypt, mail
from model_modules import User, FileUpload
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)

@main.route('/')
def index():
    current_year = datetime.now().year
    return render_template('index.html', current_year=current_year)

@main.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        username = request.form['username']
        password = request.form['password']
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('An account with this email already exists. Please use a different email address.', 'error')
            return redirect(url_for('main.register'))
        
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already taken. Please choose a different one.', 'error')
            return redirect(url_for('main.register'))
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(email=email, username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        serializer = URLSafeTimedSerializer(os.getenv('SECRET_KEY'))
        token = serializer.dumps(email, salt='email-confirm')

        msg = Message('Activate Your Account - SyncShare',
                      sender=os.getenv('MAIL_USERNAME'),
                      recipients=[email])
        activation_link = url_for('main.activate_account', token=token, _external=True)
        msg.body = f'Hello {username},\n\n' \
                   f'Please click on the following link to activate your account:\n' \
                   f'{activation_link}\n\n' \
                   f'Thank you for registering with SyncShare!'
        mail.send(msg)

        flash('An activation link has been sent to your email. Please check your inbox.', 'success')
        return redirect(url_for('main.login'))

    return render_template('register.html')

@main.route('/activate/<token>', methods=['GET'])
def activate_account(token):
    activation_success = False
    try:
        serializer = URLSafeTimedSerializer(os.getenv('SECRET_KEY'))
        email = serializer.loads(token, salt='email-confirm', max_age=3600)
        user = User.query.filter_by(email=email).first()
        if user:
            user.active = True
            db.session.commit()
            activation_success = True
            flash('Your account has been activated. You can now log in.', 'success')
        else:
            flash('User not found. Please register again.', 'danger')
    except SignatureExpired:
        flash('The activation link has expired. Please register again.', 'warning')
    except BadSignature:
        flash('Invalid activation link. Please register again.', 'danger')

    return render_template('activate.html', activation_success=activation_success)

@main.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            if user.active:
                login_user(user)
                flash('Logged in successfully.', 'success')
                return redirect(url_for('main.dashboard'))
            else:
                flash('Your account is not activated yet. Please check your email for the activation link.', 'warning')
        else:
            flash('Invalid username or password.', 'danger')

    return render_template('login.html')

@main.route('/dashboard')
@login_required
def dashboard():
    username = current_user.username
    user_files = FileUpload.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', username=username, user_files=user_files)

@main.route('/anonymous_upload', methods=['GET', 'POST'])
def anonymous_upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)

        uploaded_file = request.files['file']
        if uploaded_file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)

        upload_dir = 'uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        upload_path = os.path.join(upload_dir, secure_filename(uploaded_file.filename))
        uploaded_file.save(upload_path)

        new_file = FileUpload(filename=secure_filename(uploaded_file.filename), user_id=None)
        db.session.add(new_file)
        db.session.commit()

        recipient_email = request.form.get('recipient_email')
        if recipient_email:
            if send_email_with_attachment(recipient_email, upload_path, secure_filename(uploaded_file.filename)):
                flash('File uploaded anonymously and sent via email!', 'success')
            else:
                flash('File uploaded but there was an issue sending the email.', 'error')

        return redirect(url_for('main.anonymous_upload'))

    current_year = datetime.now().year
    return render_template('anonymous_upload.html', current_year=current_year)

def send_email_with_attachment(recipient_email, file_path, file_name):
    try:
        with mail.connect() as conn:
            msg = Message('File from SyncShare', sender=os.getenv('MAIL_USERNAME'), recipients=[recipient_email])
            msg.body = 'Please find attached file from SyncShare.'

            with open(file_path, 'rb') as fp:
                msg.attach(file_name, 'application/octet-stream', fp.read())
            
            conn.send(msg)
            print("Email sent successfully!")
            return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

@main.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'success')
    return redirect(url_for('main.index'))

@main.route('/about')
def about():
    current_year = datetime.now().year
    return render_template('about.html', current_year=current_year)

@main.route('/history')
@login_required
def history():
    uploaded_files = FileUpload.query.filter_by(user_id=current_user.id).all()
    return render_template('history.html', uploaded_files=uploaded_files)
