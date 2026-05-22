import db from "./db.js";

const getAllProjects = async () => {
    const query = `
        SELECT
            sp.title,
            sp.location,
            TO_CHAR(sp.service_date, 'YYYY-MM-DD') AS service_date,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o
        ON sp.organization_id = o.organization_id;
    `;

    const result = await db.query(query);
    return result.rows;   
}

export { getAllProjects }