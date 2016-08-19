// 

import * as platform from 'platform'
import * as application from 'application'
declare let android: any



class Permissions2 {

	public status: any = {}
	private _osVersion: number = parseFloat(platform.device.osVersion) // parses up to the first decimal place
	private _sdkVersion: number = parseFloat(platform.device.sdkVersion)

	constructor() {
		global.tnsconsole.log('this._sdkVersion', this._sdkVersion)
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

	/*================================
	=            LOCATION            =
	================================*/

	public isLocationAvailable(): boolean {

	}

	public isGpsLocationAvailable(): boolean {
		let result: boolean = this.isGpsLocationEnabled() && this.isLocationAuthorized()
	}

	public isGpsLocationEnabled(): boolean {
		let mode: number = this.getLocationMode()
		let result: boolean = (mode == 3 || mode == 1)
		return result
	}

	public isLocationAuthorized(): boolean {

	}

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

	private isLocationProviderEnabled(provider: string): boolean {
		return android.location.LocationManager.isProviderEnabled(provider)
	}

}

export default new Permissions2()





















































// 

