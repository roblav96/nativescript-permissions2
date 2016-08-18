import {Observable} from 'data/observable';
import Permissions2 from './modules/permissions2'
// var Permissions2 = require('./modules/permissions2')
// import {YourPlugin} from 'nativescript-yourplugin';

export class HelloWorldModel extends Observable {
	public message: string;

	constructor() {
		super();

		global.tnsconsole.log('Permissions2', Permissions2)
		// global.tnsconsole.log('Permissions2.isContactsAuthorized()', Permissions2.isContactsAuthorized())
		// console.dump(Permissions2);

		// let yourPlugin = new YourPlugin()
		// console.dir(yourPlugin);

		this.message = "haiii"
	}
}
