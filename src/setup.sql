CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
) VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

CREATE TABLE service_project (
	id SERIAL PRIMARY KEY,
	organization_id INT, 
	title VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	location VARCHAR(150) NOT NULL,
	service_date DATE NOT NULL,

	CONSTRAINT fk_organization_id_organization_service_project 
	FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
); 


INSERT INTO service_project
(organization_id, title, description, location, service_date)
VALUES
-- BrightFuture Builders (organization_id = 1)
(
    1,
    'Community Playground Renovation',
    'Volunteers repair playground equipment, repaint structures, and improve safety surfaces for local children.',
    'San Lorenzo Community Park, Paraguay',
    '2026-06-15'
),
(
    1,
    'Safe Housing Repair Initiative',
    'Teams help low-income families by repairing roofs, doors, windows, and damaged walls in vulnerable homes.',
    'Luque, Paraguay',
    '2026-07-03'
),
(
    1,
    'Clean Water Access Project',
    'Installation of basic water filtration systems and maintenance of community water stations.',
    'Capiata, Paraguay',
    '2026-07-20'
),
(
    1,
    'School Classroom Restoration',
    'Volunteers repaint classrooms, repair desks, and improve learning spaces in public schools.',
    'Fernando de la Mora, Paraguay',
    '2026-08-08'
),
(
    1,
    'Solar Light Installation Campaign',
    'The project installs solar-powered lights in public gathering areas to improve safety and sustainability.',
    'Itaugua, Paraguay',
    '2026-08-28'
),

-- GreenHarvest Growers (organization_id = 2)
(
    2,
    'Urban Garden Expansion',
    'Volunteers create new community garden plots and teach residents how to grow vegetables sustainably.',
    'Asuncion, Paraguay',
    '2026-06-10'
),
(
    2,
    'Neighborhood Tree Planting Day',
    'Community members plant native trees to improve air quality and provide shade in urban areas.',
    'Nemby, Paraguay',
    '2026-06-26'
),
(
    2,
    'School Compost Education Program',
    'Students learn composting techniques while building compost bins for their schools.',
    'San Antonio, Paraguay',
    '2026-07-12'
),
(
    2,
    'Sustainable Farming Workshop',
    'Local farmers receive training on eco-friendly farming methods and water conservation practices.',
    'Aregua, Paraguay',
    '2026-08-02'
),
(
    2,
    'Community Farmers Market Support',
    'Volunteers organize and support a local farmers market promoting healthy and locally grown foods.',
    'Lambare, Paraguay',
    '2026-08-22'
),

-- UnityServe Volunteers (organization_id = 3)
(
    3,
    'Senior Care Visit Program',
    'Volunteers visit elderly residents to provide companionship, recreational activities, and basic assistance.',
    'Villa Elisa, Paraguay',
    '2026-06-18'
),
(
    3,
    'Back-to-School Supply Drive',
    'Collection and distribution of school supplies for children from low-income families.',
    'Mariano Roque Alonso, Paraguay',
    '2026-07-05'
),
(
    3,
    'Community Food Distribution Event',
    'Volunteers prepare and distribute food packages to families facing economic hardship.',
    'Limpio, Paraguay',
    '2026-07-25'
),
(
    3,
    'Youth Mentorship and Tutoring Program',
    'College students and professionals mentor teenagers and provide academic tutoring sessions.',
    'San Lorenzo, Paraguay',
    '2026-08-14'
),
(
    3,
    'Public Park Cleanup Campaign',
    'Volunteers clean public parks, collect waste, and promote environmental awareness in the community.',
    'Capiata, Paraguay',
    '2026-09-01'
);

CREATE TABLE category (
	id SERIAL PRIMARY KEY,
	category VARCHAR(100) NOT NULL
);

CREATE TABLE project_category (
	id_category INT NOT NULL,
	id_project INT NOT NULL,

	PRIMARY KEY (id_category, id_project),

	CONSTRAINT fk_id_project_project_category_service_project 
	FOREIGN KEY (id_project) REFERENCES service_project(id) ON DELETE CASCADE,

	CONSTRAINT fk_id_category_project_category_category
	FOREIGN KEY (id_category) REFERENCES category(id) ON DELETE CASCADE
);

INSERT INTO category (category) VALUES
('Infrastructure & Housing'),
('Environment & Sustainability'),
('Community Support & Welfare');

INSERT INTO project_category (id_category, id_project) VALUES
(1, 1), 
(1, 2), 
(1, 3), 
(1, 4), 
(1, 5), 

(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),


(3, 11),
(3, 12),
(3, 13),
(3, 14),
(2, 15);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
