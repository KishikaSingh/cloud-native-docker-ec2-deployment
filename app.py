from flask import Flask, render_template, request, jsonify, make_response
import secrets
import string
import math
import re

app = Flask(__name__)

def calculate_entropy(length, charset_size):
    """Calculate password entropy in bits."""
    if charset_size <= 0:
        return 0
    return round(length * math.log2(charset_size), 2)

def estimate_strength(entropy):
    """Estimate password strength based on entropy."""
    if entropy < 28:
        return "Very Weak", "#ff6b6b"
    elif entropy < 36:
        return "Weak", "#ffa94d"
    elif entropy < 60:
        return "Good", "#51cf66"
    elif entropy < 80:
        return "Strong", "#339af0"
    else:
        return "Very Strong", "#5c7cfa"

def generate_password(length, options):
    """Generate cryptographically secure password with options."""
    
    # Default character sets
    charsets = {
        'lower': string.ascii_lowercase if options.get('lower') else '',
        'upper': string.ascii_uppercase if options.get('upper') else '',
        'digits': string.digits if options.get('digits') else '',
        'special': string.punctuation if options.get('special') else '',
        'hex': 'abcdef0123456789' if options.get('hex') else ''
    }
    
    # Combine character sets
    characters = ''.join(charsets.values())
    
    if not characters:
        return None, 0, "Very Weak", "#ff6b6b"
    
    # Generate password
    password = ''.join(secrets.choice(characters) for _ in range(length))
    
    # Calculate metrics
    entropy = calculate_entropy(length, len(characters))
    strength, color = estimate_strength(entropy)
    
    return password, entropy, strength, color

def calculate_crack_time(entropy):
    """Estimate time to crack password (simplified)."""
    if entropy <= 0:
        return "Instant"
    
    # Assuming 1 trillion guesses per second
    seconds = 2 ** entropy / 1e12
    
    if seconds < 1:
        return "Less than 1 second"
    elif seconds < 60:
        return f"{int(seconds)} seconds"
    elif seconds < 3600:
        return f"{int(seconds/60)} minutes"
    elif seconds < 86400:
        return f"{int(seconds/3600)} hours"
    elif seconds < 31536000:
        return f"{int(seconds/86400)} days"
    else:
        years = seconds / 31536000
        if years > 1000000000:
            return "Centuries"
        return f"{years:,.0f} years"

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        try:
            length = int(request.form.get("length", 12))
            length = max(6, min(100, length))  # Limit to 6-100
            
            options = {
                'lower': request.form.get("lower") == "on",
                'upper': request.form.get("upper") == "on",
                'digits': request.form.get("digits") == "on",
                'special': request.form.get("special") == "on",
                'hex': request.form.get("hex") == "on"
            }
            
            password, entropy, strength, strength_color = generate_password(length, options)
            crack_time = calculate_crack_time(entropy)
            
            return render_template("index.html", 
                                 password=password,
                                 entropy=entropy,
                                 strength=strength,
                                 strength_color=strength_color,
                                 crack_time=crack_time,
                                 options=options,
                                 length=length)
        except Exception as e:
            return render_template("index.html", error=str(e))
    
    return render_template("index.html")

@app.route("/api/generate", methods=["GET"])
def api_generate():
    """API endpoint for programmatic password generation."""
    length = request.args.get("length", default=12, type=int)
    length = max(6, min(100, length))
    
    options = {
        'lower': request.args.get("lower", default="true").lower() == "true",
        'upper': request.args.get("upper", default="true").lower() == "true",
        'digits': request.args.get("digits", default="false").lower() == "true",
        'special': request.args.get("special", default="false").lower() == "true",
        'hex': request.args.get("hex", default="false").lower() == "true"
    }
    
    password, entropy, strength, _ = generate_password(length, options)
    
    return jsonify({
        "password": password,
        "length": length,
        "entropy": entropy,
        "strength": strength,
        "characters_used": len(''.join(v for v in [string.ascii_lowercase if options['lower'] else '',
                                                   string.ascii_uppercase if options['upper'] else '',
                                                   string.digits if options['digits'] else '',
                                                   string.punctuation if options['special'] else '',
                                                   'abcdef0123456789' if options['hex'] else '']))
    })

@app.route("/api/strength", methods=["POST"])
def api_strength():
    """API endpoint to check password strength."""
    data = request.get_json()
    password = data.get("password", "")
    
    length = len(password)
    char_variety = len(set(password))
    
    # Simple strength calculation
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in string.punctuation for c in password)
    
    charset_size = 0
    if has_lower: charset_size += 26
    if has_upper: charset_size += 26
    if has_digit: charset_size += 10
    if has_special: charset_size += len(string.punctuation)
    
    entropy = calculate_entropy(length, charset_size) if charset_size > 0 else 0
    strength, color = estimate_strength(entropy)
    crack_time = calculate_crack_time(entropy)
    
    return jsonify({
        "entropy": entropy,
        "strength": strength,
        "color": color,
        "crack_time": crack_time,
        "length": length,
        "has_lower": has_lower,
        "has_upper": has_upper,
        "has_digit": has_digit,
        "has_special": has_special
    })

@app.after_request
def add_security_headers(response):
    """Add security headers to responses."""
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    return response

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
