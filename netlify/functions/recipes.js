const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
        // GET - Retrieve all recipes
        if (event.httpMethod === 'GET') {
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data || [])
            };
        }

        // POST - Create new recipe
        if (event.httpMethod === 'POST') {
            const newRecipe = JSON.parse(event.body);
            console.log('Creating recipe:', newRecipe.name);
            
            const { data, error } = await supabase
                .from('recipes')
                .insert([newRecipe])
                .select()
                .single();
            
            if (error) throw error;
            
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(data)
            };
        }

        // PUT - Update existing recipe
        if (event.httpMethod === 'PUT') {
            const updatedRecipe = JSON.parse(event.body);
            const { id, ...updateData } = updatedRecipe;
            
            const { data, error } = await supabase
                .from('recipes')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Recipe not found' })
                    };
                }
                throw error;
            }
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data)
            };
        }

        // DELETE - Remove recipe
        if (event.httpMethod === 'DELETE') {
            const id = event.queryStringParameters?.id;
            
            const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Recipe deleted successfully' })
            };
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
                details: error.message
            })
        };
    }
};
