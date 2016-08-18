// 

import * as platform from 'platform'
declare var ABAddressBookGetAuthorizationStatus: any
declare var ABAuthorizationStatus: any
declare var ABAddressBookRequestAccessWithCompletion: any
declare var ABAddressBookCreateWithOptions: any



class Permissions2 {

	public NOTDETERMINED: number = ABAuthorizationStatus.kABAuthorizationStatusNotDetermined
	public RESTRICTED: number = ABAuthorizationStatus.kABAuthorizationStatusRestricted
	public DENIED: number = ABAuthorizationStatus.kABAuthorizationStatusDenied
	public AUTHORIZED: number = ABAuthorizationStatus.kABAuthorizationStatusAuthorized

	private adressBook: any = ABAddressBookCreateWithOptions(null, null)
	private osVersion: number = parseFloat(platform.device.osVersion)

	constructor() {
		// console.log('IOS IOS IOS IOS');
		// console.dir(ABAddressBookGetAuthorizationStatus);
		// global.tnsconsole.log('ABAddressBookGetAuthorizationStatus()', ABAddressBookGetAuthorizationStatus())
		// global.tnsconsole.dump('ABAddressBookRequestAccessWithCompletion', ABAddressBookRequestAccessWithCompletion)
		// ABAddressBookRequestAccessWithCompletion()
		// let idk = ABAddressBookRequestAccessWithCompletion()
		// global.tnsconsole.log('idk', idk)
		// global.tnsconsole.dump('idk', idk)

		// ABAddressBookRequestAccessWithCompletion(this.adressBook, function(status, error) {
		// 	global.tnsconsole.log('status', status)
		// 	global.tnsconsole.dump('status', status)
		// 	global.tnsconsole.log('error', error)
		// 	global.tnsconsole.dump('error', error)
		// })

		// global.tnsconsole.log('platform.device', platform.device)
		// global.tnsconsole.dump('platform.device', platform.device)
		// global.tnsconsole.log('typeof platform.device.osVersion', typeof platform.device.osVersion)

		// global.tnsconsole.log('this.adressBook', this.adressBook)
		// global.tnsconsole.dump('this.adressBook', this.adressBook)

	}

	public getContactsAuthorizationStatus(): number {
		return ABAddressBookGetAuthorizationStatus()
	}

	public isContactsAuthorized(): boolean {
		return this.getContactsAuthorizationStatus() == this.AUTHORIZED
	}

	public requestContactsAuthorization(): Promise<any> {
		return new Promise(function(resolve, reject) {
			ABAddressBookRequestAccessWithCompletion(this.adressBook, function(status, error) {
				if (error) {
					return reject(new Error(error))
				} else {
					return resolve(status)
				}
			})
		})
	}

}

export default new Permissions2()





















































// 

