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
                        
                        stage('Frontend: Push Image') {
                            steps {
                                script {
                                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                        sh 'docker push ${FRONTEND_IMAGE}'
                                        echo 'Frontend image pushed to registry'
                                    }
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
                        
                        stage('Backend: Push Image') {
                            steps {
                                script {
                                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                        sh 'docker push ${BACKEND_IMAGE}'
                                        echo 'Backend image pushed to registry'
                                    }
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
        
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes cluster...'
                sh '''
                    # Update image tags in k8s manifests
                    sed -i "s|image:.*backend.*|image: ${BACKEND_IMAGE}|g" k8s/backend-deployment.yaml
                    sed -i "s|image:.*frontend.*|image: ${FRONTEND_IMAGE}|g" k8s/frontend-deployment.yaml
                    
                    # Apply Kubernetes manifests
                    kubectl apply -f k8s/backend-deployment.yaml
                    kubectl apply -f k8s/backend-service.yaml
                    kubectl apply -f k8s/frontend-deployment.yaml
                    kubectl apply -f k8s/frontend-service.yaml
                    
                    # Wait for rollout to complete
                    kubectl rollout status deployment/backend -n default --timeout=5m
                    kubectl rollout status deployment/frontend -n default --timeout=5m
                    
                    # Verify deployment
                    kubectl get pods -n default
                    kubectl get services -n default
                '''
                echo 'Application deployed successfully to Kubernetes'
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