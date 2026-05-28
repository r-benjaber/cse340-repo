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

export { getAllProjects, getProjectsByOrganizationId };