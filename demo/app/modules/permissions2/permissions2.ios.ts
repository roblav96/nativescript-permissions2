// 

import * as platform from 'platform'
import {openUrl} from 'utils/utils'
import {find, isString, isFinite} from 'lodash'
declare var ABAddressBookGetAuthorizationStatus: any
declare var ABAuthorizationStatus: any
declare var ABAddressBookRequestAccessWithCompletion: any
declare var ABAddressBookCreateWithOptions: any
declare var UIApplicationOpenSettingsURLString: any
declare var CLLocationManager: any
declare var CLAuthorizationStatus: any
declare var CLLocationManagerDelegate: any
declare var locationManagerDidUpdateToLocationFromLocation: any
declare var UIImagePickerController: any
declare var UIImagePickerControllerSourceType: any
declare var UIImagePickerControllerCameraDevice: any
declare var PHAuthorizationStatus: any
declare var AVAuthorizationStatus: any
declare var AVCaptureDevice: any
declare var AVMediaTypeVideo: any
declare var PHPhotoLibrary: any
declare var UIApplication: any
declare var UIUserNotificationSettings: any
declare var UIUserNotificationType: any
declare var UIBackgroundRefreshStatus: any
declare var AVAudioSession: any
declare var AVAudioSessionRecordPermission: any
declare var EKAuthorizationStatus: any
declare var EKEventStore: any
declare var EKEntityTypeEvent: any



// class LocationManager extends CLLocationManagerDelegate {

// 	constructor() { }

// 	private locationManagerDidChangeAuthorizationStatus(manager: any, status: number): void {
// 		global.tnsconsole.log('manager', manager)
// 		global.tnsconsole.dump('manager', manager)
// 		global.tnsconsole.log('status', status)
// 		global.tnsconsole.dump('status', status)
// 	}

// }

class Permissions2 {

	// get these numbers from ABAuthorizationStatus, AVAuthorizationStatus, etc.
	public status: any = {}
	private addressBook: any = ABAddressBookCreateWithOptions(null, null)
	private osVersion: number = parseFloat(platform.device.osVersion) // parses the first decimal place
	private eventStore: any = null
	// private locationManager: any

	constructor() {

		this.mapStatus('BackgroundRefresh', UIBackgroundRefreshStatus)
		this.mapStatus('Contacts', ABAuthorizationStatus)
		this.mapStatus('Camera', AVAuthorizationStatus)
		this.mapStatus('Pictures', PHAuthorizationStatus)
		this.mapStatus('Location', CLAuthorizationStatus)
		this.mapStatus('Microphone', AVAudioSessionRecordPermission)
		this.mapStatus('Calendar', EKAuthorizationStatus)

		// this.locationManager = new LocationManager()
		// global.tnsconsole.log('this.locationManager', this.locationManager)
		// global.tnsconsole.dump('this.locationManager', this.locationManager)

	}

	/*===============================
	=            HELPERS            =
	===============================*/

	private mapStatus(key: string, obj: any): any {
		this.status[key] = {}
		let statuses = ['NotDetermined', 'Restricted', 'Denied', 'Authorized', 'Available', 'AuthorizedAlways', 'AuthorizedWhenInUse', 'Undetermined', 'Granted']
		let i, len = statuses.length
		for (i = 0; i < len; i++) {
			let index = find(obj, function(vv, ii) {
				if (isString(ii) && ii.indexOf(statuses[i]) != -1) {
					return true
				}
			})
			if (isFinite(index)) {
				this.status[key][statuses[i]] = obj[obj[index]]
			} else {
				this.status[key][statuses[i]] = -1
			}
		}
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
		return this.getCameraAuthorizationStatus() == this.status['Camera']['Authorized']
	}

	public isCameraAvailable(): boolean {
		return this.isCameraPresent() && this.isCameraAuthorized()
	}

	public requestCameraAuthorization(): Promise<any> {
		return new Promise(function(resolve) {
			AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(AVMediaTypeVideo, resolve)
		})
	}

	/*================================
	=            PICTURES            =
	================================*/

	public getPicturesAuthorizationStatus(): number {
		return PHPhotoLibrary.authorizationStatus()
	}

	public isPicturesAuthorized(): boolean {
		return this.getPicturesAuthorizationStatus() == this.status['Pictures']['Authorized']
	}

