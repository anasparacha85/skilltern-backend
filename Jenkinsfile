pipeline {
    agent any

    environment {
        IMAGE_NAME     = "skilltern-backend"
        CONTAINER_NAME = "skilltern-backend-container"
        HOST_PORT      = "5000"
        CONTAINER_PORT = "5001"
        ENV_FILE       = ".env"
    }

    parameters {
        string(
            name: 'BRANCH_NAME',
            defaultValue: 'main',
            description: 'Branch to build from'
        )
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out branch ${params.BRANCH_NAME}..."
                git branch: "${params.BRANCH_NAME}",
                    url: 'https://github.com/anasparacha85/skilltern-backend.git'
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
                    echo "🛑 Checking & stopping old container ${CONTAINER_NAME}..."

                    // Use a more robust approach with error handling
                    def containerExists = bat(
                        script: "docker inspect ${CONTAINER_NAME} > nul 2>&1",
                        returnStatus: true
                    ) == 0

                    if (containerExists) {
                        echo "Container exists. Stopping and removing..."
                        bat "docker stop ${CONTAINER_NAME} || exit /b 0"
                        bat "docker rm ${CONTAINER_NAME} || exit /b 0"
                        echo "✅ Old container removed successfully"
                    } else {
                        echo "No existing container found. Continuing..."
                    }
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    echo "🚀 Running new container ${CONTAINER_NAME}..."

                    // First check if port is already in use
                    def portCheck = bat(
                        script: "netstat -ano | findstr :${HOST_PORT}",
                        returnStatus: true
                    )

                    if (portCheck == 0) {
                        echo "⚠️ Port ${HOST_PORT} is already in use. Attempting to free it..."
                        bat """
                        for /f "tokens=5" %a in ('netstat -ano ^| findstr :${HOST_PORT}') do (
                            taskkill /F /PID %a > nul 2>&1
                        )
                        """
                    }

                    bat """
                    docker run -d ^
                    --name ${CONTAINER_NAME} ^
                    --env-file ${ENV_FILE} ^
                    -p ${HOST_PORT}:${CONTAINER_PORT} ^
                    ${IMAGE_NAME}
                    
                    if %ERRORLEVEL% NEQ 0 (
                        echo ❌ Failed to start container
                        exit /b 1
                    ) else (
                        echo ✅ Container started successfully
                        exit /b 0
                    )
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "❤️ Checking app health..."

                    def maxRetries = 10
                    def retryCount = 0
                    def healthy = false

                    while (retryCount < maxRetries && !healthy) {
                        bat 'timeout /t 3 /nobreak > nul'
                        
                        // Use PowerShell for better HTTP checking
                        def result = powershell(
                            script: """
                            try {
                                \$response = Invoke-WebRequest -Uri http://localhost:${HOST_PORT} -TimeoutSec 2 -UseBasicParsing
                                if (\$response.StatusCode -eq 200) { exit 0 } else { exit 1 }
                            } catch {
                                exit 1
                            }
                            """,
                            returnStatus: true
                        )

                        if (result == 0) {
                            healthy = true
                            echo "✅ App is responding!"
                        } else {
                            retryCount++
                            echo "⚠️ App not ready yet, retry ${retryCount}/${maxRetries}..."
                        }
                    }

                    if (!healthy) {
                        echo "❌ App did not respond after ${maxRetries * 3} seconds"
                        echo "📋 Last container logs:"
                        bat "docker logs ${CONTAINER_NAME} --tail 50"
                        error "Health check failed"
                    }
                }
            }
        }

        stage('Verify Logs') {
            steps {
                echo "🔍 Checking container logs..."
                bat "docker logs ${CONTAINER_NAME} --tail 50 || echo No logs available"
            }
        }
    }

    post {
        always {
            script {
                // Check container status in post-build
                def containerRunning = bat(
                    script: "docker ps -q -f name=${CONTAINER_NAME}",
                    returnStatus: true
                ) == 0
                
                if (containerRunning) {
                    echo "✅ Container is still running"
                } else {
                    echo "⚠️ Container is not running"
                    // Show last logs if container exists but not running
                    bat "docker logs ${CONTAINER_NAME} --tail 20 2>&1 || echo Container logs not available"
                }
            }
        }
        success {
            echo "✅ App successfully deployed on port ${HOST_PORT}!"
        }
        failure {
            echo "❌ Build or deployment failed"
        }
    }
}