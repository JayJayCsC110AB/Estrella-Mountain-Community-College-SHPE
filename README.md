# SHPE EMCC — Node.js/Express Edition

A Node.js/Express-based STEM hub for Estrella Mountain Community College's SHPE chapter.

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Setup & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser

## Project Structure

```
.
├── api/
│   └── index.js              # Express server
├── public/
│   ├── index.html            # Home page
│   ├── about.html            # About page
│   ├── join.html             # Join page
│   ├── biomedical.html       # Major pages...
│   ├── chemical.html
│   ├── civil.html
│   ├── electrical.html
│   ├── materials.html
│   ├── mechanical.html
│   ├── script.js             # Client-side JavaScript
│   └── style.css             # Styling
├── package.json
├── vercel.json               # Vercel configuration
└── README.md
```

## Deploy to Vercel

### One-Click Deploy

Click the button below to deploy to Vercel directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USER/YOUR_REPO)

### Manual Deploy

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from project directory:**
   ```bash
   vercel
   ```

3. **Follow the prompts** to connect your GitHub account and deploy

### Environment Variables

Currently, no environment variables are required. If you add them, create a `.env` file locally and add them to Vercel dashboard under **Settings → Environment Variables**.

## Features

- **Engineering Majors Search**: Search and filter by major name and keywords
- **Major Roadmaps**: Curriculum paths for 6 engineering disciplines
- **Responsive Design**: Mobile-first CSS grid layout
- **Fast Routes**: Optimized Express routing with static file serving

## API Endpoints

- `GET /` — Home page
- `GET /about` — About page
- `GET /join` — Join page
- `GET /biomedical` — Biomedical Engineering page
- `GET /chemical` — Chemical Engineering page
- `GET /civil` — Civil Engineering page
- `GET /electrical` — Electrical Engineering page
- `GET /materials` — Materials Engineering page
- `GET /mechanical` — Mechanical Engineering page
- `GET /api/majors` — JSON endpoint with majors data

## Styling & Customization

Edit `public/style.css` to customize colors and layout. CSS variables are defined in the `:root` selector.

## TODO

- [ ] Add membership form on join page
- [ ] Integrate AI mentor chatbot
- [ ] Add blog/news section
- [ ] Database integration for events and advisors
- [ ] Email notifications for members

---

Built with ❤️ for EMCC SHPE
