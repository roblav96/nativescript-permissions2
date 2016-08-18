// 

import * as platform from 'platform'
import {openUrl} from 'utils/utils'
declare var ABAddressBookGetAuthorizationStatus: any
declare var ABAuthorizationStatus: any
declare var ABAddressBookRequestAccessWithCompletion: any
declare var ABAddressBookCreateWithOptions: any
declare var UIApplicationOpenSettingsURLString: any
declare var CLLocationManager: any
declare var UIImagePickerController: any
declare var UIImagePickerControllerSourceType: any
declare var UIImagePickerControllerCameraDevice: any
declare var AVAuthorizationStatus: any
declare var AVCaptureDevice: any
declare var AVMediaTypeVideo: any
declare var PHPhotoLibrary: any
declare var UIApplication: any
declare var UIUserNotificationSettings: any
declare var UIUserNotificationType: any



class Permissions2 {

	// get these numbers from ABAuthorizationStatus, AVAuthorizationStatus, etc.
	public NOTDETERMINED: number = 0
	public RESTRICTED: number = 1
	public DENIED: number = 2
	public AUTHORIZED: number = 3

	private adressBook: any = ABAddressBookCreateWithOptions(null, null)
	private osVersion: number = parseFloat(platform.device.osVersion) // parses the first decimal place

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

		// global.tnsconsole.log('UIUserNotificationSettings', UIUserNotificationSettings)
		// global.tnsconsole.dump('UIUserNotificationSettings', UIUserNotificationSettings)

		// global.tnsconsole.log('UIApplication.sharedApplication().respondsToSelector(registerUserNotificationSettings:)', UIApplication.sharedApplication().respondsToSelector('registerUserNotificationSettings:'))
		// global.tnsconsole.dump('UIApplication.sharedApplication().respondsToSelector(registerUserNotificationSettings:)', UIApplication.sharedApplication().respondsToSelector('registerUserNotificationSettings:'))

	}

	/*=================================
	=            UTILITIES            =
	=================================*/

	public switchToSettings(): void {
		openUrl(UIApplicationOpenSettingsURLString)
	}

	/*==============================
	=            CAMERA            =
	==============================*/

	public isCameraPresent(): boolean {
		return UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType['UIImagePickerControllerSourceTypeCamera'])
	}

	public isFrontCameraPresent(): boolean {
		return UIImagePickerController.isCameraDeviceAvailable(UIImagePickerControllerCameraDevice['UIImagePickerControllerCameraDeviceFront'])
	}

	public isRearCameraPresent(): boolean {
		return UIImagePickerController.isCameraDeviceAvailable(UIImagePickerControllerCameraDevice['UIImagePickerControllerCameraDeviceRear'])
	}

	public getCameraAuthorizationStatus(): number {
		return AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeVideo)
	}

	public isCameraAuthorized(): boolean {
		return this.getCameraAuthorizationStatus() == this.AUTHORIZED
	}

	public requestCameraAuthorization(): Promise<any> {
		return new Promise(function(resolve, reject) {
			AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(AVMediaTypeVideo, resolve)
		})
	}

	public getCameraRollAuthorizationStatus(): number {
		return PHPhotoLibrary.authorizationStatus()
	}

	public isCameraRollAuthorized(): boolean {
		return this.getCameraRollAuthorizationStatus() == this.AUTHORIZED
	}

	public requestCameraRollAuthorization(): Promise<any> {
		return new Promise((resolve, reject) => {
			PHPhotoLibrary.requestAuthorization((status) => {
				return resolve(status == this.AUTHORIZED)
			})
		})
	}





	/*=====================================
	=            NOTIFICATIONS            =
	=====================================*/

	public isRemoteNotificationsEnabled(): boolean {
		let sharedApp = UIApplication.sharedApplication()
		// if (sharedApp.respondsToSelector('registerUserNotificationSettings:')) {
		if (this.osVersion >= 8) {
			// iOS8+
			let enabled: boolean = sharedApp.isRegisteredForRemoteNotifications()
			let types: number = sharedApp.currentUserNotificationSettings().types
			return enabled && types != UIUserNotificationType['UIUserNotificationTypeNone']
		} else {
			// iOS7 and below
			let types: number = sharedApp.enabledRemoteNotificationTypes
			return types != UIUserNotificationType['UIUserNotificationTypeNone']
		}
	}

	public isRegisteredForRemoteNotifications(): boolean {
		let sharedApp = UIApplication.sharedApplication()
		if (this.osVersion >= 8) {
			// iOS8+
			return sharedApp.isRegisteredForRemoteNotifications()
		} else {
			// iOS7 and below
			return sharedApp.enabledRemoteNotificationTypes != UIUserNotificationType['UIUserNotificationTypeNone']
		}
	}
	
	public getRemoteNotificationTypes(): any {
		
	}





	/*================================
	=            LOCATION            =
	================================*/

	public isLocationPresent(): boolean {
		return CLLocationManager.locationServicesEnabled()
	}

	/*================================
	=            CONTACTS            =
	================================*/

	public getContactsAuthorizationStatus(): number {
		return ABAddressBookGetAuthorizationStatus()
	}

	public isContactsAuthorized(): boolean {
		return this.getContactsAuthorizationStatus() == this.AUTHORIZED
	}

	public requestContactsAuthorization(): Promise<any> {
		return new Promise((resolve, reject) => {
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

