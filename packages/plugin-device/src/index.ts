import { Core, Plugin } from '@hummer/cli-core';
const {runInspectorProxy} = require('metro-inspector-proxy');
import {info, error} from '@hummer/cli-utils';
import { NativeProject } from './base/nativeProject';
import { IosProject } from './ios/iosProject';
import { AndroidProject } from './android/androidProject';

export class DevicePlugin extends Plugin {
	name = 'run'
	private port = 8081
	constructor(core: Core, options: any, name?: string) {
		super(core, options, name)
		this.commands = {
			run : {
				description: 'launch iOS/android project',
				usage: 'hummer run [iOS/android] [path]',
				options: {
 					// '--port': "debug server port",
				},
				hooks: [this.run.bind(this)]
			}			
		}
	}

	private async run(){

		try {
			let project:NativeProject = this.resolveProject();
			await project.run();
		} catch (error) {
			error(error)
		}
	}

	private resolveProject() : NativeProject  {
		if (this.options._ instanceof Array){
			const _options:Array<string> = this.options._;
			const platform = _options[1];
			const path = _options[2];
			const deviceOption = _options.length>3 ? _options[3] : undefined;
			if (platform == 'ios'){
				return new IosProject({ projectPath:path,deviceOption:deviceOption });
			}else if(platform == 'android'){
				return new AndroidProject({ projectPath:path,deviceOption:deviceOption });
			}
		}
		throw Error("Invalid params")
	}
}