package com.sms.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonSerializer;
import com.sms.dao.StudentDAO;
import com.sms.model.Student;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * StudentServlet - RESTful API controller for Student operations
 * FIXED: Added server-side validation; validation errors return HTTP 400
 *
 * Endpoints:
 *   GET    /api/students           → list all / search / filter
 *   GET    /api/students?id=N      → get by id
 *   POST   /api/students           → create
 *   PUT    /api/students           → update
 *   DELETE /api/students?id=N      → delete
 *   GET    /api/students/stats     → dashboard stats
 *   GET    /api/students/nextId    → get next student id
 */
@WebServlet("/api/students/*")
public class StudentServlet extends HttpServlet {

    private final StudentDAO studentDAO = new StudentDAO();
    private final Gson gson;

    public StudentServlet() {
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(LocalDate.class,
                (JsonSerializer<LocalDate>) (src, type, ctx) ->
                        ctx.serialize(src.toString()));
        builder.registerTypeAdapter(LocalDate.class,
                (JsonDeserializer<LocalDate>) (json, type, ctx) -> {
                    String s = json.getAsString();
                    if (s == null || s.isEmpty()) return null;
                    // FIX: handle both YYYY-MM-DD and DD-MM-YYYY formats from browser
                    try {
                        return LocalDate.parse(s);  // tries YYYY-MM-DD first
                    } catch (Exception e) {
                        try {
                            return LocalDate.parse(s, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                        } catch (Exception ex) {
                            return null;
                        }
                    }
                });
        // Serialize LocalDateTime → JSON string
        builder.registerTypeAdapter(LocalDateTime.class,
                (JsonSerializer<LocalDateTime>) (src, type, ctx) ->
                        ctx.serialize(src.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
        // FIX: Add missing LocalDateTime DESERIALIZER.
        // Without this, Gson tries to use reflection on LocalDateTime private fields
        // and throws: "Failed making field java.time.LocalDateTime#date accessible"
        builder.registerTypeAdapter(LocalDateTime.class,
                (JsonDeserializer<LocalDateTime>) (json, type, ctx) -> {
                    String s = json.getAsString();
                    if (s == null || s.isEmpty()) return null;
                    try {
                        return LocalDateTime.parse(s, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                    } catch (Exception e) {
                        try {
                            return LocalDate.parse(s).atStartOfDay();
                        } catch (Exception ex) {
                            return null;
                        }
                    }
                });
        gson = builder.setPrettyPrinting().create();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();

        try {
            if ("/stats".equals(pathInfo)) {
                Map<String, Object> stats = studentDAO.getDashboardStats();
                out.print(gson.toJson(stats));

            } else if ("/nextId".equals(pathInfo)) {
                Map<String, String> result = new HashMap<>();
                result.put("studentId", studentDAO.generateStudentId());
                out.print(gson.toJson(result));

            } else {
                String idParam  = req.getParameter("id");
                String search   = req.getParameter("search");
                String status   = req.getParameter("status");
                String deptParam = req.getParameter("departmentId");
                String gender   = req.getParameter("gender");

                if (idParam != null) {
                    Student s = studentDAO.getStudentById(Integer.parseInt(idParam));
                    if (s != null) {
                        out.print(gson.toJson(s));
                    } else {
                        resp.setStatus(404);
                        out.print(gson.toJson(error("Student not found")));
                    }
                } else if (search != null && !search.isEmpty()) {
                    List<Student> students = studentDAO.searchStudents(search);
                    out.print(gson.toJson(students));
                } else if (status != null || deptParam != null || gender != null) {
                    Integer deptId = (deptParam != null && !deptParam.isEmpty()) ?
                            Integer.parseInt(deptParam) : null;
                    List<Student> students = studentDAO.filterStudents(status, deptId, gender);
                    out.print(gson.toJson(students));
                } else {
                    List<Student> students = studentDAO.getAllStudents();
                    out.print(gson.toJson(students));
                }
            }
        } catch (Exception e) {
            resp.setStatus(500);
            out.print(gson.toJson(error("Server error: " + e.getMessage())));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            Student student = gson.fromJson(readBody(req), Student.class);

            String addError = studentDAO.addStudentWithError(student);
            if (addError == null) {
                resp.setStatus(201);
                out.print(gson.toJson(success("Student added successfully!", student)));
            } else if (addError.contains("student_id")) {
                resp.setStatus(409);
                out.print(gson.toJson(error("Student ID '" + student.getStudentId() + "' already exists. Please use a different ID.")));
            } else if (addError.contains("email")) {
                resp.setStatus(409);
                out.print(gson.toJson(error("Email '" + student.getEmail() + "' is already registered. This student may already exist.")));
            } else {
                resp.setStatus(400);
                out.print(gson.toJson(error("Failed to add student: " + addError)));
            }
        } catch (Exception e) {
            resp.setStatus(500);
            out.print(gson.toJson(error("Server error: " + e.getMessage())));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            Student student = gson.fromJson(readBody(req), Student.class);

            boolean success = studentDAO.updateStudent(student);
            if (success) {
                out.print(gson.toJson(success("Student updated", student)));
            } else {
                resp.setStatus(400);
                out.print(gson.toJson(error("Failed to update student — student may not exist")));
            }
        } catch (Exception e) {
            resp.setStatus(500);
            out.print(gson.toJson(error("Server error: " + e.getMessage())));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            String idParam = req.getParameter("id");
            if (idParam == null) {
                resp.setStatus(400);
                out.print(gson.toJson(error("ID is required")));
                return;
            }
            boolean success = studentDAO.deleteStudent(Integer.parseInt(idParam));
            if (success) {
                out.print(gson.toJson(success("Student deleted", null)));
            } else {
                resp.setStatus(404);
                out.print(gson.toJson(error("Student not found")));
            }
        } catch (Exception e) {
            resp.setStatus(500);
            out.print(gson.toJson(error("Server error: " + e.getMessage())));
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setStatus(200);
    }

    // ─── Validation ──────────────────────────────────────────────────────────

    /**
     * FIX: Server-side validation. Returns an error message string, or null if valid.
     */
    private String validate(Student s) {
        if (s == null)
            return "Request body is empty or invalid JSON";
        if (s.getFirstName() == null || s.getFirstName().isBlank())
            return "First name is required";
        if (s.getLastName() == null || s.getLastName().isBlank())
            return "Last name is required";
        if (s.getEmail() == null || !s.getEmail().contains("@"))
            return "A valid email address is required";
        if (s.getDepartmentId() <= 0)
            return "A valid department must be selected";
        if (s.getGpa() < 0 || s.getGpa() > 4.0)
            return "GPA must be between 0.00 and 4.00";
        return null; // all good
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private String readBody(HttpServletRequest req) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }
        return sb.toString();
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private Map<String, Object> error(String msg) {
        Map<String, Object> m = new HashMap<>();
        m.put("success", false);
        m.put("message", msg);
        return m;
    }

    private Map<String, Object> success(String msg, Object data) {
        Map<String, Object> m = new HashMap<>();
        m.put("success", true);
        m.put("message", msg);
        if (data != null) m.put("data", data);
        return m;
    }
}