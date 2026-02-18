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
    { name: "Mechanical Engineering", slug: "mechanical.html", short: "Mechanics, design, and thermal systems." }
  ];
  res.json(majors);
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
const majorPages = ['biomedical', 'chemical', 'civil', 'electrical', 'materials', 'mechanical'];
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
