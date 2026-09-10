pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'develop') {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/development/spprogram'
                        env.ENV_DIR = '/var/amecweb/file/env/spprogram/spprogram-env-dev'
                        env.DEPLOY_ENV = 'development'
                        echo ">>> MR merged → develop → DEPLOY DEVELOPMENT"
                    } else if (env.BRANCH_NAME == 'main') {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/production/spprogram'
                        env.ENV_DIR = '/var/amecweb/file/env/spprogram/spprogram-env-prod'
                        env.DEPLOY_ENV = 'production'
                        echo ">>> MR merged → main → DEPLOY PRODUCTION"
                    } else {
                        error "❌ Branch ${env.BRANCH_NAME} is not deployable"
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }


        stage('Install & Build') {
            steps {
                // withCredentials([file(credentialsId: "${env.ENV_CRED_ID}", variable: 'ENV_FILE')]) {
                    withCredentials([usernamePassword(credentialsId: 'gitlab-auth-id', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
                        sh '''
                            git config --global url."https://${GIT_USER}:${GIT_PASS}@webhub.mitsubishielevatorasia.co.th/".insteadOf "https://webhub.mitsubishielevatorasia.co.th/"

                            CURRENT_VERSION=$(grep "^VERSION=" "${ENV_DIR}" | head -n 1 | cut -d "=" -f 2 | tr -d "[[:cntrl:]]")
                            if ! printf '%s\n' "${CURRENT_VERSION}" | grep -Eq "^[0-9]+[.][0-9]+[.][0-9]+$"; then
                                echo "VERSION must use the format major.minor.patch"
                                exit 1
                            fi

                            MAJOR_VERSION=${CURRENT_VERSION%%.*}
                            VERSION_REMAINDER=${CURRENT_VERSION#*.}
                            MINOR_VERSION=${VERSION_REMAINDER%%.*}
                            PATCH_VERSION=${VERSION_REMAINDER#*.}
                            NEW_VERSION="${MAJOR_VERSION}.${MINOR_VERSION}.$((PATCH_VERSION + 1))"
                            sed -i "s/^VERSION=.*/VERSION=${NEW_VERSION}/" "${ENV_DIR}"
                            cp "${ENV_DIR}" .env
                            echo "Version: ${CURRENT_VERSION} -> ${NEW_VERSION}"

                            npm install --include=dev
                            npm update @amec/webasset
                            npm run build
                            npm run docs:build

                            git config --global --unset url."https://${GIT_USER}:${GIT_PASS}@webhub.mitsubishielevatorasia.co.th/".insteadOf
                        '''
                    }
                // }
            }
        }

        stage('PHP Prep (Composer)') {
            steps {
                dir('application') {
                    sh 'composer update --optimize-autoloader'
                }
                echo "PHP preparation with Composer done."
            }
        }

        stage('Deploy to NAS') {
            steps {
                sh '''
                    mkdir -p ${TARGET_DIR}
                    mkdir -p ${TARGET_DIR}/application/cache
                    mkdir -p ${TARGET_DIR}/application/logs

                    rsync -av --delete \
                        --exclude='node_modules' \
                        --exclude='.git' \
                        --exclude='.gitignore' \
                        --exclude='.env-sample' \
                        --exclude='Jenkinsfile' \
                        --exclude='application/cache' \
                        --exclude='application/logs' \
                        --exclude='*@tmp' \
                        ./ ${TARGET_DIR}/
                '''
            }
        }
    }

    post {
        always {
            script {
                // 1. หาชื่อคนสั่ง Build (ดึงจาก Build Causes)
                def buildCauses = currentBuild.getBuildCauses()
                def buildUser = ""
                for (cause in buildCauses) {
                    if (cause.shortDescription.contains('Started by user')) {
                        buildUser = cause.shortDescription.replace('Started by user ', '')
                    }else{
                        buildUser = cause.shortDescription.replace('Started by GitLab push by ', '')
                    }
                }

                // 2. จัดการเรื่องเวลา (แปลงจาก milliseconds เป็นวันที่ที่อ่านออก)
                def startTime = new Date(currentBuild.startTimeInMillis).format("dd/MM/yyyy HH:mm:ss", TimeZone.getTimeZone('Asia/Bangkok'))
                def endTime = new Date().format("dd/MM/yyyy HH:mm:ss", TimeZone.getTimeZone('Asia/Bangkok'))

                mail (
                    to: 'chalorms@MitsubishiElevatorAsia.co.th',
                    subject: "Build ${currentBuild.currentResult}: ${env.JOB_NAME} [#${env.BUILD_NUMBER}]",
                    from: 'jenkins-notify@MitsubishiElevatorAsia.co.th',
                    body: """
                        ข้อมูลการ Build เบื้องต้น:
                        -------------------------------------------
                        ผลการทำงาน: ${currentBuild.currentResult}
                        ผู้ดำเนินการ: ${buildUser}
                        เวลาที่เริ่ม: ${startTime}
                        เวลาที่เสร็จ: ${endTime}
                        ระยะเวลาทั้งหมด: ${currentBuild.durationString.replace(' and counting', '')}

                        รายละเอียดสภาพแวดล้อม:
                        -------------------------------------------
                        Environment: ${env.DEPLOY_ENV}
                        Target Directory: ${env.TARGET_DIR}

                        สามารถตรวจสอบ Log อย่างละเอียดได้ที่:
                        ${env.BUILD_URL}console
                        -------------------------------------------
                    """
                )
            }
        }
    }
}