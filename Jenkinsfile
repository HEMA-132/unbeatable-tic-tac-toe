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
        MAVEN_CMD = 'C:\\Users\\ADMIN\\Downloads\\apache-maven-3.10.0-bin\\apache-maven-3.10.0\\bin\\mvn.cmd'
        DOCKER_CMD = 'C:\\Users\\ADMIN\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
        KUBECTL_CMD = 'C:\\Users\\ADMIN\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe'
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
                bat '"%JAVA_HOME%\\bin\\java.exe" -version'
                bat 'call "%MAVEN_CMD%" -version'
                bat '"%DOCKER_CMD%" --version'
                bat '"%KUBECTL_CMD%" version --client'
            }
        }

        stage('Test and Build with Maven') {
            steps {
                bat 'call "%MAVEN_CMD%" -B clean verify'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '"%DOCKER_CMD%" build -t "%IMAGE_NAME%" .'
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { return params.DEPLOY_TO_K8S }
            }
            steps {
                bat '"%KUBECTL_CMD%" apply -f k8s/'
                bat '"%KUBECTL_CMD%" rollout status deployment/unbeatable-tic-tac-toe --timeout=120s'
                bat '"%KUBECTL_CMD%" get deployments,pods,services -l app=unbeatable-tic-tac-toe'
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
