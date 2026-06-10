import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT id, category FROM public.category;
    `;
    const result = await db.query(query);

    if (!result || !result.rows) {
        return [];
    }

    return result.rows;  
};

const getCategoryById = async (id) => {
    const query = `
        SELECT id, category FROM public.category
        WHERE id = $1;
    `;
    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];

};

const getAllCategoriesByProject = async (projectId) => {
    const query = `
        SELECT
            c.id AS category_id,
            c.category,
            sp.title,      
            sp.id AS project_id             
        FROM category c
        INNER JOIN project_category pc ON c.id = pc.id_category
        INNER JOIN service_project sp ON pc.id_project = sp.id
        WHERE pc.id_project = $1;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getAllProjectsByCategory = async (categoryId) => { 
    const query = `
        SELECT
            sp.id AS project_id,
            sp.title,
            sp.description AS project_description,
            sp.location AS project_location,
            sp.service_date,
            sp.organization_id,
            o.name AS organization_name,
            c.category AS category_name     
        FROM service_project sp
        INNER JOIN project_category pc ON sp.id = pc.id_project
        INNER JOIN organization o ON sp.organization_id = o.organization_id
        INNER JOIN category c ON pc.id_category = c.id 
        WHERE pc.id_category = $1;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (id_category, id_project)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE id_project = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

const createCategory = async (name) => {

    const query = `
        INSERT INTO category (category)
        VALUES ($1)
        RETURNING id;
    `
    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGIN === 'true') {
        console.log('Created category with ID:' + result.rows[0].id);
    }

    return result.rows[0].id;

};

const updateCategory = async (categoryId, name) => {

    const query = `
        UPDATE category
        SET category = $1
        WHERE id = $2
        RETURNING id;
    `;

    const queryParams = [name, categoryId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    if (process.env.ENABLE_SQL_LOGGIN === 'true') {
        console.log('Updated category with ID:' + categoryId);
    }

    return result.rows[0].id
}


export {
    getAllCategories,
    getAllCategoriesByProject,
    getAllProjectsByCategory,
    getCategoryById,
    assignCategoryToProject,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};  