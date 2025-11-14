const fs = require('fs');
const path = require('path');

// Path to store recipes data
const dataDir = '/tmp';
const dataFile = path.join(dataDir, 'recipes.json');

// Initialize data file if it doesn't exist
function initDataFile() {
    try {
        if (!fs.existsSync(dataFile)) {
            fs.writeFileSync(dataFile, JSON.stringify([]));
        }
    } catch (error) {
        console.error('Error initializing data file:', error);
    }
}

// Read recipes from file
function readRecipes() {
    try {
        initDataFile();
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading recipes:', error);
        return [];
    }
}

// Write recipes to file
function writeRecipes(recipes) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(recipes, null, 2));
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
        const recipes = readRecipes();

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
            
            if (writeRecipes(recipes)) {
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
                
                if (writeRecipes(recipes)) {
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
                if (writeRecipes(filteredRecipes)) {
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
