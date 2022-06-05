import {ProInspector} from "./src/ProInspector.js";

ProInspector.activateGlobally();

class Person {
    constructor (firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.muzeca = [2,3,4];
    }

    get fullName () {
        return `${this.firstName} ${this.lastName}`;
    }

    drink () {
        // ...
    }

    async read (ok) {
        // ...
    }
}

console.log(new Person("saa", "add"));
