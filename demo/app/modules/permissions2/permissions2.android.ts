// 

import * as platform from 'platform'
import * as application from 'application'
declare let android: any
declare let java: any



class Permissions2 {

	public status: any = {}
	private _osVersion: number = parseFloat(platform.device.osVersion) // parses up to the first decimal place
	private _sdkVersion: number = parseFloat(platform.device.sdkVersion)

	constructor() {
		global.tnsconsole.log('this._osVersion', this._osVersion)
		global.tnsconsole.log('this._sdkVersion', this._sdkVersion)

		this.status = {
			1: 'STATUS_NOT_REQUESTED_OR_DENIED_ALWAYS',
		}
	}

	/*===============================
	=            HELPERS            =
	===============================*/

	private _hasPermission(permission: string): boolean {
		if (!android.support || !android.support.v4 || !android.support.v4.content || !android.support.v4.content.ContextCompat || !android.support.v4.content.ContextCompat.checkSelfPermission) {
			return true
		}

		// Interesting, this actually works on API less than 23 and will return false if the manifest permission was forgotten
		let doesHavePermission: boolean = (
			android.content.pm.PackageManager.PERMISSION_GRANTED
			==
			android.support.v4.content.ContextCompat.checkSelfPermission(application.android.foregroundActivity, android.Manifest.permission[permission])
		)
		return doesHavePermission
	}

	private _getPermissionAuthorizationStatus(permission: string): boolean {

	}

	private _shouldShowRequestPermissionRationale(permission: string): boolean {
		global.tnsconsole.log('_shouldShowRequestPermissionRationale > permission', permission)

		let should: boolean
		try {
			// // global.tnsconsole.dump('android.support.v4.app.ActivityCompat', android.support.v4.app.ActivityCompat)

			// let method = android.app.Activity.class.getMethod(
			// 	// let method = android.support.v4.app.ActivityCompat.class.getMethod(
			// 	"shouldShowRequestPermissionRationale",
			// 	android.app.Activity.class,
			// 	java.lang.String.class
			// )
			// global.tnsconsole.dump('method', method)
			// // let bool = method.invoke(null, application.android.foregroundActivity, permission)
			// // global.tnsconsole.dump('bool', bool)

			should = android.support.v4.app.ActivityCompat.shouldShowRequestPermissionRationale(
				application.android.foregroundActivity,
				android.Manifest.permission[permission]
			)
		} catch (err) {
			global.tnsconsole.error('err', err)
			should = false
		}

		return should
	}

	/*=================================
	=            UTILITIES            =
	=================================*/

	public switchToSettings(): void {
		let intent = new android.content.Intent(android.provider.Settings['ACTION_APPLICATION_DETAILS_SETTINGS'])
		let uri = android.net.Uri.fromParts('package', application.android.foregroundActivity.getPackageName(), null)
		intent.setData(uri)
		application.android.foregroundActivity.startActivity(intent)
	}

	public switchToLocationSettings(): void {
		let intent = new android.content.Intent(android.provider.Settings['ACTION_LOCATION_SOURCE_SETTINGS'])
		application.android.foregroundActivity.startActivity(intent)
	}

	/*================================
	=            LOCATION            =
	================================*/

	public getLocationMode(): number {
		let mode = 0
		if (this._sdkVersion >= 19) {
			mode = android.provider.Settings.Secure.getInt(
				application.android.foregroundActivity.getContentResolver(),
				android.provider.Settings.Secure.LOCATION_MODE
			)
		} else {
			if (
				this.isLocationProviderEnabled(android.location.LocationManager['GPS_PROVIDER']) &&
				this.isLocationProviderEnabled(android.location.LocationManager['NETWORK_PROVIDER'])
			) {
				mode = 3
			} else if (this.isLocationProviderEnabled(android.location.LocationManager['GPS_PROVIDER'])) {
				mode = 1
			} else if (this.isLocationProviderEnabled(android.location.LocationManager['NETWORK_PROVIDER'])) {
				mode = 2
			} else {
				mode = 0
			}
		}
		return mode
	}

	public isLocationAvailable(): boolean {
		let result: boolean = this.isLocationEnabled() && this.isLocationAuthorized()
		return result
	}

	public isLocationEnabled(): boolean {
		let mode: number = this.getLocationMode()
		let result: boolean = (mode == 3 || mode == 1)
		return result
	}

	public isLocationAuthorized(): boolean {
		let fineAuthed: boolean = this._hasPermission('ACCESS_FINE_LOCATION')
		let coarseAuthed: boolean = this._hasPermission('ACCESS_COARSE_LOCATION')
		return fineAuthed || coarseAuthed
	}

	private isLocationProviderEnabled(provider: string): boolean {
		return android.location.LocationManager.isProviderEnabled(provider)
	}

	public getLocationAuthorizationStatus(): number {
		let should: boolean = this._shouldShowRequestPermissionRationale('ACCESS_FINE_LOCATION')
		global.tnsconsole.log('should', should)
		return 0
	}

}

export default new Permissions2()





















































// 

