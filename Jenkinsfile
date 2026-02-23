pipeline {
    agent any

    environment {
        IMAGE_NAME     = "skilltern-backend"
        CONTAINER_NAME = "skilltern-backend-container"
        HOST_PORT      = "8081"
        CONTAINER_PORT = "5003"
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

                    // First check if port is already in use - using PowerShell instead of batch for complex operations
                    def portInUse = powershell(
                        script: """
                        \$portInUse = netstat -ano | Select-String ":${HOST_PORT} "
                        if (\$portInUse) {
                            Write-Host "Port ${HOST_PORT} is in use"
                            \$processIds = \$portInUse | ForEach-Object { \$_ -split ' ' | Select-Object -Last 1 }
                            \$processIds | ForEach-Object {
                                try {
                                    Stop-Process -Id \$_ -Force -ErrorAction SilentlyContinue
                                    Write-Host "Killed process with PID: \$_"
                                } catch {
                                    # Process might already be terminated
                                }
                            }
                            Write-Host "Port ${HOST_PORT} freed successfully"
                            exit 0
                        } else {
                            Write-Host "Port ${HOST_PORT} is free"
                            exit 0
                        }
                        """,
                        returnStatus: true
                    )

                    // Now run the container
                    def runResult = bat(
                        script: """
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
                        """,
                        returnStatus: true
                    )

                    if (runResult != 0) {
                        error "Failed to start container"
                    }
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
                        powershell 'Start-Sleep -Seconds 3'
                        
                        // Use PowerShell for better HTTP checking
                        def result = powershell(
                            script: """
                            try {
                                \$response = Invoke-WebRequest -Uri http://localhost:${HOST_PORT} -TimeoutSec 2 -UseBasicParsing
                                if (\$response.StatusCode -eq 200) { 
                                    Write-Host "✅ Health check passed"
                                    exit 0 
                                } else { 
                                    Write-Host "⚠️ Health check returned status: \$(\$response.StatusCode)"
                                    exit 1 
                                }
                            } catch {
                                Write-Host "⚠️ Health check failed: \$(\$_.Exception.Message)"
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
                        bat "docker logs ${CONTAINER_NAME} --tail 50 2>&1 || echo No logs available"
                        error "Health check failed"
                    }
                }
            }
        }

        stage('Verify Logs') {
            steps {
                echo "🔍 Checking container logs..."
                bat "docker logs ${CONTAINER_NAME} --tail 50 2>&1 || echo No logs available"
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
                    
                    // Show container details
                    bat "docker ps -f name=${CONTAINER_NAME}"
                } else {
                    echo "⚠️ Container is not running"
                    // Check if container exists but is stopped
                    def containerExists = bat(
                        script: "docker ps -a -q -f name=${CONTAINER_NAME}",
                        returnStatus: true
                    ) == 0
                    
                    if (containerExists) {
                        echo "📋 Container exists but is stopped. Last logs:"
                        bat "docker logs ${CONTAINER_NAME} --tail 20 2>&1 || echo Container logs not available"
                    }
                }
            }
        }
        success {
            echo "✅ App successfully deployed on port ${HOST_PORT}!"
        }
        failure {
            echo "❌ Build or deployment failed"
            
            // Show debug information on failure
            script {
                echo "📋 Debug information:"
                bat "docker ps -a || echo No containers found"
                bat "docker images ${IMAGE_NAME} || echo No images found"
            }
        }
    }
}