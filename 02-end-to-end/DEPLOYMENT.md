# Deployment Guide

## Quick Start

Your collaborative coding platform is ready to deploy! Here's what you need to do:

## 1. Test Locally (Optional but Recommended)

```bash
# Run both client and server
npm run dev

# In a separate terminal, run tests
cd tests && npm test
```

Visit `http://localhost:5173` and open it in two browser windows to test real-time collaboration.

## 2. Deploy to Render.com

### Prerequisites
- GitHub account
- Render.com account (free)

### Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Complete collaborative coding platform"
   git push origin main
   ```

2. **Create Render Service**:
   - Go to [https://render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the Service**:
   - **Name**: `coding-platform` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `02-end-to-end`
   - **Environment**: `Docker`
   - **Build Command**: Auto-detected from Dockerfile
   - **Start Command**: Auto-detected from Dockerfile

4. **Environment Variables** (optional):
   ```
   NODE_ENV=production
   ```
   (PORT is automatically set by Render)

5. **Create Web Service**:
   - Click "Create Web Service"
   - Wait 5-10 minutes for build and deployment
   - Render will provide a URL like: `https://coding-platform-xxxx.onrender.com`

6. **Update homework.md**:
   - Copy your deployment URL
   - Update Question 7 in `homework.md` with the actual URL

## 3. Test Deployment

1. Visit your Render URL
2. Open in two different browsers
3. Copy the share link from one window
4. Paste in the other browser
5. Verify real-time code synchronization
6. Test JavaScript execution
7. Test Python execution (may take a few seconds to load Pyodide)

## 4. Alternative: Deploy with Docker Locally

```bash
# Build
docker build -t coding-platform .

# Run
docker run -p 3000:3000 coding-platform

# Visit
http://localhost:3000
```

## Troubleshooting

### Build Fails on Render
- Check Render logs for specific error
- Verify Dockerfile is in `02-end-to-end/` directory
- Ensure all dependencies are in package.json files

### WebSocket Connection Fails
- CORS is configured to allow any origin in production
- Socket.io uses dynamic `window.location.origin`
- Should work automatically on Render

### Pyodide Doesn't Load
- Pyodide is loaded from CDN
- First load takes 2-3 seconds
- Check browser console for errors

## Free Tier Limitations

Render free tier:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for development)

## Next Steps

Once deployed:
1. ✅ Update `homework.md` with deployment URL
2. ✅ Test all features on production
3. ✅ Take screenshots for submission
4. ✅ (Optional) Record demo video

## Support

If you encounter issues:
- Check Render documentation: https://render.com/docs
- Review server logs in Render dashboard
- Check browser console for client-side errors
