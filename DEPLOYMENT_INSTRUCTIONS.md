# Recipe Cookbook Website

A beautiful, user-friendly recipe management website that allows you to add, edit, view, and delete your favorite recipes from any device.

## Features

- 🍳 Add new recipes with ingredients, instructions, images, and more
- ✏️ Edit existing recipes
- 🔍 Search recipes by name or ingredients
- 🏷️ Filter recipes by category (Breakfast, Lunch, Dinner, Dessert, etc.)
- 📱 Fully responsive design - works on all devices
- 🎨 Beautiful, modern UI with smooth animations
- 💾 Persistent storage via Netlify serverless functions

## Project Structure

```
recipes_cookbook/
├── index.html              # Main HTML file
├── styles.css              # CSS styling
├── app.js                  # Frontend JavaScript
├── netlify.toml           # Netlify configuration
├── package.json           # Node.js dependencies
├── .gitignore            # Git ignore file
├── netlify/
│   └── functions/
│       └── recipes.js     # Serverless function for recipe CRUD operations
└── DEPLOYMENT_INSTRUCTIONS.md  # This file
```

## Deployment Options

You have two options for deploying this website:

### Option 1: Netlify (Recommended - Full Functionality)

Netlify provides serverless functions, so your recipes will be stored persistently and accessible from any device.

#### Steps to Deploy on Netlify:

1. **Create a Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with your GitHub account (or email)

2. **Prepare Your Repository**
   ```powershell
   # Navigate to your project folder
   cd "c:\Users\romai\OneDrive - ENSTA Bretagne\Bureau\Ch\recipes_cookbook"
   
   # Initialize git repository (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Recipe Cookbook"
   ```

3. **Push to GitHub**
   - Create a new repository on [github.com](https://github.com/new)
   - Name it `recipe-cookbook` (or any name you prefer)
   - Don't initialize with README
   - Run these commands:
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/recipe-cookbook.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy on Netlify**
   - Log in to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your `recipe-cookbook` repository
   - Build settings (should auto-detect):
     - Build command: (leave empty)
     - Publish directory: `.`
     - Functions directory: `netlify/functions`
   - Click "Deploy site"

5. **Access Your Site**
   - Wait for deployment to complete (usually 1-2 minutes)
   - Netlify will give you a URL like: `https://your-site-name.netlify.app`
   - You can customize this URL in Site settings → Domain management

6. **Optional: Custom Domain**
   - In Netlify dashboard, go to Domain settings
   - Add custom domain if you have one
   - Or use the free Netlify subdomain

#### Testing Locally with Netlify Dev:

```powershell
# Install dependencies
npm install

# Run locally with Netlify functions
npx netlify dev
```

Open `http://localhost:8888` in your browser.

---

### Option 2: GitHub Pages (View-Only - No Editing)

⚠️ **Important Limitation**: GitHub Pages only serves static files and cannot run serverless functions. This means:
- You CAN view your recipes
- You CANNOT add, edit, or delete recipes from the website
- You'll need to manually edit a JSON file and push changes via git

This option is only recommended if you want a simple recipe viewer and are comfortable editing JSON files.

#### Steps to Deploy on GitHub Pages:

1. **Modify the Code for Static Data**
   
   You'll need to create a `recipes.json` file and modify `app.js` to load from it instead of the serverless function.

   Create `recipes.json`:
   ```json
   []
   ```

   Modify the beginning of `app.js` to use local JSON:
   ```javascript
   // Change this line:
   const API_BASE = '/.netlify/functions';
   
   // To this:
   const API_BASE = './recipes.json';
   
   // And modify loadRecipes() to:
   async function loadRecipes() {
       try {
           const response = await fetch('./recipes.json');
           if (response.ok) {
               recipes = await response.json();
               displayRecipes(recipes);
           }
       } catch (error) {
           console.error('Error loading recipes:', error);
           displayRecipes([]);
       }
   }
   ```

2. **Push to GitHub**
   ```powershell
   # Navigate to project folder
   cd "c:\Users\romai\OneDrive - ENSTA Bretagne\Bureau\Ch\recipes_cookbook"
   
   # Initialize git
   git init
   git add .
   git commit -m "Recipe cookbook for GitHub Pages"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/recipe-cookbook.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait a few minutes

4. **Access Your Site**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/recipe-cookbook/`

5. **Adding Recipes**
   - Edit `recipes.json` manually with your recipes
   - Push changes to GitHub
   - Changes will appear on your site in a few minutes

---

## Recommended Approach

**Use Netlify** - It provides the full functionality you requested:
- ✅ Accessible from any device
- ✅ Add/edit recipes through the website
- ✅ No need to git push for every change
- ✅ Free hosting
- ✅ Easy setup

GitHub Pages is only suitable if you want a simple recipe viewer and don't mind manually editing JSON files.

---

## Recipe Data Format

When adding recipes, they are stored in this format:

```json
{
  "id": "1234567890",
  "name": "Chocolate Chip Cookies",
  "category": "dessert",
  "prepTime": 15,
  "cookTime": 12,
  "servings": 24,
  "image": "https://example.com/cookies.jpg",
  "ingredients": [
    "2 cups flour",
    "1 cup sugar",
    "2 eggs"
  ],
  "instructions": [
    "Preheat oven to 350°F",
    "Mix ingredients",
    "Bake for 12 minutes"
  ],
  "notes": "Best served warm!",
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-14T10:00:00.000Z"
}
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Support

If you encounter any issues during deployment, check:
- Netlify build logs for errors
- Browser console for JavaScript errors
- Make sure all files are committed and pushed to GitHub

---

## Quick Start Summary

**For Full Functionality (Netlify):**
1. Create GitHub repository
2. Push code to GitHub
3. Sign up for Netlify
4. Connect GitHub repo to Netlify
5. Deploy!

**Time required:** ~10 minutes

Enjoy your recipe cookbook! 🍳👨‍🍳
