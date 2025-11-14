const { getStore } = require('@netlify/blobs');

// Get persistent storage for recipes
async function getRecipesStore() {
    return getStore('recipes');
}

// Read recipes from persistent storage
async function readRecipes() {
    try {
        const store = await getRecipesStore();
        const data = await store.get('recipes');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading recipes:', error);
        return [];
    }
}

// Write recipes to persistent storage
async function writeRecipes(recipes) {
    try {
        const store = await getRecipesStore();
        await store.set('recipes', JSON.stringify(recipes, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing recipes:', error);
        return false;
    }
}

exports.handler = async (event, context) => {
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
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};
