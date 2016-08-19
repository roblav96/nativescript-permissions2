import {Observable} from 'data/observable';
import Permissions2 from './modules/permissions2'



export class HelloWorldModel extends Observable {
	public message: string;

	constructor() {
		super();

		// Permissions2
		// global.tnsconsole.log('Permissions2', Permissions2)

		global.tnsconsole.log('Permissions2.isLocationEnabled()', Permissions2.isLocationEnabled())

		setTimeout(function() {
			Permissions2.requestLocationAuthorization().then(function(status) {
				global.tnsconsole.log('status', status)
			}).catch(function(err) {
				global.tnsconsole.error('err', err)
			})
		}, 1000)

		this.message = "haiii"
	}
}
