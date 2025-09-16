# 🚨 Render Backend Recovery Guide

## Current Situation
Your backend on Render (`https://veilos-backend.onrender.com`) is not responding, causing timeout errors in your frontend.

## Immediate Actions Required

### 1. Check Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your backend service
3. Check the status:
   - ✅ **Live** = Service is running
   - 🔄 **Building** = Deployment in progress
   - ❌ **Failed** = Service crashed
   - 😴 **Sleeping** = Free tier service went to sleep

### 2. Check Service Logs
1. Click on your backend service
2. Go to "Logs" tab
3. Look for error messages:
   - MongoDB connection errors
   - Port binding issues
   - Environment variable errors
   - Dependency installation failures

### 3. Common Issues & Fixes

#### Issue: Service is Sleeping (Free Tier)
**Solution:** 
- Click "Manual Deploy" → "Deploy latest commit"
- Or upgrade to paid plan to prevent sleeping

#### Issue: MongoDB Connection Error
**Symptoms:** Logs show "MongoDB connection error"
**Solution:**
- Check `MONGODB_URI` in Environment tab
- Verify MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas

#### Issue: Environment Variables Missing
**Symptoms:** Logs show "undefined" or missing env vars
**Solution:**
- Go to Environment tab
- Add missing variables from your local `.env` file
- Click "Save Changes" (triggers redeploy)

#### Issue: Build Failure
**Symptoms:** Status shows "Failed"
**Solution:**
- Check build logs for specific errors
- Ensure `package.json` has correct scripts
- Verify all dependencies are listed

### 4. Force Redeploy
If service appears stuck:
1. Go to your service dashboard
2. Click "Manual Deploy"
3. Select "Deploy latest commit"
4. Wait 3-5 minutes for deployment

### 5. Emergency Environment Variables
If env vars are missing, add these in Render Environment tab:

```
PORT=3000
MONGODB_URI=mongodb+srv://emrash:Hnn8HmcUVBXTHHOL@veilodb.q7h6cuk.mongodb.net/veilo?retryWrites=true&w=majority&appName=veiloDB
JWT_SECRET=veilo_super_secret@veilojwttoken
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,https://veilo.vercel.app,https://veilo-app.vercel.app,https://veilos-frontend.vercel.app
```

## Alternative: Run Backend Locally

If Render continues to have issues:

### Windows:
```bash
# Double-click the start-backend-emergency.bat file
# OR run manually:
cd veilos_backend
npm install
npm run dev
```

### Mac/Linux:
```bash
cd veilos_backend
npm install
npm run dev
```

Then update your frontend `.env` to use `http://localhost:3000`

## Monitoring Recovery

Use the `check-render-status.html` file to monitor when the service comes back online.

## Prevention

1. **Upgrade to Paid Plan:** Prevents sleeping
2. **Health Checks:** Set up monitoring
3. **Backup Deployment:** Consider additional hosting (Railway, Heroku)
4. **Local Development:** Always have local backend ready

## Contact Support

If issues persist:
1. Render Support: [help.render.com](https://help.render.com)
2. Check Render Status: [status.render.com](https://status.render.com)