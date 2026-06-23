
CREATE DATABASE IF NOT EXISTS autopart_pro;


USE autopart_pro;

-- Esto es una prueba de conexión de la DB al backend
CREATE TABLE IF NOT EXISTS test_connection (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO test_connection (status_message) VALUES ('¡Conexión de la Fase 1 exitosa desde la DB!');