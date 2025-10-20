CREATE DATABASE EcommerceWeb;
GO

CREATE LOGIN webAdmin WITH PASSWORD = 'webAdmin';
GO

USE EcommerceWeb;
GO

CREATE USER webAdmin FOR LOGIN webAdmin;
ALTER ROLE db_owner ADD MEMBER webAdmin;