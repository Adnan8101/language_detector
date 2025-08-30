import os
import logging
from flask import Flask, render_template, request, jsonify
from language_detector import LanguageDetector

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key_for_development")

# Initialize language detector
detector = LanguageDetector()

@app.route('/')
def index():
    """Main page with language detection interface"""
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect_language():
    """API endpoint for language detection"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        method = data.get('method', 'both')
        
        if not text:
            return jsonify({'error': 'Text input is required'}), 400
        
        if len(text) < 3:
            return jsonify({'error': 'Text must be at least 3 characters long for accurate detection'}), 400
        
        results = {}
        
        if method in ['traditional', 'both']:
            try:
                traditional_result = detector.detect_traditional(text)
                results['traditional'] = traditional_result
            except Exception as e:
                logging.error(f"Traditional detection error: {str(e)}")
                results['traditional'] = {'error': f'Traditional detection failed: {str(e)}'}
        
        if method in ['pretrained', 'both']:
            try:
                pretrained_result = detector.detect_pretrained(text)
                results['pretrained'] = pretrained_result
            except Exception as e:
                logging.error(f"Pre-trained detection error: {str(e)}")
                results['pretrained'] = {'error': f'Pre-trained detection failed: {str(e)}'}
        
        return jsonify(results)
    
    except Exception as e:
        logging.error(f"Detection error: {str(e)}")
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Language Detection API is running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
