pipeline {
    agent {
        label 'docker-agent'
    }
    
    environment {
        FRONTEND_IMAGE = 'frontend:latest'
        BACKEND_IMAGE = 'backend:latest'
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
                                 script {
                                    docker.image('node:18').inside {
                                       sh 'npm ci'
                                       echo 'Frontend dependencies installed'
                                    }
                                 }
                                }
                            }
                        }
                        
                        stage('Frontend: Build') {
                            steps {
                                dir('frontend') {
                                    script {
                                       docker.image('node:18').inside {
                                          sh 'docker build -t ${FRONTEND_IMAGE} .'
                                          echo 'Frontend Docker image built'
                                       }
                                    }
                                }
                            }
                        }
                        
                        stage('Frontend: Test') {
                            steps {
                                dir('frontend') {
                                    script {
                                       docker.image('node:18').inside {
                                          sh 'npm test '
                                       }
                                    }
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
                                    script {
                                       docker.image('node:18').inside{
                                          sh 'npm ci'
                                          echo 'Backend dependencies installed'
                                       }
                                    }
                                }
                            }
                        }
                        
                        stage('Backend: Build') {
                            steps {
                                dir('backend') {
                                    script {
                                       docker.image('node:18').inside {
                                          sh 'docker build -t ${BACKEND_IMAGE} .'
                                          echo 'Backend Docker image built'
                                       }
                                    }
                                }
                            }
                        }
                        
                        stage('Backend: Test') {
                            steps {
                                dir('backend') {
                                    script {
                                       docker.image('node:18').inside {
                                          sh 'npm test '
                                       }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh 'docker-compose up -d'
                echo 'Application deployed successfully'
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
            deleteDir()
        }
    }
}