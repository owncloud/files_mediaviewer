OC_CI_ALPINE = "owncloudci/alpine:latest"
OC_CI_WAIT_FOR = "owncloudci/wait-for:latest"
OC_CI_NODEJS = "owncloudci/nodejs:14"
OC_UBUNTU = "owncloud/ubuntu:20.04"

config = {
	'app': 'files_mediaviewer',
	'rocketchat': {
		'channel': 'builds',
		'from_secret': 'private_rocketchat'
	},

	'branches': [
		'master'
	],

	'appInstallCommand': 'make dist',

    'javascript': {},
}

def main(ctx):
	before = beforePipelines()

	stages = stagePipelines()
	if (stages == False):
		print('Errors detected. Review messages above.')
		return []

	dependsOn(before, stages)

	after = afterPipelines()
	dependsOn(stages, after)

	return before + stages + after

def beforePipelines():
	return []

def stagePipelines():
	jsPipelines = javascript()

	return jsPipelines

def afterPipelines():
	return [
		notify()
	]

def javascript():
	pipelines = []

	if 'javascript' not in config:
		return pipelines

	default = {
		'coverage': False,
		'logLevel': '2',
		'extraSetup': [],
		'extraServices': [],
		'extraEnvironment': {},
		'extraCommandsBeforeTestRun': [],
	}

	if 'defaults' in config:
		if 'javascript' in config['defaults']:
			for item in config['defaults']['javascript']:
				default[item] = config['defaults']['javascript'][item]

	matrix = config['javascript']

	if type(matrix) == "bool":
		if matrix:
			# the config has 'javascript' true, so specify an empty dict that will get the defaults
			matrix = {}
		else:
			return pipelines

	params = {}
	for item in default:
		params[item] = matrix[item] if item in matrix else default[item]

	result = {
		'kind': 'pipeline',
		'type': 'docker',
		'name': 'javascript-tests',
		'workspace' : {
			'base': '/var/www/owncloud',
			'path': 'server/apps/%s' % config['app']
		},
		'steps':
			installApp() +
			params['extraSetup'] +
			[
                {
                    'name': 'l10n-read',
                    'image': 'owncloudci/nodejs:%s' % getNodeJsVersion(),
                    'pull': 'always',
                    'environment': params['extraEnvironment'],
                    'commands': params['extraCommandsBeforeTestRun'] + [
                        'make l10n-read'
                    ]
                }
            ],
		'services': params['extraServices'],
		'depends_on': [],
		'trigger': {
			'ref': [
				'refs/pull/**',
				'refs/tags/**'
			]
		}
	}

	if params['coverage']:
		result['steps'].append({
			'name': 'codecov-js',
			'image': 'plugins/codecov:latest',
			'pull': 'always',
			'settings': {
				'paths': [
					'coverage/*.info',
				],
				'token': {
					'from_secret': 'codecov_token'
				}
			}
		})

	for branch in config['branches']:
		result['trigger']['ref'].append('refs/heads/%s' % branch)

	return [result]

def notify():
	result = {
		'kind': 'pipeline',
		'type': 'docker',
		'name': 'chat-notifications',
		'clone': {
			'disable': True
		},
		'steps': [
			{
				'name': 'notify-rocketchat',
				'image': 'plugins/slack:1',
				'pull': 'always',
				'settings': {
					'webhook': {
						'from_secret': config['rocketchat']['from_secret']
					},
					'channel': config['rocketchat']['channel']
				}
			}
		],
		'depends_on': [],
		'trigger': {
			'ref': [
				'refs/tags/**'
			],
			'status': [
				'success',
				'failure'
			]
		}
	}

	for branch in config['branches']:
		result['trigger']['ref'].append('refs/heads/%s' % branch)

	return result

def installApp():
	if 'appInstallCommand' not in config:
		return []

	return [{
		'name': 'install-app-%s' % config['app'],
		'image': 'owncloudci/nodejs:%s' % getNodeJsVersion(),
		'pull': 'always',
		'commands': [
			'cd /var/www/owncloud/server/apps/%s' % config['app'],
			config['appInstallCommand']
		]
	}]

def getNodeJsVersion():
    if "nodeJsVersion" not in config:
        # We use nodejs 14 as the default
        return "14"
    else:
        return config["nodeJsVersion"]

def dependsOn(earlierStages, nextStages):
	for earlierStage in earlierStages:
		for nextStage in nextStages:
			nextStage['depends_on'].append(earlierStage['name'])

def waitForServer(federatedServerNeeded):
    return [{
        "name": "wait-for-server",
        "image": OC_CI_WAIT_FOR,
        "pull": "always",
        "commands": [
            "wait-for -it server:80 -t 600",
        ] + ([
            "wait-for -it federated:80 -t 600",
        ] if federatedServerNeeded else []),
    }]
