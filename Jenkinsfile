pipeline {
  agent any

  environment {
    // Configure these in the Jenkins job or as global env vars
    DOCKER_REGISTRY = credentials('docker-registry-url') // optional, or set as plain text
    DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'    // create this credential in Jenkins (username/password)
    IMAGE_TAG = "${env.BUILD_NUMBER ?: 'local'}"
    BACKEND_IMAGE = "${DOCKER_REGISTRY ?: ''}/quotes-backend:${IMAGE_TAG}"
    FRONTEND_IMAGE = "${DOCKER_REGISTRY ?: ''}/quotes-frontend:${IMAGE_TAG}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Backend: Install & Test') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm test'
        }
      }
    }

    stage('Frontend: Install & Test') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm test'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          sh "docker build -t ${BACKEND_IMAGE} ./backend"
          sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
        }
      }
    }

    stage('Push Images (optional)') {
      when {
        expression { env.DOCKER_CREDENTIALS_ID != null }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin ${DOCKER_REGISTRY ?: "docker.io"}'
          sh "docker push ${BACKEND_IMAGE}"
          sh "docker push ${FRONTEND_IMAGE}"
        }
      }
    }

    stage('Deploy to Kubernetes (optional)') {
      when {
        expression { fileExists('k8s') }
      }
      steps {
        // This assumes kubeconfig is available to the agent (e.g., via credentials or mounted config)
        sh 'kubectl apply -f k8s/'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: '**/build/**', onlyIfSuccessful: false
      // Add junit results collection if you configure tests to emit JUnit XML
      // junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
    }
    success {
      echo 'Pipeline succeeded.'
    }
    failure {
      echo 'Pipeline failed.'
    }
  }
}
