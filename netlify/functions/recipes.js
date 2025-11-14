// Simple in-memory storage (persists during function lifetime)
// Note: This is a temporary solution. For production, consider using a proper database.
let recipesCache = null;

// Read recipes from environment variable or cache
async function readRecipes() {
    try {
        // Try to use cache first
        if (recipesCache !== null) {
            console.log('Read recipes from cache, count:', recipesCache.length);
            return recipesCache;
        }
        
        // Try to read from environment variable (set via Netlify UI or API)
        const storedData = process.env.RECIPES_DATA;
        if (storedData) {
            recipesCache = JSON.parse(storedData);
            console.log('Read recipes from env, count:', recipesCache.length);
            return recipesCache;
        }
        
        console.log('No recipes found, returning empty array');
        recipesCache = [];
        return [];
    } catch (error) {
        console.error('Error reading recipes:', error.message);
        recipesCache = [];
        return [];
    }
}

// Write recipes to cache (persists during function lifetime)
async function writeRecipes(recipes) {
    try {
        recipesCache = recipes;
        console.log('Successfully wrote recipes to cache, count:', recipes.length);
        
        // Log the data so you can save it manually if needed
        console.log('Recipe data (copy this to save):', JSON.stringify(recipes));
        
        return true;
    } catch (error) {
        console.error('Error writing recipes:', error.message);
        return false;
    }
}

exports.handler = async (event, context) => {
    console.log('Function invoked:', event.httpMethod, event.path);
    
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const recipes = await readRecipes();
        console.log('Loaded recipes count:', recipes.length);

        // GET - Retrieve all recipes
        if (event.httpMethod === 'GET') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(recipes)
            };
        }

        // POST - Create new recipe
        if (event.httpMethod === 'POST') {
            const newRecipe = JSON.parse(event.body);
            console.log('Creating recipe:', newRecipe.name);
            recipes.push(newRecipe);
            
            if (await writeRecipes(recipes)) {
                return {
                    statusCode: 201,
                    headers,
                    body: JSON.stringify(newRecipe)
                };
            } else {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to save recipe' })
                };
            }
        }

        // PUT - Update existing recipe
        if (event.httpMethod === 'PUT') {
            const updatedRecipe = JSON.parse(event.body);
            const index = recipes.findIndex(r => r.id === updatedRecipe.id);
            
            if (index !== -1) {
                recipes[index] = updatedRecipe;
                
                if (await writeRecipes(recipes)) {
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(updatedRecipe)
                    };
                } else {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ error: 'Failed to update recipe' })
                    };
                }
            } else {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Recipe not found' })
                };
            }
        }

        // DELETE - Remove recipe
        if (event.httpMethod === 'DELETE') {
            const id = event.queryStringParameters?.id;
            const filteredRecipes = recipes.filter(r => r.id !== id);
            
            if (filteredRecipes.length < recipes.length) {
                if (await writeRecipes(filteredRecipes)) {
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ message: 'Recipe deleted successfully' })
                    };
                } else {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ error: 'Failed to delete recipe' })
                    };
                }
            } else {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Recipe not found' })
                };
            }
        }

        // Method not allowed
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error in handler:', error.message, error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error', 
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
