const { getStore } = require('@netlify/blobs');

// Get persistent storage for recipes
async function getRecipesStore(context) {
    return getStore({
        name: 'recipes',
        siteID: context.site?.id || process.env.SITE_ID,
        token: process.env.NETLIFY_BLOBS_TOKEN || context.token
    });
}

// Read recipes from persistent storage
async function readRecipes(context) {
    try {
        const store = await getRecipesStore(context);
        const data = await store.get('recipes');
        console.log('Read recipes, data length:', data?.length || 0);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading recipes:', error.message, error.stack);
        return [];
    }
}

// Write recipes to persistent storage
async function writeRecipes(recipes, context) {
    try {
        const store = await getRecipesStore(context);
        await store.set('recipes', JSON.stringify(recipes, null, 2));
        console.log('Successfully wrote recipes, count:', recipes.length);
        return true;
    } catch (error) {
        console.error('Error writing recipes:', error.message, error.stack);
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
        const recipes = await readRecipes(context);
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
            
            if (await writeRecipes(recipes, context)) {
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
                
                if (await writeRecipes(recipes, context)) {
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
                if (await writeRecipes(filteredRecipes, context)) {
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
