pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    parameters {
        booleanParam(
            name: 'DEPLOY_TO_K8S',
            defaultValue: false,
            description: 'Apply Kubernetes manifests after the tests and Docker build pass.'
        )
    }

    environment {
        IMAGE_NAME = 'unbeatable-tic-tac-toe:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git status --short'
            }
        }

        stage('Test and Build with Maven') {
            steps {
                sh 'mvn -B clean verify'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t "$IMAGE_NAME" .'
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { return params.DEPLOY_TO_K8S }
            }
            steps {
                sh 'kubectl apply -f k8s/'
                sh 'kubectl rollout status deployment/unbeatable-tic-tac-toe --timeout=120s'
                sh 'kubectl get deployments,pods,services -l app=unbeatable-tic-tac-toe'
            }
        }
    }

    post {
        success {
            echo 'CI pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Review the stage logs; deployment is blocked when earlier stages fail.'
        }
        always {
            echo 'Pipeline finished.'
        }
    }
}
