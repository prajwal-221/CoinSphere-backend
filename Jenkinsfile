pipeline {
    agent any

    environment {
        AWS_REGION = 'us-west-1'
        ECR_REPO = '253472910275.dkr.ecr.us-west-1.amazonaws.com/coinsphere-backend'
        ECS_CLUSTER = 'my-ecs-cluster'
        ECS_SERVICE = 'backend-service'
        TASK_DEFINITION = 'backend-task'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/prajwal-221/CoinSphere-backend.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Get short git SHA for tagging
                    def IMAGE_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    
                    // Build Docker image from ./server folder
                    sh "docker build -t ${ECR_REPO}:${IMAGE_TAG} ./server"
                    
                    // Export IMAGE_TAG for later stages
                    env.IMAGE_TAG = IMAGE_TAG
                }
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins-creds']]) {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push ${ECR_REPO}:${env.IMAGE_TAG}"
            }
        }

        stage('Update ECS Service') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins-creds']]) {
                    script {
                        sh """
                        # Fetch current ECS task definition
                        TASK_DEF_JSON=\$(aws ecs describe-task-definition --task-definition ${TASK_DEFINITION})

                        # Update container image and preserve memory & cpu
                        NEW_TASK_DEF=\$(echo \$TASK_DEF_JSON | jq --arg IMAGE "${ECR_REPO}:${env.IMAGE_TAG}" '
                          .taskDefinition.containerDefinitions[0].image = \$IMAGE |
                          {
                            family: .taskDefinition.family,
                            containerDefinitions: .taskDefinition.containerDefinitions,
                            executionRoleArn: .taskDefinition.executionRoleArn,
                            networkMode: .taskDefinition.networkMode,
                            requiresCompatibilities: .taskDefinition.requiresCompatibilities,
                            cpu: .taskDefinition.cpu,
                            memory: .taskDefinition.memory
                          }'
                        )

                        # Register new task definition revision and get ARN
                        NEW_REVISION_ARN=\$(aws ecs register-task-definition --cli-input-json "\$NEW_TASK_DEF" --query "taskDefinition.taskDefinitionArn" --output text)

                        # Update ECS service with new task definition revision
                        aws ecs update-service --cluster ${ECS_CLUSTER} --service ${ECS_SERVICE} --task-definition \$NEW_REVISION_ARN
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful: ${ECR_REPO}:${env.IMAGE_TAG}"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
