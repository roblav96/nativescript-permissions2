import {Observable} from 'data/observable';
import Permissions2 from './modules/permissions2'
// var Permissions2 = require('./modules/permissions2')
// import {YourPlugin} from 'nativescript-yourplugin';

export class HelloWorldModel extends Observable {
	public message: string;

	constructor() {
		super();

		Permissions2
		// global.tnsconsole.log('Permissions2', Permissions2)
		// global.tnsconsole.log('Permissions2.getCalendarAuthorizationStatus()', Permissions2.getCalendarAuthorizationStatus())

		// Permissions2.requestCalendarAuthorization().then(function(status) {
		// 	global.tnsconsole.log('status', status)
		// }).catch(function(err) {
		// 	global.tnsconsole.error('err', err)
		// })

		this.message = "haiii"
	}
}
