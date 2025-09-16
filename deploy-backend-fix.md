# Backend CORS Fix Deployment Guide

## Problem
The frontend deployed on Vercel (`https://veilos-frontend.vercel.app`) cannot connect to the backend on Render due to CORS policy violations.

## Solution Applied
1. **Enhanced CORS Configuration** in `veilos_backend/server.js`:
   - Added proper parsing of `CORS_ALLOWED_ORIGINS` environment variable
   - Added dynamic Vercel domain detection
   - Enhanced logging for CORS debugging
   - Added health check endpoints

2. **Environment Variables** in `veilos_backend/.env`:
   - Updated `CORS_ALLOWED_ORIGINS` to include all Vercel deployment URLs

## Deployment Steps

### Option 1: Deploy via Git (Recommended)
```bash
# Navigate to backend directory
cd veilos_backend

# Add and commit changes
git add .
git commit -m "Fix CORS configuration for Vercel frontend"

# Push to your Render-connected repository
git push origin main
```

### Option 2: Manual Deployment
1. Go to your Render dashboard
2. Find your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

### Option 3: Environment Variables Update
If you can't deploy code changes immediately, update these environment variables in Render:

1. Go to Render Dashboard → Your Backend Service → Environment
2. Add/Update:
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,https://veilo.vercel.app,https://veilo-app.vercel.app,https://veilos-frontend.vercel.app
   ```
3. Click "Save Changes" (this will trigger a redeploy)

## Testing the Fix

### 1. Test Backend Health
Visit: `https://veilos-backend.onrender.com/health`
Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-09-15T21:34:25.100Z",
  "cors": ["https://veilos-frontend.vercel.app", ...]
}
```

### 2. Test CORS Headers
Use browser dev tools or curl:
```bash
curl -H "Origin: https://veilos-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -X OPTIONS \
     https://veilos-backend.onrender.com/api/auth/login
```

### 3. Test Frontend Connection
After backend deployment, try signing up/logging in from your Vercel frontend.

## Expected Results
- ✅ No more CORS errors in browser console
- ✅ Successful API requests from frontend to backend
- ✅ Login/signup functionality working

## Troubleshooting

### If CORS errors persist:
1. Check Render logs for CORS debug messages
2. Verify environment variables are set correctly
3. Ensure backend service is running (not crashed)
4. Check if Render service URL has changed

### If backend is not responding:
1. Check Render service status
2. Review deployment logs
3. Verify MongoDB connection
4. Check for any startup errors

## Monitoring
- Backend logs will show CORS check messages: `🔍 CORS Check - Origin: ... Allowed: true/false`
- Health endpoint provides CORS configuration visibility
- Frontend will log successful API connections