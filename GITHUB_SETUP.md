# GitHub Token Setup

## Step 1: Create a Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Give it a name: "Recipe Cookbook"
3. Set expiration: "No expiration" (or your preference)
4. Check these permissions:
   - ✅ **repo** (Full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** - you won't see it again!

## Step 2: Add Token to app.js

Open `app.js` and replace this line:
```javascript
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN_HERE';
```

With your actual token:
```javascript
const GITHUB_TOKEN = 'ghp_yourActualTokenHere';
```

## Step 3: Update .gitignore

Add this to `.gitignore` to keep your token private:
```
app.js
```

Make a copy of app.js as `app.template.js` for reference, then:
```bash
git add app.template.js .gitignore
git commit -m "Add template and update gitignore"
```

## Step 4: Enable GitHub Pages

1. Go to https://github.com/Romainjgy/recipe-cookbook/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Click Save

Your site will be at: https://romainjgy.github.io/recipe-cookbook/

## Done! 🎉

Now you can add/edit/delete recipes and they'll be saved directly to `recipes.json` in your GitHub repo!
