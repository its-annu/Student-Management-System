# Use Tomcat 9 with Java 11
FROM tomcat:9.0-jdk11

# Remove default Tomcat apps
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copy your built WAR file into Tomcat
COPY target/Student_Management_system.war /usr/local/tomcat/webapps/ROOT.war

# Railway uses dynamic PORT — tell Tomcat to use it
RUN sed -i 's/port="8080"/port="${PORT}"/' /usr/local/tomcat/conf/server.xml

# Start Tomcat
CMD ["catalina.sh", "run"]
