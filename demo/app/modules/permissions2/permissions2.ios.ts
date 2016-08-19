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
declare var NSObject: any
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



class LocationListener extends NSObject implements CLLocationManagerDelegate {

	public static ObjCProtocols = [CLLocationManagerDelegate]
	private _resolves: any // something weird is going on here that i cant initialize this with an empty array []
	private _didSetup: boolean

	private locationManagerDidChangeAuthorizationStatus(manager: any, status: number): void {
		if (!this._didSetup) {
			this._didSetup = true
			return
		}
		global.tnsconsole.dump('this._resolves', this._resolves)
		let i, len = this._resolves.length
		for (i = 0; i < len; i++) {
			this._resolves[i](status)
		}
	}

	public setupPromise(resolve: () => void): void {
		if (this._resolves == undefined) {
			this._resolves = []
		}
		this._resolves.push(resolve)
	}

}

class Permissions2 {

	// get these numbers from ABAuthorizationStatus, AVAuthorizationStatus, etc.
	public status: any = {}
	private addressBook: any = ABAddressBookCreateWithOptions(null, null)
	private osVersion: number = parseFloat(platform.device.osVersion) // parses the first decimal place
	private _eventStore: any = null
	private _locationListener: any = null
	private _locationManager: any = null
	private _resolves: any = []

	constructor() {

		this.mapStatus('BackgroundRefresh', UIBackgroundRefreshStatus)
		this.mapStatus('Contacts', ABAuthorizationStatus)
		this.mapStatus('Camera', AVAuthorizationStatus)
		this.mapStatus('Pictures', PHAuthorizationStatus)
		this.mapStatus('Location', CLAuthorizationStatus)
		this.mapStatus('Microphone', AVAudioSessionRecordPermission)
		this.mapStatus('Calendar', EKAuthorizationStatus)
		global.tnsconsole.dump('this.status', this.status)

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
				this.status[key][obj[obj[index]]] = statuses[i]
				// } else {
				// 	this.status[key][statuses[i]] = -1
			}
		}
	}

	/*=================================
	=            UTILITIES            =
	=================================*/

	public switchToSettings(): void {
		openUrl(UIApplicationOpenSettingsURLString)
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
		let status: number = this.getLocationAuthorizationStatus()
		return (
			status == this.status['Location']['AuthorizedAlways']
			||
			status == this.status['Location']['AuthorizedWhenInUse']
		)
	}

	public isLocationAvailable(): boolean {
		return this.isLocationEnabled() && this.isLocationAuthorized()
	}

	public requestLocationAuthorization(type: string = 'WhenInUse'): Promise<any> {
		let status: number = this.getLocationAuthorizationStatus()
		if (status != this.status['Location']['NotDetermined']) {
			return Promise.resolve(status)
		}

		if (this._locationListener == null) {
			this._locationListener = new LocationListener()
		}
		if (this._locationManager == null) {
			this._locationManager = new CLLocationManager()
			this._locationManager.delegate = this._locationListener
		}

		if (type == 'WhenInUse') {
			this._locationManager.requestWhenInUseAuthorization()
		} else {
			this._locationManager.requestAlwaysAuthorization()
		}

		return new Promise((resolve, reject) => {
			this._locationListener.setupPromise(resolve)
		})
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
		if (this._eventStore == null) {
			this._eventStore = new EKEventStore()
		}
		return new Promise((resolve, reject) => {
			this._eventStore.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, function(status, error) {
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

