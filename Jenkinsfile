pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID="158648291607"
        AWS_REGION="us-east-1"
        BACKEND_REPO="python-backend"
        FRONTEND_REPO="frontend-app"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/username/fullstack-python-app.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t python-backend ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t frontend-app ./frontend'
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION \
                    | docker login --username AWS \
                    --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Tag Images') {
            steps {
                sh '''
                docker tag python-backend $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest
                docker tag frontend-app $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                ssh ec2-user@EC2-IP << EOF

                docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest
                docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest

                docker stop backend || true
                docker rm backend || true

                docker stop frontend || true
                docker rm frontend || true

                docker run -d -p 5000:5000 --name backend \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest

                docker run -d -p 3000:3000 --name frontend \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest

                EOF
                '''
            }
        }

    }
}
