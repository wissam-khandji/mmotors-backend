# Étape 1 : Construction (Build) avec Maven
FROM maven:3.8.5-openjdk-17 AS build
# On travaille dans le dossier backend car c'est le Root Directory sur Render
COPY . .
# On lance le build Maven
RUN mvn clean package -DskipTests

# Étape 2 : Exécution (Run)
# Utilisation d'une image stable et maintenue (Eclipse Temurin)
FROM eclipse-temurin:17-jre-jammy
# On récupère le fichier .jar généré à l'étape précédente
COPY --from=build /target/*.jar app.jar
# On expose le port 8080
EXPOSE 8080
# On lance l'application
ENTRYPOINT ["java","-jar","/app.jar"]