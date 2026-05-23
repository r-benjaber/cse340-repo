import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT category FROM public.category;
    `;
    const result = await db.query(query);

    if (!result || !result.rows) {
        return [];
    }

    return result.rows;
    
}

export { getAllCategories }  