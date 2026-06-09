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

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          id,
          organization_id,
          title,
          description,
          location,
          service_date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY service_date;
      `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT sp.id, sp.title, sp.description, sp.service_date, sp.location, sp.organization_id, o.name AS organization_name
        FROM service_project sp
        JOIN organization o ON o.organization_id = sp.organization_id
        WHERE sp.service_date >= NOW()
        ORDER BY service_date
        LIMIT $1;
    `;
    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT sp.id, sp.title, sp.description, sp.service_date, sp.location, sp.organization_id, o.name AS organization_name
        FROM service_project sp
        JOIN organization o ON o.organization_id = sp.organization_id
        WHERE sp.id = $1;
    `;
    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO service_project (title, description, location, service_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].id;
}

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject };