pipeline {
    agent any


    environment {
        IMAGE_NAME = "skilltern-backend"
        CONTAINER_NAME = "skilltern-backend-container"
        PORT = "5000"
        ENV_FILE = ".env"
    }
    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build from')
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out branch ${params.BRANCH_NAME}..."
                git branch: "${params.BRANCH_NAME}", url: 'https://github.com/anasparacha85/Skillternabackend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "📦 Building Docker image ${IMAGE_NAME}..."
                    bat "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Stop Old Container (if any)') {
            steps {
                script {
                    echo "🛑 Stopping old container ${CONTAINER_NAME} if exists..."
                    bat """
                    docker stop ${CONTAINER_NAME} || echo "No existing container to stop"
                    docker rm ${CONTAINER_NAME} || echo "No existing container to remove"
                    """
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    echo "🚀 Running new container ${CONTAINER_NAME}..."
                    bat """
                    docker run -d \
                    --name ${CONTAINER_NAME} \
                    --env-file ${ENV_FILE} \
                    -p ${PORT}:${PORT} \
                    ${IMAGE_NAME}
                    """
                }
            }
        }
        stage('Health Check') {
            steps {
                echo "❤️ Checking app health"
                bat """
                timeout /t 10
                curl http://localhost:${PORT} || exit 1
                """
            }
        }

        stage('Verify Logs') {
            steps {
                echo "🔍 Checking container logs..."
                bat "docker logs ${CONTAINER_NAME} --tail 20"
            }
        }
    }

    post {
        success {
            echo "✅ App successfully deployed on port ${PORT}"
        }
        failure {
            echo "❌ Build or deployment failed"
        }
    }
}
