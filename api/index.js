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

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
