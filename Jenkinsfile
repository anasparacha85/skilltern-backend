pipeline {
    agent any

    environment {
        IMAGE_NAME     = "skilltern-backend"
        CONTAINER_NAME = "skilltern-backend-container"
        HOST_PORT      = "3001"
        CONTAINER_PORT = "5001"
        AWS_REGION     = "us-east-1"
        SECRET_NAME    = "test-app/server/prod"
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
                echo "Checking out branch ${params.BRANCH_NAME}..."
                git branch: "${params.BRANCH_NAME}",
                    credentialsId: 'gitPat',
                    url: 'https://github.com/anasparacha85/skilltern-backend.git'
            }
        }

        stage('Fetch Secrets from AWS') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id',     variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    script {
                        sh """
                            aws secretsmanager get-secret-value \
                                --region ${AWS_REGION} \
                                --secret-id ${SECRET_NAME} \
                                --query SecretString \
                                --output text \
                            | python3 -c "import json,sys; [print(k+'='+v) for k,v in json.load(sys.stdin).items()]" > .env

                            chmod 600 .env
                            echo "Secrets fetched successfully"
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image ${IMAGE_NAME}..."
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    echo "Checking & stopping old container ${CONTAINER_NAME}..."
                    sh """
                        if docker inspect ${CONTAINER_NAME} > /dev/null 2>&1; then
                            echo "Container exists. Stopping and removing..."
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                            echo "Old container removed successfully"
                        else
                            echo "No existing container found. Continuing..."
                        fi
                    """
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    echo "Running new container ${CONTAINER_NAME}..."
                    sh """
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            --env-file .env \
                            -p ${HOST_PORT}:${CONTAINER_PORT} \
                            --restart unless-stopped \
                            ${IMAGE_NAME}
                    """
                }
            }
        }

        stage('Cleanup Secrets') {
            steps {
                sh "rm -f .env"
                echo "Env file removed from workspace"
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "Checking app health..."
                    def maxRetries = 10
                    def retryCount = 0
                    def healthy = false

                    while (retryCount < maxRetries && !healthy) {
                        sleep(3)
                        def result = sh(
                            script: "curl -sf http://localhost:${HOST_PORT} > /dev/null 2>&1",
                            returnStatus: true
                        )
                        if (result == 0) {
                            healthy = true
                            echo "App is responding!"
                        } else {
                            retryCount++
                            echo "App not ready yet, retry ${retryCount}/${maxRetries}..."
                        }
                    }

                    if (!healthy) {
                        echo "App did not respond after ${maxRetries * 3} seconds"
                        sh "docker logs ${CONTAINER_NAME} --tail 50 || true"
                        error "Health check failed"
                    }
                }
            }
        }

        stage('Verify Logs') {
            steps {
                echo "Checking container logs..."
                sh "docker logs ${CONTAINER_NAME} --tail 50 || true"
            }
        }
    }

    post {
        always {
            script {
                sh "rm -f .env || true"
                def containerRunning = sh(
                    script: "docker ps -q -f name=${CONTAINER_NAME}",
                    returnStatus: true
                ) == 0

                if (containerRunning) {
                    echo "Container is running"
                    sh "docker ps -f name=${CONTAINER_NAME}"
                } else {
                    echo "Container is not running"
                    sh "docker logs ${CONTAINER_NAME} --tail 20 || true"
                }
            }
        }
        success {
            echo "App successfully deployed on port ${HOST_PORT}!"
        }
        failure {
            echo "Build or deployment failed"
            script {
                sh "docker ps -a || true"
                sh "docker images ${IMAGE_NAME} || true"
            }
        }
    }
}
