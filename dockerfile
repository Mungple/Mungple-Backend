FROM openjdk:17-jdk-slim
WORKDIR /home/ubuntu/app

COPY mungplace-0.0.1-SNAPSHOT.jar ./

COPY application-prod.yml ./
COPY application-secret.yml ./

ENTRYPOINT ["java", "-jar", "mungplace-0.0.1-SNAPSHOT.jar"]