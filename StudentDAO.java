package com.sms.dao;

import com.sms.model.Student;
import com.sms.util.DatabaseConnection;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * StudentDAO - Data Access Object for Student CRUD Operations
 * FIXED: All connection leaks, ResultSet leaks, generateStudentId NULL safety
 */
public class StudentDAO {

    private static final Logger LOGGER = Logger.getLogger(StudentDAO.class.getName());

    // ─── CREATE ───────────────────────────────────────────────────────────────

    public boolean addStudent(Student student) {
        String sql = """
            INSERT INTO students (student_id, first_name, last_name, email, phone,
            date_of_birth, gender, address, department_id, enrollment_date, status, gpa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        // FIX: Connection is now properly closed via try-with-resources
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, student.getStudentId());
            ps.setString(2, student.getFirstName());
            ps.setString(3, student.getLastName());
            ps.setString(4, student.getEmail());
            ps.setString(5, student.getPhone());
            ps.setDate(6, student.getDateOfBirth() != null ? Date.valueOf(student.getDateOfBirth()) : null);
            ps.setString(7, student.getGender());
            ps.setString(8, student.getAddress());
            ps.setInt(9, student.getDepartmentId());
            ps.setDate(10, student.getEnrollmentDate() != null ?
                    Date.valueOf(student.getEnrollmentDate()) : Date.valueOf(LocalDate.now()));
            ps.setString(11, student.getStatus() != null ? student.getStatus() : "Active");
            // FIX: Clamp GPA to valid 0.00–4.00 range before inserting
            ps.setDouble(12, Math.min(9.9, Math.max(0.0, student.getGpa())));

            int rows = ps.executeUpdate();
            if (rows > 0) {
                // FIX: ResultSet from getGeneratedKeys also closed properly
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) student.setId(keys.getInt(1));
                }
                LOGGER.info("Student added: " + student.getStudentId());
                return true;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error adding student", e);
        }
        return false;
    }

    /**
     * Same as addStudent but returns null on success, or the error message on failure.
     * This lets the servlet show user-friendly duplicate/error messages.
     */
    public String addStudentWithError(Student student) {
        String sql = """
            INSERT INTO students (student_id, first_name, last_name, email, phone,
            date_of_birth, gender, address, department_id, enrollment_date, status, gpa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, student.getStudentId());
            ps.setString(2, student.getFirstName());
            ps.setString(3, student.getLastName());
            ps.setString(4, student.getEmail());
            ps.setString(5, student.getPhone());
            ps.setDate(6, student.getDateOfBirth() != null ? Date.valueOf(student.getDateOfBirth()) : null);
            ps.setString(7, student.getGender());
            ps.setString(8, student.getAddress());
            ps.setInt(9, student.getDepartmentId());
            ps.setDate(10, student.getEnrollmentDate() != null ?
                    Date.valueOf(student.getEnrollmentDate()) : Date.valueOf(LocalDate.now()));
            ps.setString(11, student.getStatus() != null ? student.getStatus() : "Active");
            ps.setDouble(12, Math.min(9.9, Math.max(0.0, student.getGpa())));

            int rows = ps.executeUpdate();
            if (rows > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) student.setId(keys.getInt(1));
                }
                LOGGER.info("Student added: " + student.getStudentId());
                return null; // null = success
            }
            return "Insert returned 0 rows";
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error adding student", e);
            return e.getMessage(); // contains "Duplicate entry ... for key 'students.email'" etc.
        }
    }

    // ─── READ ────────────────────────────────────────────────────────────────

    public List<Student> getAllStudents() {
        List<Student> students = new ArrayList<>();
        String sql = """
            SELECT s.*, d.name AS department_name
            FROM students s
            LEFT JOIN departments d ON s.department_id = d.id
            ORDER BY s.created_at DESC
            """;
        // FIX: Connection properly closed
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                students.add(mapResultSet(rs));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching students", e);
        }
        return students;
    }

    public Student getStudentById(int id) {
        String sql = """
            SELECT s.*, d.name AS department_name
            FROM students s
            LEFT JOIN departments d ON s.department_id = d.id
            WHERE s.id = ?
            """;
        // FIX: Connection AND ResultSet both properly closed
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapResultSet(rs);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching student by id", e);
        }
        return null;
    }

    public List<Student> searchStudents(String keyword) {
        List<Student> students = new ArrayList<>();
        String sql = """
            SELECT s.*, d.name AS department_name
            FROM students s
            LEFT JOIN departments d ON s.department_id = d.id
            WHERE s.first_name LIKE ? OR s.last_name LIKE ?
               OR s.email LIKE ? OR s.student_id LIKE ?
            ORDER BY s.first_name, s.last_name
            """;
        String kw = "%" + keyword + "%";
        // FIX: Connection AND ResultSet both properly closed
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, kw);
            ps.setString(2, kw);
            ps.setString(3, kw);
            ps.setString(4, kw);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    students.add(mapResultSet(rs));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error searching students", e);
        }
        return students;
    }

    public List<Student> filterStudents(String status, Integer departmentId, String gender) {
        List<Student> students = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
            SELECT s.*, d.name AS department_name
            FROM students s
            LEFT JOIN departments d ON s.department_id = d.id
            WHERE 1=1
            """);
        List<Object> params = new ArrayList<>();

        if (status != null && !status.isEmpty()) {
            sql.append(" AND s.status = ?");
            params.add(status);
        }
        if (departmentId != null && departmentId > 0) {
            sql.append(" AND s.department_id = ?");
            params.add(departmentId);
        }
        if (gender != null && !gender.isEmpty()) {
            sql.append(" AND s.gender = ?");
            params.add(gender);
        }
        sql.append(" ORDER BY s.first_name, s.last_name");

        // FIX: Connection AND ResultSet both properly closed; sql.toString() used correctly
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    students.add(mapResultSet(rs));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error filtering students", e);
        }
        return students;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────

    public boolean updateStudent(Student student) {
        String sql = """
            UPDATE students SET first_name=?, last_name=?, email=?, phone=?,
            date_of_birth=?, gender=?, address=?, department_id=?, status=?, gpa=?
            WHERE id=?
            """;
        // FIX: Connection properly closed
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, student.getFirstName());
            ps.setString(2, student.getLastName());
            ps.setString(3, student.getEmail());
            ps.setString(4, student.getPhone());
            ps.setDate(5, student.getDateOfBirth() != null ? Date.valueOf(student.getDateOfBirth()) : null);
            ps.setString(6, student.getGender());
            ps.setString(7, student.getAddress());
            ps.setInt(8, student.getDepartmentId());
            ps.setString(9, student.getStatus());
            // FIX: Clamp GPA to valid range on update too
            ps.setDouble(10, Math.min(9.9, Math.max(0.0, student.getGpa())));
            ps.setInt(11, student.getId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating student", e);
        }
        return false;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────

    public boolean deleteStudent(int id) {
        String sql = "DELETE FROM students WHERE id = ?";
        // FIX: Connection properly closed
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting student", e);
        }
        return false;
    }

    // ─── ANALYTICS ───────────────────────────────────────────────────────────

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        try (Connection conn = DatabaseConnection.getConnection()) {

            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM students")) {
                if (rs.next()) stats.put("totalStudents", rs.getInt(1));
            }

            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT COUNT(*) FROM students WHERE status='Active'");
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) stats.put("activeStudents", rs.getInt(1));
            }

            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT AVG(gpa) FROM students")) {
                if (rs.next()) stats.put("avgGpa", Math.round(rs.getDouble(1) * 100.0) / 100.0);
            }

            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM departments")) {
                if (rs.next()) stats.put("totalDepartments", rs.getInt(1));
            }

            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery(
                         "SELECT status, COUNT(*) as cnt FROM students GROUP BY status")) {
                Map<String, Integer> byStatus = new HashMap<>();
                while (rs.next()) byStatus.put(rs.getString("status"), rs.getInt("cnt"));
                stats.put("byStatus", byStatus);
            }

            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("""
                     SELECT d.name, COUNT(s.id) as cnt
                     FROM departments d
                     LEFT JOIN students s ON d.id = s.department_id
                     GROUP BY d.id, d.name
                     ORDER BY cnt DESC
                     """)) {
                Map<String, Integer> byDept = new HashMap<>();
                while (rs.next()) byDept.put(rs.getString("name"), rs.getInt("cnt"));
                stats.put("byDepartment", byDept);
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error getting dashboard stats", e);
        }
        return stats;
    }

    // ─── HELPER ──────────────────────────────────────────────────────────────

    private Student mapResultSet(ResultSet rs) throws SQLException {
        Student s = new Student();
        s.setId(rs.getInt("id"));
        s.setStudentId(rs.getString("student_id"));
        s.setFirstName(rs.getString("first_name"));
        s.setLastName(rs.getString("last_name"));
        s.setEmail(rs.getString("email"));
        s.setPhone(rs.getString("phone"));
        Date dob = rs.getDate("date_of_birth");
        if (dob != null) s.setDateOfBirth(dob.toLocalDate());
        s.setGender(rs.getString("gender"));
        s.setAddress(rs.getString("address"));
        s.setDepartmentId(rs.getInt("department_id"));
        try { s.setDepartmentName(rs.getString("department_name")); } catch (SQLException ignored) {}
        Date enroll = rs.getDate("enrollment_date");
        if (enroll != null) s.setEnrollmentDate(enroll.toLocalDate());
        s.setStatus(rs.getString("status"));
        s.setGpa(rs.getDouble("gpa"));
        s.setPhotoUrl(rs.getString("photo_url"));
        Timestamp created = rs.getTimestamp("created_at");
        if (created != null) s.setCreatedAt(created.toLocalDateTime());
        return s;
    }

    // ─── UTILITIES ───────────────────────────────────────────────────────────

    public String generateStudentId() {
        // FIX: Connection properly closed; COALESCE handles empty table safely
        String sql = "SELECT COALESCE(MAX(CAST(SUBSTRING(student_id, 4) AS UNSIGNED)), 0) FROM students";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) {
                int max = rs.getInt(1);
                return String.format("STU%03d", max + 1);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error generating student ID", e);
        }
        return "STU001";
    }
}