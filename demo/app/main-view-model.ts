import {Observable} from 'data/observable';
import Permissions2 from './modules/permissions2'



export class HelloWorldModel extends Observable {
	public message: string;

	constructor() {
		super();

		// Permissions2
		// global.tnsconsole.log('Permissions2', Permissions2)

		global.tnsconsole.log('Permissions2.getLocationAuthorizationStatus()', Permissions2.getLocationAuthorizationStatus())

		// setTimeout(function() {
		// 	Permissions2.requestLocationAuthorization().then(function(status) {
		// 		global.tnsconsole.log('requestLocationAuthorization', status)
		// 	}).catch(function(err) {
		// 		global.tnsconsole.error('err', err)
		// 	})
		// }, 1000)
		// setTimeout(function() {
		// 	Permissions2.requestLocationAuthorization().then(function(status) {
		// 		global.tnsconsole.log('requestLocationAuthorization', status)
		// 	}).catch(function(err) {
		// 		global.tnsconsole.error('err', err)
		// 	})
		// }, 2000)

		this.message = "haiii"
	}
}
