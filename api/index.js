const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint for majors data
app.get('/api/majors', (req, res) => {
  const majors = [
    { name: "Biomedical Engineering", slug: "biomedical.html", short: "Medical devices, bio-systems and healthcare tech." },
    { name: "Chemical Engineering", slug: "chemical.html", short: "Process design, materials, and energy." },
    { name: "Civil Engineering", slug: "civil.html", short: "Infrastructure, structures, and environmental design." },
    { name: "Electrical Engineering", slug: "electrical.html", short: "Circuits, power systems, and electronics." },
    { name: "Materials Engineering", slug: "materials.html", short: "Materials science, testing and development." },
    { name: "Mechanical Engineering", slug: "mechanical.html", short: "Mechanics, design, and thermal systems." },
    { name: "Software Engineering", slug: "software.html", short: "Software development, coding, and system design." },
    { name: "Machine Learning", slug: "machine-learning.html", short: "AI, data science, and intelligent systems." }
  ];
  res.json(majors);
});

// Major knowledge base
const majorKnowledge = {
  biomedical: "Biomedical Engineering applies engineering principles to medicine and healthcare. It encompasses medical devices, diagnostic imaging, surgical equipment, prosthetics, and tissue engineering. Average salary: $70,000-$90,000. Top employers: Medtronic, Johnson & Johnson, GE Healthcare, Boston Scientific.",
  chemical: "Chemical Engineering involves process design, manufacturing, and chemical treatment. This field covers petrochemicals, pharmaceutical manufacturing, environmental remediation, and materials processing. Average salary: $65,000-$95,000. Top employers: Dow Chemical, BASF, ExxonMobil, DuPont.",
  civil: "Civil Engineering focuses on infrastructure, buildings, and construction. It includes structural design, transportation systems, water resources, and environmental engineering. Average salary: $60,000-$90,000. Top employers: AECOM, Bechtel, Jacobs Engineering, CH2M.",
  electrical: "Electrical Engineering covers power systems, electronics, telecommunications, and renewable energy. This field designs circuits, power grids, embedded systems, and communication networks. Average salary: $65,000-$100,000. Top employers: Google, Tesla, Siemens, General Electric.",
  materials: "Materials Engineering studies and develops new materials including metals, polymers, ceramics, and semiconductors. It involves materials testing, characterization, and processing optimization. Average salary: $60,000-$95,000. Top employers: Intel, NVIDIA, 3M, DuPont.",
  mechanical: "Mechanical Engineering designs and manufactures mechanical systems including engines, machines, and thermal systems. It covers thermodynamics, fluid mechanics, manufacturing, and robotics. Average salary: $63,000-$98,000. Top employers: General Motors, Boeing, Tesla, Ford.",
  software: "Software Engineering involves designing, developing, and maintaining software systems. It covers full-stack development, cloud computing, cybersecurity, and software architecture. Average salary: $80,000-$150,000. Top employers: Google, Microsoft, Amazon, Apple, Meta.",
  machinelearning: "Machine Learning and AI focuses on creating intelligent systems that learn from data. It involves data science, neural networks, computer vision, and natural language processing. Average salary: $100,000-$200,000. Top employers: Google, OpenAI, DeepMind, Tesla, Meta."
};

// AI Chat endpoint for answering questions about degrees
app.get('/api/chat', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const major = (req.query.major || '').toLowerCase().trim();
  
  if (!query) return res.status(400).json({ error: 'Missing query parameter `q`' });
  
  // Get knowledge base for the major
  const knowledge = majorKnowledge[major] || 'SHPE offers various engineering disciplines at Estrella Mountain Community College.';
  
  // Enhanced keyword matching to provide relevant responses
  let answer = knowledge; // Default to knowledge base
  
  if (query.includes('salary') || query.includes('pay') || query.includes('earn') || query.includes('compensation')) {
    answer = `${knowledge.split('Average salary:')[1]?.split('Top employers:')[0] || 'Check the major description'} Learn more in the major details.`;
  } else if (query.includes('career') || query.includes('job') || query.includes('work') || query.includes('opportunity')) {
    answer = `${major} engineers work in various industries including tech, healthcare, government, and manufacturing. The field offers roles in design, development, research, and management. ${knowledge}`;
  } else if (query.includes('requirement') || query.includes('prerequisite') || query.includes('class') || query.includes('course')) {
    answer = `To pursue ${major}, you typically need strong foundations in mathematics, physics, and chemistry. Check with SHPE advising for specific course requirements at Estrella Mountain Community College.`;
  } else if (query.includes('transfer') || query.includes('university') || query.includes('school') || query.includes('pathway')) {
    answer = `Estrella Mountain Community College offers seamless transfer pathways for ${major} students to Arizona universities. Visit the transfer page for details: https://www.estrellamountain.edu/university-transfer`;
  } else if (query.includes('company') || query.includes('employer') || query.includes('work at') || query.includes('hiring')) {
    const companies = knowledge.split('Top employers:')[1];
    answer = `Top employers seeking ${major} graduates include: ${companies || 'Various Fortune 500 companies and growing startups.'}`;
  } else if (query.includes('internship') || query.includes('intern') || query.includes('experience')) {
    answer = `Internships are a great way to gain hands-on experience in ${major}. SHPE organizes events and connections with companies hiring interns. Contact your SHPE chapter for current internship opportunities and industry connections.`;
  } else if (query.includes('what is') || query.includes('tell') || query.includes('about') || query.includes('explain')) {
    answer = knowledge;
  } else {
    answer = `${knowledge} Is there something specific you'd like to know about ${major}? Try asking about careers, salaries, internships, transfer pathways, or companies in this field.`;
  }
  
  res.json({
    query: query,
    major: major || 'general',
    answer: answer,
    context: knowledge
  });
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/join.html'));
});

// Serve major pages
const majorPages = ['biomedical', 'chemical', 'civil', 'electrical', 'materials', 'mechanical', 'software', 'machine-learning'];
majorPages.forEach(major => {
  app.get(`/${major}`, (req, res) => {
    res.sendFile(path.join(__dirname, `../public/${major}.html`));
  });
});

// Simple AI-like search endpoint that returns snippets from the Estrella Mountain degrees page
app.get('/api/ai', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const major = (req.query.major || '').trim();
    if(!q) return res.status(400).json({ error: 'Missing query parameter `q`' });

    const sourceUrl = 'https://www.estrellamountain.edu/degrees-certificates';
    const fetchRes = await fetch(sourceUrl);
    if(!fetchRes.ok) return res.status(502).json({ error: 'Failed to fetch source' });
    const html = await fetchRes.text();

    // extract text blocks from paragraphs, list items and headings
    const blocks = [];
    const pushMatches = (re) => {
      let m;
      while((m = re.exec(html)) !== null){
        let s = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if(s) blocks.push(s);
      }
    };
    pushMatches(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    pushMatches(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    pushMatches(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi);

    // score blocks by query token frequency
    const qTokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = blocks.map(b=>{
      const lower = b.toLowerCase();
      let score = 0;
      qTokens.forEach(t=>{ if(lower.includes(t)) score += 1; });
      return { text: b, score };
    }).filter(x=> x.score>0);

    scored.sort((a,b)=> b.score - a.score);
    const top = scored.slice(0,6);

    // fallback: if no matches, return short summary from top paragraphs
    const results = top.length ? top : blocks.slice(0,6).map(t=>({ text: t, score: 0 }));

    res.json({ source: sourceUrl, major: major || null, query: q, results });
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
