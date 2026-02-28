/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sms.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DatabaseConnection — provides a JDBC connection to MySQL.
 * Package: com.sms.util  (matches your project structure)
 *
 * SETUP BEFORE RUNNING:
 *   1. Create MySQL database:  student_management
 *   2. Change DB_USER / DB_PASS to your MySQL credentials
 *   3. Confirm mysql-connector-j-9.3.0.jar is in Libraries (it is ✓)
 */
public class DatabaseConnection {

    // ── Edit these to match your MySQL setup ─────────────────────────────────
    private static final String DB_URL  = "jdbc:mysql://localhost:3306/student_management"
                                        + "?useSSL=false&serverTimezone=UTC"
                                        + "&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";   // your MySQL username
    private static final String DB_PASS = "123456";        // your MySQL password
    // ─────────────────────────────────────────────────────────────────────────

    static {
        try {
            // MySQL Connector/J 9.x driver class
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(
                "MySQL JDBC Driver not found — " +
                "verify mysql-connector-j-9.3.0.jar is in Libraries.", e);
        }
    }

    /**
     * Returns a fresh Connection. Always close it after use — best with try-with-resources.
     * Example:
     *   try (Connection conn = DatabaseConnection.getConnection()) { ... }
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }
}
