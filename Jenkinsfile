pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "vishnu353/chromosoft"
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh """
                    echo \$PASSWORD | docker login -u \$USERNAME --password-stdin
                    """
                }
            }
        }

        stage('Push Image') {
            steps {
                sh """
                docker push $DOCKER_IMAGE:$DOCKER_TAG
                docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_IMAGE:latest
                docker push $DOCKER_IMAGE:latest
                """
            }
        }
    }

    post {
        always {
            sh "docker logout"
        }
        success {
            echo "Image pushed successfully 🚀"
        }
        failure {
            echo "Build failed ❌"
        }
    }
}
