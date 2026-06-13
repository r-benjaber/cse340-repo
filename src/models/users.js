import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordMatch = await verifyPassword(password, user.password_hash);
    
    if (passwordMatch) {
        delete user.password_hash;
        return user;
    }

    return null;
};

const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
    `;

    const result = await db.query(query);

    if (!result || !result.rows) {
        return [];
    }

    return result.rows;
};

const volunteer = async (projectId, userId) => {
    const query = `
        INSERT INTO volunteer (project_id, user_id)
        VALUES ($1, $2);
    `;

    const queryParams = [projectId, userId];
    await db.query(query, queryParams);
};

const removeVolunteer = async (projectId, userId) => {
    const query = `
        DELETE FROM volunteer
        WHERE project_id = $1
            AND user_id = $2;
    `;

    const queryParams = [projectId, userId];
    await db.query(query, queryParams);
};

const getAllVolunteeredProjects = async (userId) => {
    const query = `
        SELECT sp.id, sp.title, sp.description, sp.location, sp.service_date
        FROM volunteer v
        JOIN service_project sp ON sp.id = v.project_id
        WHERE v.user_id = $1;
    `;

    const result = await db.query(query, [userId]);

    return result.rows;
};

const isVolunteered = async (projectId, userId) => {
    const query = `
        SELECT 1 FROM volunteer
        WHERE project_id = $1
        AND user_id = $2; 
    `;

    const queryParams = [projectId, userId];
    const result = await db.query(query, queryParams);

    return result.rowCount > 0;
}

export {
    createUser,
    authenticateUser,
    getAllUsers,
    volunteer,
    removeVolunteer,
    getAllVolunteeredProjects,
    isVolunteered
};