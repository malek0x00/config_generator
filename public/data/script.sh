#!/bin/sh
folder = "#####"
cd ${folder}
#####
curl -u #####:##### -T /godata/pipelines/#####/${folder}/target/chat-1.0.${GO_PIPELINE_LABEL}.jar "http://artifactory:8081/artifactory/libs-release-local/com/example/myapp/1.0/myapp-1.0.${GO_PIPELINE_LABEL}.jar"