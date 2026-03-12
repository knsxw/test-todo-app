pipeline { 
    agent any 

    environment { 
        // Replace with your actual Docker Hub username 
        DOCKER_HUB_USER = 'knsxw' 
        IMAGE_NAME = 'test-todo-app' 
        // This ID must match the Credential ID created in Jenkins (Username with Password) 
        DOCKER_HUB_CREDS = 'docker-hub-credentials' 
    } 

    stages { 
        stage('Build') { 
            steps { 
                echo 'Building the application...' 
                // Install dependencies 
                sh 'npm install' 
            } 
        } 

        stage('Test') { 
            steps { 
                echo 'Running unit tests...' 
                // If tests fail here, the pipeline will stop automatically 
                sh 'npm test' 
            } 
        } 

        stage('Containerize') { 
            steps { 
                echo 'Creating Docker image...' 
                // Build the image using the Dockerfile in the root directory 
                sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest ." 
            } 
        } 

        stage('Push') { 
            steps { 
                echo 'Logging into Docker Hub and pushing image...' 
                // Using Jenkins Credentials Provider to avoid hardcoding passwords 
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
            // Optional: remove the local image to save disk space on Jenkins node 
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest || true" 
        } 
    } 
}