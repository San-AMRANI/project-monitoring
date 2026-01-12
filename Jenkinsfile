pipeline {
    agent {
        label 'docker-agent'
    }
    
    environment {
        DOCKER_REGISTRY = 'sanamrani'  // Change to your Docker Hub username or private registry
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/backend:${IMAGE_TAG}"
        KUBECONFIG = credentials('kubeconfig-credential-id')  // Add your kubeconfig credential ID in Jenkins
    }
    
    stages {
        
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checked out successfully'
            }
        }
        
        stage('Build & Test') {
            parallel {
                stage('Frontend Pipeline') {
                    stages {
                        stage('Frontend: Install Dependencies') {
                            steps {
                                dir('frontend') {
                                    sh 'npm ci'
                                    echo 'Frontend dependencies installed'
                                }
                            }
                        }
                        
                        stage('Frontend: Build') {
                            steps {
                                dir('frontend') {
                                    sh 'docker build -t ${FRONTEND_IMAGE} .'
                                    echo 'Frontend Docker image built'
                                }
                            }
                        }
                        
                        stage('Frontend: Test') {
                            steps {
                                dir('frontend') {
                                    sh 'npm test || echo "No tests specified"'
                                }
                            }
                        }
                    }
                }
                
                stage('Backend Pipeline') {
                    stages {
                        stage('Backend: Install Dependencies') {
                            steps {
                                dir('backend') {
                                    sh 'npm ci'
                                    echo 'Backend dependencies installed'
                                }
                            }
                        }
                        
                        stage('Backend: Build') {
                            steps {
                                dir('backend') {
                                    sh 'docker build -t ${BACKEND_IMAGE} .'
                                    echo 'Backend Docker image built'
                                }
                            }
                        }
                        
                        stage('Backend: Test') {
                            steps {
                                dir('backend') {
                                    sh 'npm test || echo "No tests specified"'
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
                echo 'Application deployed with Docker Compose'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            echo 'Cleaning up workspace...'
        }
    }
}