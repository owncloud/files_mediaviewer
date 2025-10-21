OC_CI_NODEJS = "owncloudci/nodejs:%s"
PLUGINS_CODE_COV = "plugins/codecov:latest"


DEFAULT_NODEJS_VERSION = "14"

dir = {
	"base": "/var/www/owncloud",
	"apps": "/var/www/owncloud/server/apps",
}

config = {
	'app': 'files_mediaviewer',

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


	return before + stages

def beforePipelines():
	return []

def stagePipelines():
	jsPipelines = javascript()

	return jsPipelines

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
			'base': dir['base'],
			'path': 'server/apps/%s' % config['app']
		},
		'steps':
			installApp() +
			params['extraSetup'] +
			[
                {
                    'name': 'l10n-read',
                    'image': OC_CI_NODEJS % getNodeJsVersion(),
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

def installApp():
	if 'appInstallCommand' not in config:
		return []

	return [{
		'name': 'install-app-%s' % config['app'],
		'image': OC_CI_NODEJS % getNodeJsVersion(),
		'commands': [
			'cd %s/%s' % (dir['apps'], config['app']),
			config['appInstallCommand']
		]
	}]

def getNodeJsVersion():
    if "nodeJsVersion" not in config:
        # We use nodejs 14 as the default
        return DEFAULT_NODEJS_VERSION
    else:
        return config["nodeJsVersion"]

def dependsOn(earlierStages, nextStages):
	for earlierStage in earlierStages:
		for nextStage in nextStages:
			nextStage['depends_on'].append(earlierStage['name'])
