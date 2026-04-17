import { Pool } from 'pg';

const createTables = async () => {

    await Pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(45) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            hashedPassword VARCHAR(255) NOT NULL,
            phone VARCHAR(15) UNIQUE NOT NULL,
            role VARCHAR(20) DEFAULT 'Customer',
            hashedVerificationToken VARCHAR(255),
            refreshToken VARCHAR(255),
            hashedResetToken VARCHAR(255),
            isVerified BOOLEAN DEFAULT FALSE
        );
    `);

 
    await Pool.query(`
        CREATE TABLE IF NOT EXISTS seats (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            isbooked INT DEFAULT 0,
            user_id INT REFERENCES users(id) -- This is how you do Foreign Keys in SQL!
        );
    `);
}

export { createTables };
