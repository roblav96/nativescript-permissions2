// 

import * as platform from 'platform'
import * as application from 'application'
declare let android: any



class Permissions2 {

	public status: any = {}
	private osVersion: number = parseFloat(platform.device.osVersion) // parses up to the first decimal place
	private sdkVersion: number = parseFloat(platform.device.sdkVersion)

	constructor() {
		global.tnsconsole.log('this.sdkVersion', this.sdkVersion)
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

	/*================================
	=            LOCATION            =
	================================*/

	public isLocationAvailable(): boolean {

	}

	public isGpsLocationAvailable(): boolean {

	}

	public isGpsLocationEnabled(): boolean {

	}

	public isLocationAuthorized(): boolean {

	}

	public getLocationMode(): number {
		let mode = 0
		if (this.sdkVersion >= 19) {
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

