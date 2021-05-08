## Agile Metrics Tools
[![Build Status](https://travis-ci.org/ferzerkerx/agile-metrics-tools.svg?branch=master)](https://travis-ci.org/ferzerkerx/agile-metrics-tools)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=agile-metrics-tools&metric=alert_status)](https://sonarcloud.io/dashboard?id=agile-metrics-tools)

Agile metrics tools allows you to track metrics from different sources in order to identify trends and patterns on how your team performance is affected by its environment Inspired by 'Agile Metrics in Action' book and https://github.com/cwhd/measurementor project

Pulls data from:
- Jira
- Jenkins
- Github
- Sonarqube
- Manual external sources

And pushes it to ElasticSearch so that it can be further analyzed in order to find patterns.

Inspired by `Agile Metrics in Action` book and https://github.com/cwhd/measurementor project   

![alt tag](https://raw.githubusercontent.com/ferzerkerx/agile-metrics-tools/master/screenshots/agile-metrics-tools-1.png) 

### Env configurations
````
JIRA_HOST=
JIRA_API_TOKEN=

SONAR_HOST=
GITHUB_TOKEN=

JENKINS_HOST=
JENKINS_USER=
JENKINS_API_TOKEN=

ES_HOST=
````

### Configurations:
#### app-config.json
````
{
  "indexPrefix": "myindex",
  "modules": [
    {
      "type": "github",
      "configFile": "/your/path/configs/github-config.json"
    },
    {
      "type": "jira",
      "configFile": "/your/path/configs/jira-config.json"
    },
    {
      "type": "jenkins",
      "configFile": "/your/path/configs/jenkins-config.json"
    },
    {
      "type": "sonar",
      "configFile": "/your/path/configs/sonar-config.json"
    },
    {
      "type": "external",
      "configFile": "/your/path/configs/external-config.json"
    }
  ]
}
````

#### external-config.json
````
[
  {
    "metricType": "METRIC",
    "type": "csv",
    "srcType": "file",
    "srcPath": "/your/path/sample.csv",
    "since": "2018-12-03T00:00:00Z"
  },
   {
    "metricType": "METRIC",
    "since": "2018-12-03T00:00:00Z",
    "type": "csv",
    "srcType": "inline",
    "inlineData": [
      {
        "createdAt": "2018-12-03T00:00:00Z",
        "teamName": "someTeam",
        "header1": 2,
        "header2": 3,
        "header3": "someValue"
      }
    ]
  }
]
````

#### github-config.json
````
[
  {
    "repositoryName": "your-repo",
    "teamName": "someTeam",
    "orgName": "orgName/own",
    "since": "2018-12-03T00:00:00Z"
  }
]
````

#### jenkins-config.json
````
[
   {
      "orgName": "org-name",
      "teamName": "someTeam",
      "projectName": "your-project",
      "since": "2018-12-03"
    }
]
````

#### jira-config.json
````
[
  {
    "teamId": 1,
    "teamName": "someTeam",
    "since": "2018-12-03",
    "workFlowMap": {
          "Open": 1,
          "In Progress": 3,
          "Code Review": 4,
          "Po Review": 5,
          "Done": 7
        },
        "fields": {
          "storyPoints": "customfield_..."
        },
        "estimateConfig": {
            "maxTime": 7,
            "estimationValues": [1, 2, 3, 5, 8]
        }
  }
]
````

#### sonar-config.json
````
[
  {
     "projectName": "your-project",
     "teamName": "someTeam",
     "since": "2018-12-03"
  }
]
````

### To use a Dockerized ELK
ES version 740
Please refer to https://elk-docker.readthedocs.io/ , mainly the only thing needed is:
````
sudo sysctl -w vm.max_map_count=262144
sudo grep vm.max_map_count /etc/sysctl.conf
docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -it --name elk sebp/elk:740
````
Remove limits of space if unable to create index
````
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_cluster/settings -d '{ "transient": { "cluster.routing.allocation.disk.threshold_enabled": false } }'
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": null}'
````

## Test locally (Using Web)
1.  Start ELK stack and make sure ES is running on <http://localhost:92000>
2.  Run yarn start-local
3.  Go to <http://localhost:3000> on a browser
4.  Select by service
5.  Select external service
6.  Click on sample
7.  Click on submit
8.  Create an index pattern ``myindex-*`` on <http://localhost:5601/app/kibana#/management/kibana/index_pattern?_g=()> with ``createdAt`` as time filter

## Test locally (Using CLI)
1.  Start ELK stack and make sure ES is running on <http://localhost:92000>
2.  Run node src/index-cli.ts
3.  Create an index pattern ``myindex-*`` on <http://localhost:5601/app/kibana#/management/kibana/index_pattern?_g=()> with ``createdAt`` as time filter
