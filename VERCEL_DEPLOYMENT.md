# Deployment Guide — Vercel

This guide walks you through deploying your SHPE Node.js application to Vercel in minutes.

## Quick Start (Recommended)

### Step 1: Push to GitHub

1. **Initialize Git** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Node.js/Express SHPE app"
   ```

2. **Create a GitHub repository** at [github.com/new](https://github.com/new)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

**Option A: Via Web Dashboard (Easiest)**
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. Vercel auto-detects the configuration from `vercel.json`
5. Click **"Deploy"** — that's it! 🎉

**Option B: Via CLI**
1. Install Vercel CLI: `npm install -g vercel`
2. From your project directory: `vercel`
3. Follow the interactive prompts
4. Your app deploys automatically

### Step 3: Verify Deployment

- Your app will be live at: `https://YOUR_PROJECT.vercel.app`
- All routes (`/about`, `/join`, `/biomedical`, etc.) work automatically
- Static files serve fast from Vercel's edge network

---

## Advanced Configuration

### Custom Domain
1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain (e.g., `shpe-emcc.com`)
3. Update DNS records according to Vercel's instructions

### Environment Variables
If you add API keys, secrets, or config:
1. Vercel Dashboard → Settings → Environment Variables
2. Add variables with keys and values
3. They auto-load in production

**Example:**
```
DATABASE_URL=postgresql://...
API_KEY=sk_live_...
CONTACT_EMAIL=shpe@emcc.edu
```

Then in `api/index.js`:
```javascript
const dbUrl = process.env.DATABASE_URL;
```

### Custom Error Pages
Add a `public/404.html` or `public/500.html` for error pages (optional).

---

## Troubleshooting

### "Port is already in use"
Kill the port locally:
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or just use a different port:
PORT=3001 npm run dev
```

### "Cannot find module 'express'"
Ensure dependencies are installed:
```bash
npm install
```

### Deployment Fails
- Check build logs in Vercel Dashboard → Deployments → Details
- Ensure `api/index.js` exists
- Verify `vercel.json` is in root directory

---

## File Structure for Vercel

Your project root should look like:
```
project-root/
├── api/
│   └── index.js          ← Express server (entry point)
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── [other HTML files]
├── package.json
├── vercel.json           ← Vercel config
└── README.md
```

---

## Monitoring & Logs

After deployment:
- **View Logs**: Vercel Dashboard → Project → Deployments → [Click deployment] → Logs
- **Monitor Performance**: Analytics tab shows request times and errors
- **Rollback**: Click "Promote to Production" on any previous deployment

---

## CI/CD: Auto-Deploy on Every Push

Vercel automatically redeploys when you:
- Push to `main` branch
- Create pull requests (preview deployments)

No additional setup needed! 🚀

---

## Next Steps

1. ✅ Verify your live URL works
2. 📱 Test on mobile
3. 🎨 Customize `public/style.css` with your branding
4. 📝 Update content in HTML files
5. 🔗 Set up a custom domain
6. 📊 Monitor via Vercel Dashboard

---

**Questions?** Check [Vercel Docs](https://vercel.com/docs) or contact your SHPE tech lead.

Happy deploying! 🎉
