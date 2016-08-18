import {Observable} from 'data/observable';
import {Permissions2} from './modules/permissions2'
// var Permissions2 = require('./modules/permissions2')

export class HelloWorldModel extends Observable {
	public message: string;

	constructor() {
		super();

		console.dump(Permissions2);
		new Permissions2()

		this.message = "haiii"
	}
}
