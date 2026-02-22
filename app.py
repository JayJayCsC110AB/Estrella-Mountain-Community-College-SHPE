from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
from groq import Groq

app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)
PORT = os.environ.get('PORT', 3000)

# Initialize Groq client with API key from environment variable
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set. Please set it before running the app.")

client = Groq(api_key=GROQ_API_KEY)

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if path.endswith('.html'):
        return send_from_directory('public', path)
    return send_from_directory('public', path)

# Major knowledge base
MAJOR_KNOWLEDGE = {
    'biomedical': "Biomedical Engineering applies engineering principles to medicine and healthcare. It encompasses medical devices, diagnostic imaging, surgical equipment, prosthetics, and tissue engineering. Average salary: $70,000-$90,000. Top employers: Medtronic, Johnson & Johnson, GE Healthcare, Boston Scientific.",
    'chemical': "Chemical Engineering involves process design, manufacturing, and chemical treatment. This field covers petrochemicals, pharmaceutical manufacturing, environmental remediation, and materials processing. Average salary: $65,000-$95,000. Top employers: Dow Chemical, BASF, ExxonMobil, DuPont.",
    'civil': "Civil Engineering focuses on infrastructure, buildings, and construction. It includes structural design, transportation systems, water resources, and environmental engineering. Average salary: $60,000-$90,000. Top employers: AECOM, Bechtel, Jacobs Engineering, CH2M.",
    'electrical': "Electrical Engineering covers power systems, electronics, telecommunications, and renewable energy. This field designs circuits, power grids, embedded systems, and communication networks. Average salary: $65,000-$100,000. Top employers: Google, Tesla, Siemens, General Electric.",
    'materials': "Materials Engineering studies and develops new materials including metals, polymers, ceramics, and semiconductors. It involves materials testing, characterization, and processing optimization. Average salary: $60,000-$95,000. Top employers: Intel, NVIDIA, 3M, DuPont.",
    'mechanical': "Mechanical Engineering designs and manufactures mechanical systems including engines, machines, and thermal systems. It covers thermodynamics, fluid mechanics, manufacturing, and robotics. Average salary: $63,000-$98,000. Top employers: General Motors, Boeing, Tesla, Ford.",
    'software': "Software Engineering involves designing, developing, and maintaining software systems. It covers full-stack development, cloud computing, cybersecurity, and software architecture. Average salary: $80,000-$150,000. Top employers: Google, Microsoft, Amazon, Apple, Meta.",
    'machinelearning': "Machine Learning and AI focuses on creating intelligent systems that learn from data. It involves data science, neural networks, computer vision, and natural language processing. Average salary: $100,000-$200,000. Top employers: Google, OpenAI, DeepMind, Tesla, Meta."
}

# API endpoint for majors
@app.route('/api/majors', methods=['GET'])
def get_majors():
    majors = [
        {"name": "Biomedical Engineering", "slug": "biomedical.html", "short": "Medical devices, bio-systems and healthcare tech."},
        {"name": "Chemical Engineering", "slug": "chemical.html", "short": "Process design, materials, and energy."},
        {"name": "Civil Engineering", "slug": "civil.html", "short": "Infrastructure, structures, and environmental design."},
        {"name": "Electrical Engineering", "slug": "electrical.html", "short": "Circuits, power systems, and electronics."},
        {"name": "Materials Engineering", "slug": "materials.html", "short": "Materials science, testing and development."},
        {"name": "Mechanical Engineering", "slug": "mechanical.html", "short": "Mechanics, design, and thermal systems."},
        {"name": "Software Engineering", "slug": "software.html", "short": "Software development, coding, and system design."},
        {"name": "Machine Learning", "slug": "machine-learning.html", "short": "AI, data science, and intelligent systems."}
    ]
    return jsonify(majors)

# Conversational chatbot powered by Groq AI (like ChatGPT)
def get_response(query, major):
    """Use Groq API for intelligent conversational responses - works like ChatGPT"""
    
    # Build system prompt based on major context
    system_prompt = "You are SHPE AI Chat Assistant, a helpful and friendly AI assistant for SHPE at Estrella Mountain Community College. You can answer any question like ChatGPT - about engineering, careers, general knowledge, or anything else. Be conversational and helpful."
    
    # Add major-specific knowledge if provided
    if major and major in MAJOR_KNOWLEDGE:
        system_prompt += f" You're helping someone interested in {major.title()}: {MAJOR_KNOWLEDGE[major]}"
    
    try:
        # Call Groq API for intelligent response
        message = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ]
        )
        
        answer = message.choices[0].message.content
        return answer
        
    except Exception as e:
        error_msg = f"Groq API Error: {type(e).__name__}: {str(e)}"
        print(error_msg)
        import traceback
        traceback.print_exc()
        # Fallback response if API fails
        return f"I'm having trouble connecting to the AI right now ({type(e).__name__}), but I'm here to help! Feel free to ask me anything about engineering, SHPE, or anything else on your mind."

# API endpoint for chat
@app.route('/api/chat', methods=['GET'])
def chat():
    query = request.args.get('q', '').strip()
    major = request.args.get('major', '').strip().lower()
    
    if not query:
        return jsonify({'error': 'Missing query parameter `q`'}), 400
    
    answer = get_response(query, major)
    
    return jsonify({
        'query': query,
        'major': major or 'general',
        'answer': answer,
        'timestamp': datetime.now().isoformat()
    })

# 404 fallback - serve index.html for client-side routing
@app.errorhandler(404)
def not_found(error):
    return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=int(PORT), host='0.0.0.0')
