pipeline {
    agent {
        label "Worker-node"
    }
    tools {
        nodejs 'node14' 
    }
    environment {
        registry = "http://10.10.154.45:8083"
        registryCredential = 'nexus-id'
        imageName= "sodeci/sodeci-auth"
        mailReplyTo= "redoukou@gs2e.ci"
        appName="sodeci-auth"
        ARGOCD_SERVER="10.10.154.42:30070"
        ARGOCD_AUTH_TOKEN=credentials('argocd-sodeci-token')
    }
    parameters {
        booleanParam(defaultValue: false, description: 'Clean workspace', name: 'CLEAN' )
        gitParameter branchFilter: 'origin/(.*)', defaultValue: 'develop', name: 'BRANCH', type: 'PT_BRANCH'
        booleanParam(defaultValue: false, description: 'Install tools on jenkins?', name: 'INSTALL_TOOLS' )
        booleanParam(defaultValue: true, description: 'Launch unit tests?', name: 'UNIT' )
        booleanParam(defaultValue: true, description: 'Launch sonarqube tests?', name: 'SONAR' )
        booleanParam(defaultValue: true, description: 'Install tools on jenkins?', name: 'BUILD' )
        booleanParam(defaultValue: false, description: 'Should I deploy?', name: 'DEPLOY' )
    }

  options {
      skipDefaultCheckout()
  }
    stages {
        stage('CleanWorkspace') {
            when {
                expression { params.CLEAN }
            }
            steps {
                cleanWs()
            }
        }
        stage('Checkout code source') {
            steps {
                checkout([$class: 'GitSCM', 
                branches: [[name: "${params.BRANCH}"]],
                gitTool: 'Default',
                userRemoteConfigs: [[credentialsId: 'sodeci-token', url: 'https://DLSI@dev.azure.com/DLSI/SodeciMicroservices/_git/sodeci-auth']]
                ])
            }
        }
        stage('UnitTests') {
            when {
                expression { params.UNIT }
            }
            steps {
                echo 'Testing..'
            }
        }

        stage('Sonarqube') {
            when {
                expression { params.SONAR }
            }
            environment {
                scannerHome = tool 'SonarQubeScanner'
             }
            steps {
                withSonarQubeEnv('sonarqube') {
                sh "${scannerHome}/bin/sonar-scanner"
            }
            timeout(time: 10, unit: 'MINUTES') {
                waitForQualityGate abortPipeline: true
                }
            }
            post {
                failure {
                    emailext attachLog: true, subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!',     
                        recipientProviders: [[$class: 'DevelopersRecipientProvider'],
                                            [$class: 'RequesterRecipientProvider'], 
                                            [$class: 'FailingTestSuspectsRecipientProvider'],
                                            [$class: 'FirstFailingBuildSuspectsRecipientProvider'],
                                            [$class: 'UpstreamComitterRecipientProvider']],                                  
                        replyTo: "$mailReplyTo",                                        
                        body: """<p>EXECUTED: Job <b>\'${env.JOB_NAME}:${env.BUILD_NUMBER})\'
                            </b></p><p>Sonar failed View console output at "<a href="${env.BUILD_URL}"> 
                            ${env.JOB_NAME}:${env.BUILD_NUMBER}</a>"</p> 
                                <p><i>(Build log is attached.)</i></p>""",                 
                        mimeType: 'text/html'
                    }
                }

            
        }
        stage('Build') {

             when {
                expression { params.BUILD }
            }

            steps {
                script {
                    GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
                    dockerImage=docker.build imageName
                    docker.withRegistry( registry, registryCredential ) {
                    dockerImage.push("${GIT_COMMIT_HASH}")
                    dockerImage.push('latest')
                    }
                }
            }

            post {
                success {
                    sh "docker rmi sodeci/sodeci-auth"
                    }
                failure {
                    emailext attachLog: true, subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!',     
                        recipientProviders: [[$class: 'DevelopersRecipientProvider'],
                                            [$class: 'RequesterRecipientProvider'], 
                                            [$class: 'FailingTestSuspectsRecipientProvider'],
                                            [$class: 'FirstFailingBuildSuspectsRecipientProvider'],
                                            [$class: 'UpstreamComitterRecipientProvider']],                                  
                        replyTo: "$mailReplyTo",                                        
                        body: """<p>EXECUTED: Job <b>\'${env.JOB_NAME}:${env.BUILD_NUMBER})\'
                            </b></p><p>Build failed View console output at "<a href="${env.BUILD_URL}"> 
                            ${env.JOB_NAME}:${env.BUILD_NUMBER}</a>"</p> 
                                <p><i>(Build log is attached.)</i></p>""",                 
                        mimeType: 'text/html'
                    }
                }
        }
        
        stage('DeployArgoCD') {
            steps {
                script {
                    
                    sh """
                            argocd app sync --insecure ${appName}
                    """
                }
            }
        }
    }
}