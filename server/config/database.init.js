const { getConnection, sql } = require("./database");

const initializeDatabase = async () => {
  try {
    const pool = await getConnection();
    const request = pool.request();

    await request.query(`
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
    `);

    await request.query(`
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
    `);

    await request.query(`
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
    `);

    const bcrypt = require("bcryptjs");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const colaboradorPassword = await bcrypt.hash("colaborador123", 10);

    const checkAdmin = await request.query(`
      SELECT COUNT(*) as count FROM [dbo].[Users] WHERE [Username] = 'admin'
    `);

    if (checkAdmin.recordset[0].count === 0) {
      const insertRequest = pool.request();
      insertRequest.input("username", sql.NVarChar, "admin");
      insertRequest.input("email", sql.NVarChar, "admin@cemaco.com");
      insertRequest.input("password", sql.NVarChar, adminPassword);
      insertRequest.input("role", sql.NVarChar, "Administrador");

      await insertRequest.query(`
        INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [Role])
        VALUES (@username, @email, @password, @role)
      `);

      console.log("Default admin user created: admin / admin123");
    }

    const checkColaborador = await request.query(`
      SELECT COUNT(*) as count FROM [dbo].[Users] WHERE [Username] = 'colaborador'
    `);

    if (checkColaborador.recordset[0].count === 0) {
      const insertRequest = pool.request();
      insertRequest.input("username", sql.NVarChar, "colaborador");
      insertRequest.input("email", sql.NVarChar, "colaborador@cemaco.com");
      insertRequest.input("password", sql.NVarChar, colaboradorPassword);
      insertRequest.input("role", sql.NVarChar, "Colaborador");

      await insertRequest.query(`
        INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [Role])
        VALUES (@username, @email, @password, @role)
      `);

      console.log(
        "Default colaborador user created: colaborador / colaborador123"
      );
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

module.exports = { initializeDatabase };