	public requestPicturesAuthorization(): Promise<any> {
		return new Promise((resolve) => {
			PHPhotoLibrary.requestAuthorization((status) => {
				return resolve(status == this.status['Pictures']['Authorized'])
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

	/*=====  THIS NEEDS TESTING  ======*/
	public getRemoteNotificationTypes(): any {
		let enables: any = []
		let sharedApp = UIApplication.sharedApplication()
		if (this.osVersion >= 8) {
			// iOS8+
			let types: number = sharedApp.currentUserNotificationSettings().types
			if (types == UIUserNotificationType['UIUserNotificationTypeNone']) {
				enables.push('none')
			}
			if (types & UIUserNotificationType['UIUserNotificationTypeAlert']) { // bitwise &
				enables.push('alert')
			}
			if (types & UIUserNotificationType['UIUserNotificationTypeBadge']) {
				enables.push('badge')
			}
			if (types & UIUserNotificationType['UIUserNotificationTypeSound']) {
				enables.push('sound')
			}
		} else {
			// iOS7 and below
			let types: number = sharedApp.enabledRemoteNotificationTypes
			if (types == UIUserNotificationType['UIUserNotificationTypeNone']) {
				enables.push('none')
			}
			if (types & UIUserNotificationType['UIUserNotificationTypeAlert']) {
				enables.push('alert')
			}
			if (types & UIUserNotificationType['UIUserNotificationTypeBadge']) {
				enables.push('badge')
			}
			if (types & UIUserNotificationType['UIUserNotificationTypeSound']) {
				enables.push('sound')
			}
		}
		return enables
	}

	/*==========================================
	=            BACKGROUND REFRESH            =
	==========================================*/

	public getBackgroundRefreshStatus(): number {
		let sharedApp = UIApplication.sharedApplication()
		return sharedApp.backgroundRefreshStatus
	}

	public isBackgroundRefreshAuthorized(): boolean {
		return this.getBackgroundRefreshStatus() == UIBackgroundRefreshStatus['UIBackgroundRefreshStatusAvailable']
	}

	/*================================
	=            LOCATION            =
	================================*/

	public isLocationEnabled(): boolean {
		return CLLocationManager.locationServicesEnabled()
	}

	public getLocationAuthorizationStatus(): number {
		return CLLocationManager.authorizationStatus()
	}

	public isLocationAuthorized(): boolean {
		return (
			this.getLocationAuthorizationStatus() == this.status['Location']['AuthorizedAlways']
			||
			this.getLocationAuthorizationStatus() == this.status['Location']['AuthorizedWhenInUse']
		)
	}

	public isLocationAvailable(): boolean {
		return this.isLocationEnabled() && this.isLocationAuthorized()
	}

	public requestLocationAuthorization(type: string): Promise<any> {

		// global.tnsconsole.log('this.locationManager', this.locationManager)
		// global.tnsconsole.dump('this.locationManager', this.locationManager)

		// this.locationManager.requestWhenInUseAuthorization()
		return Promise.resolve(true)

	}

	/*================================
	=            CONTACTS            =
	================================*/

	public getContactsAuthorizationStatus(): number {
		return ABAddressBookGetAuthorizationStatus()
	}

	public isContactsAuthorized(): boolean {
		return this.getContactsAuthorizationStatus() == this.status['Contacts']['Authorized']
	}

	public requestContactsAuthorization(): Promise<any> {
		return new Promise((resolve, reject) => {
			ABAddressBookRequestAccessWithCompletion(this.addressBook, function(status, error) {
				if (error) {
					return reject(new Error(error))
				} else {
					return resolve(status)
				}
			})
		})
	}



	/*==================================
	=            MICROPHONE            =
	==================================*/

	public getMicrophoneAuthorizationStatus(): number {
		let session = AVAudioSession.sharedInstance()
		return session.recordPermission()
	}

	public isMicrophoneAuthorized(): boolean {
		return this.getMicrophoneAuthorizationStatus() == this.status['Microphone']['Granted']
	}

	public requestMicrophoneAuthorization(): Promise<any> {
		let session = AVAudioSession.sharedInstance()
		return new Promise(function(resolve) {
			session.requestRecordPermission(function(status) {
				return resolve(status)
			})
		})
	}



	/*================================
	=            CALENDAR            =
	================================*/

	public getCalendarAuthorizationStatus(): number {
		return EKEventStore.authorizationStatusForEntityType(EKEntityTypeEvent)
	}

	public isCalendarAuthorized(): boolean {
		return this.getCalendarAuthorizationStatus() == this.status['Calendar']['Authorized']
	}

	public requestCalendarAuthorization(): Promise<any> {
		if (this.eventStore == null) {
			this.eventStore = new EKEventStore()
		}
		return new Promise((resolve, reject) => {
			this.eventStore.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, function(status, error) {
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

