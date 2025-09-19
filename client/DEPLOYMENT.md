# Netlify Deployment Guide

This guide explains how to deploy the Task Manager client application to Netlify.

## Prerequisites

- A Netlify account ([signup here](https://app.netlify.com/signup))
- Git repository with your code
- Backend API already deployed and accessible

## Deployment Methods

### Method 1: Git Integration (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Connect to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your Git provider and repository
   
3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - These are already configured in `netlify.toml`

4. **Set Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add: `REACT_APP_API_BASE_URL` with your backend API URL
   - Example: `https://your-backend-api.herokuapp.com/api`

5. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

### Method 2: Manual Upload

1. **Build the project locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Upload to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Drag and drop the `build` folder to the deploy area

### Method 3: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and deploy:**
   ```bash
   netlify login
   netlify deploy --prod --dir=build
   ```

## Configuration Files

The following files are configured for Netlify deployment:

- **`netlify.toml`**: Main configuration file with build settings and redirects
- **`public/_redirects`**: Backup redirect rules for SPA routing
- **`.env.production`**: Production environment variables
- **`.env.example`**: Template for required environment variables

## Environment Variables

Create these environment variables in your Netlify dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `https://api.example.com/api` |

## Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### 404 Errors on Page Refresh
- Ensure `_redirects` file exists in `public/` folder
- Check `netlify.toml` redirect configuration

### API Connection Issues
- Verify `REACT_APP_API_BASE_URL` environment variable
- Check CORS settings on your backend
- Ensure backend API is accessible from Netlify

### Environment Variables Not Working
- Environment variables must start with `REACT_APP_`
- Redeploy after adding environment variables
- Check browser developer tools for the actual API calls

## Performance Optimization

The app includes:
- ✅ Build optimization with Create React App
- ✅ SPA redirect handling
- ✅ Environment variable configuration
- ✅ Proper HTML meta tags for SEO

## Support

For Netlify-specific issues, check:
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community Forum](https://community.netlify.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/#netlify)