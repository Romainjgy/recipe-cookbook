// Recipe management app
// GitHub Pages version - reads from static JSON file
const API_BASE = './recipes.json';

let recipes = [];
let currentRecipeId = null;

// DOM elements
const recipeGrid = document.getElementById('recipeGrid');
const recipeModal = document.getElementById('recipeModal');
const viewModal = document.getElementById('viewModal');
const recipeForm = document.getElementById('recipeForm');
const addRecipeBtn = document.getElementById('addRecipeBtn');
const closeButtons = document.querySelectorAll('.close');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
    setupEventListeners();
});

function setupEventListeners() {
    addRecipeBtn.addEventListener('click', () => openModal());
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            recipeModal.style.display = 'none';
            viewModal.style.display = 'none';
        });
    });
    
    cancelBtn.addEventListener('click', () => {
        recipeModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === recipeModal) recipeModal.style.display = 'none';
        if (e.target === viewModal) viewModal.style.display = 'none';
    });
    
    recipeForm.addEventListener('submit', handleSubmit);
    searchInput.addEventListener('input', filterRecipes);
    categoryFilter.addEventListener('change', filterRecipes);
}

async function loadRecipes() {
    try {
        const response = await fetch('./recipes.json');
        if (response.ok) {
            recipes = await response.json();
            displayRecipes(recipes);
        } else {
            console.error('Failed to load recipes');
            displayRecipes([]);
        }
    } catch (error) {
        console.error('Error loading recipes:', error);
        displayRecipes([]);
    }
}

function displayRecipes(recipesToDisplay) {
    if (recipesToDisplay.length === 0) {
        recipeGrid.innerHTML = `
            <div class="empty-state">
                <h2>No Recipes Yet</h2>
                <p>Click "Add New Recipe" to get started!</p>
            </div>
        `;
        return;
    }
    
    recipeGrid.innerHTML = recipesToDisplay.map(recipe => `
        <div class="recipe-card">
            <img src="${recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                 alt="${recipe.name}" 
                 class="recipe-image"
                 onclick="viewRecipe('${recipe.id}')">
            <div class="recipe-card-content">
                <div class="recipe-card-header">
                    <h3 onclick="viewRecipe('${recipe.id}')">${recipe.name}</h3>
                </div>
                <span class="recipe-category">${recipe.category}</span>
                <div class="recipe-meta">
                    ${recipe.prepTime ? `<span>⏱️ Prep: ${recipe.prepTime}min</span>` : ''}
                    ${recipe.cookTime ? `<span>🔥 Cook: ${recipe.cookTime}min</span>` : ''}
                    ${recipe.servings ? `<span>🍽️ Serves: ${recipe.servings}</span>` : ''}
                </div>
                <div class="recipe-actions">
                    <button class="btn btn-edit btn-small" onclick="editRecipe('${recipe.id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteRecipe('${recipe.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterRecipes() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    const filtered = recipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
                            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
        const matchesCategory = !category || recipe.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayRecipes(filtered);
}

function openModal(recipe = null) {
    currentRecipeId = recipe ? recipe.id : null;
    document.getElementById('modalTitle').textContent = recipe ? 'Edit Recipe' : 'Add New Recipe';
    
    if (recipe) {
        document.getElementById('recipeId').value = recipe.id;
        document.getElementById('recipeName').value = recipe.name;
        document.getElementById('recipeCategory').value = recipe.category;
        document.getElementById('prepTime').value = recipe.prepTime || '';
        document.getElementById('cookTime').value = recipe.cookTime || '';
        document.getElementById('servings').value = recipe.servings || '';
        document.getElementById('recipeImage').value = recipe.image || '';
        document.getElementById('ingredients').value = recipe.ingredients.join('\n');
        document.getElementById('instructions').value = recipe.instructions.join('\n');
        document.getElementById('notes').value = recipe.notes || '';
    } else {
        recipeForm.reset();
    }
    
    recipeModal.style.display = 'block';
}

async function handleSubmit(e) {
    e.preventDefault();
    
    alert('⚠️ GitHub Pages Mode: This site is read-only. To add recipes, edit the recipes.json file in your repository and push to GitHub.');
    
    // Note: For GitHub Pages, you would need to manually edit recipes.json
    // This form is disabled in static mode
}

function editRecipe(id) {
    alert('⚠️ GitHub Pages Mode: Editing is disabled. To modify recipes, edit the recipes.json file in your repository and push to GitHub.');
}

async function deleteRecipe(id) {
    alert('⚠️ GitHub Pages Mode: Deletion is disabled. To remove recipes, edit the recipes.json file in your repository and push to GitHub.');
}

function viewRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;
    
    const detail = document.getElementById('recipeDetail');
    detail.innerHTML = `
        <h2>${recipe.name}</h2>
        ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}">` : ''}
        
        <div class="detail-meta">
            <div><span class="recipe-category">${recipe.category}</span></div>
            ${recipe.prepTime ? `<div><strong>⏱️ Prep:</strong> ${recipe.prepTime} min</div>` : ''}
            ${recipe.cookTime ? `<div><strong>🔥 Cook:</strong> ${recipe.cookTime} min</div>` : ''}
            ${recipe.servings ? `<div><strong>🍽️ Servings:</strong> ${recipe.servings}</div>` : ''}
        </div>
        
        <div class="detail-section">
            <h3>Ingredients</h3>
            <ul>
                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        
        <div class="detail-section">
            <h3>Instructions</h3>
            <ol>
                ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
            </ol>
        </div>
        
        ${recipe.notes ? `
            <div class="detail-section">
                <h3>Notes</h3>
                <p>${recipe.notes}</p>
            </div>
        ` : ''}
        
        <div class="detail-actions">
            <button class="btn btn-edit" onclick="editRecipe('${recipe.id}'); viewModal.style.display='none'">Edit Recipe</button>
            <button class="btn btn-danger" onclick="deleteRecipe('${recipe.id}'); viewModal.style.display='none'">Delete Recipe</button>
        </div>
    `;
    
    viewModal.style.display = 'block';
}
