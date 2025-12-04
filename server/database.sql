-- Script SQL para crear la base de datos y tablas manualmente
-- Ejecutar este script en SQL Server Management Studio si prefieres crear las tablas manualmente

USE CemacoDB;
GO

-- Crear tabla Users
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Username] NVARCHAR(100) NOT NULL UNIQUE,
        [Email] NVARCHAR(255) NOT NULL UNIQUE,
        [Password] NVARCHAR(255) NOT NULL,
        [Role] NVARCHAR(50) NOT NULL CHECK ([Role] IN ('Administrador', 'Colaborador')),
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        [UpdatedAt] DATETIME DEFAULT GETDATE()
    )
END
GO

-- Crear tabla Products
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Products] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Name] NVARCHAR(255) NOT NULL,
        [Description] NVARCHAR(MAX),
        [Price] DECIMAL(18,2) NOT NULL,
        [SKU] NVARCHAR(100) NOT NULL UNIQUE,
        [Inventory] INT NOT NULL DEFAULT 0,
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        [UpdatedAt] DATETIME DEFAULT GETDATE()
    )
END
GO

-- Crear tabla ProductImages para múltiples imágenes por producto
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProductImages]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ProductImages] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [ProductId] INT NOT NULL,
        [ImagePath] NVARCHAR(500) NOT NULL,
        [DisplayOrder] INT NOT NULL DEFAULT 0,
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        CONSTRAINT [FK_ProductImages_Products] FOREIGN KEY ([ProductId]) 
            REFERENCES [dbo].[Products]([Id]) ON DELETE CASCADE
    )
END
GO
