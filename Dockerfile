# Use Tomcat 9 with Java 11
FROM tomcat:9.0-jdk11

# Remove default apps
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copy WAR file
COPY target/Student_Management_system.war /usr/local/tomcat/webapps/ROOT.war

# Set default port (Railway overrides this with its own PORT)
ENV PORT=8080

# Use a startup script to dynamically set the port
CMD sed -i "s/port=\"8080\"/port=\"${PORT}\"/" /usr/local/tomcat/conf/server.xml && catalina.sh run
