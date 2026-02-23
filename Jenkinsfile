pipeline {
    agent any

    environment {
        IMAGE_NAME = "skilltern-backend"
        CONTAINER_NAME = "skilltern-backend-container"
        HOST_PORT = "5000"
        CONTAINER_PORT = "5001"
        ENV_FILE = ".env"
    }

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build from')
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out branch ${params.BRANCH_NAME}..."
                git branch: "${params.BRANCH_NAME}", url: 'https://github.com/anasparacha85/skilltern-backend.git'
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
                    echo "🛑 Stopping old container ${CONTAINER_NAME}..."
                    bat """
                    docker stop ${CONTAINER_NAME} || echo No existing container to stop
                    docker rm ${CONTAINER_NAME} || echo No existing container to remove
                    """
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    echo "🚀 Running new container ${CONTAINER_NAME}..."
                    bat """
                    docker run -d ^
                    --name ${CONTAINER_NAME} ^
                    --env-file ${ENV_FILE} ^
                    -p ${HOST_PORT}:${CONTAINER_PORT} ^
                    ${IMAGE_NAME}
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                echo "❤️ Checking app health..."
                script {
                    def maxRetries = 10
                    def retryCount = 0
                    def healthy = false

                    while (retryCount < maxRetries && !healthy) {
                        bat 'ping 127.0.0.1 -n 4 > nul'
                        def result = bat(script: "curl -s -o nul http://localhost:${HOST_PORT}", returnStatus: true)
                        if (result == 0) {
                            healthy = true
                            echo "✅ App is responding!"
                        } else {
                            retryCount++
                            echo "⚠️ App not ready yet, retry ${retryCount}/${maxRetries}..."
                        }
                    }

                    if (!healthy) {
                        error "❌ App did not respond after ${maxRetries * 3} seconds"
                    }
                }
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
            echo "✅ App successfully deployed on port ${HOST_PORT}!"
        }
        failure {
            echo "❌ Build or deployment failed"
        }
    }
} // <-- final closing brace