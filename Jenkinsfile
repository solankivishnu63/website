pipeline {
    agent any

    environment {
        IMAGE_NAME = "vishnu353/website"        // Your DockerHub username/repo
        IMAGE_TAG  = "${BUILD_NUMBER}"          // Build number as image tag
    }

    stages {

        stage('Checkout Code') {
            steps {
                // Checkout the code from GitHub
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image from frontend-service directory
                sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ./frontend-service"
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',   // DockerHub credentials in Jenkins
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh """
                        # Login to DockerHub
                        echo \$PASSWORD | docker login -u \$USERNAME --password-stdin

                        # Tag latest
                        docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest

                        # Push both tags
                        docker push $IMAGE_NAME:$IMAGE_TAG
                        docker push $IMAGE_NAME:latest

                        # Logout
                        docker logout
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    # Update Kubernetes deployment with new image
                    kubectl set image deployment/website-deployment \
                    website=$IMAGE_NAME:$IMAGE_TAG \
                    -n chromosoft-ns
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully! 🚀"
        }
        failure {
            echo "Pipeline failed ❌"
        }
    }
}
