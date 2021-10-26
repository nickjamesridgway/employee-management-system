USE management_db;

INSERT INTO department (name)
VALUES 
('Information Technology'),
('Finance'),
('Legal'),
('Human Resources'),
('Security'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Web Developer', 100000, 1),
('Accountant', 80000, 2),
('Paralegal', 65000, 3),
('Manager', 85000, 4),
('Engineer', 100000, 5),
('Sales Rep', 60000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('James', 'Jameson', 1, 1),
('Jack', 'Jackson', 2, null),
('John', 'Johnson', 3, 3),
('Will', 'Wilson', 4, null),
('Jeff', 'Jefferson', 5, null),
('Dawn', 'Dawson', 6, 6);