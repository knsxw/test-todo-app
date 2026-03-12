pipeline { 
    // This allocates a base node and workspace for the whole pipeline
    agent any 

    environment { 
        DOCKER_HUB_USER = 'knsxw' 
        IMAGE_NAME = 'test-todo-app' 
        DOCKER_HUB_CREDS = 'docker-hub-credentials' 
    } 

    stages { 
        stage('Build') { 
            agent {
                docker {
                    // You can change '20' to whichever Node version your app needs
                    image 'node:20-alpine' 
                    // Ensures the container uses the same workspace containing your code
                    reuseNode true 
                }
            }
            steps { 
                echo 'Building the application...' 
                sh 'npm install' 
            } 
        } 

        stage('Test') { 
            agent {
                docker {
                    image 'node:20-alpine'
                    reuseNode true
                }
            }
            steps { 
                echo 'Running unit tests...' 
                sh 'npm test' 
            } 
        } 

        stage('Containerize') { 
            // This stage inherits 'agent any' from the top level, 
            // meaning it runs on the Jenkins host where the Docker CLI is available.
            steps { 
                echo 'Creating Docker image...' 
                sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest ." 
            } 
        } 

        stage('Push') { 
            // Inherits 'agent any'
            steps { 
                echo 'Logging into Docker Hub and pushing image...' 
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) { 
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin" 
                    sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest" 
                } 
            } 
        } 
    } 

    post { 
        always { 
            echo 'Cleaning up workspace...' 
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest || true" 
        } 
    } 
}