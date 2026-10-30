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
        JAVA_HOME = 'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.12.101-hotspot'
        PATH+DEVOPS_TOOLS = 'C:\\Windows\\Git\\cmd;C:\\Users\\ADMIN\\Downloads\\apache-maven-3.10.0-bin\\apache-maven-3.10.0\\bin;C:\\Users\\ADMIN\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.12.101-hotspot\\bin'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                bat 'git status --short'
            }
        }

        stage('Verify Build Tools') {
            steps {
                bat 'java -version'
                bat 'mvn -version'
                bat 'docker --version'
                bat 'kubectl version --client'
            }
        }

        stage('Test and Build with Maven') {
            steps {
                bat 'mvn -B clean verify'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t "%IMAGE_NAME%" .'
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { return params.DEPLOY_TO_K8S }
            }
            steps {
                bat 'kubectl apply -f k8s/'
                bat 'kubectl rollout status deployment/unbeatable-tic-tac-toe --timeout=120s'
                bat 'kubectl get deployments,pods,services -l app=unbeatable-tic-tac-toe'
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
