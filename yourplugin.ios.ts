import {Common} from './yourplugin.common';
declare var ABAddressBookGetAuthorizationStatus: any

export class YourPlugin extends Common {
	constructor() {
		super()
		console.dir(ABAddressBookGetAuthorizationStatus);
	}
}