/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sms.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class DatabaseConnection {

    
    private static final String DB_URL  = "https://student-management-system-production-f623.up.railway.app/";
    private static final String DB_USER = "root";   //  MySQL username
    private static final String DB_PASS = "123456";        // password
    // ─────────────────────────────────────────────────────────────────────────

    static {
        try {
            
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(
                "MySQL JDBC Driver not found — " +
                "verify mysql-connector-j-9.3.0.jar is in Libraries.", e);
        }
    }

    
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }
}
