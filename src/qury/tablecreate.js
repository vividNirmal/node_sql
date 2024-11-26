const Database =process.env.AZURE_SQL_DATABASE


export const AuthTableCreate =`CREATE TABLE ${Database}.dbo.AuthTable (
  id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`

export const tablecreateNotavaible =`
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AuthTable') BEGIN 
  CREATE TABLE ${Database}.dbo.AuthTable (
    id INT PRIMARY KEY IDENTITY(1, 1),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`