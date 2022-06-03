# Pro Inspector
[![Image](https://img.shields.io/npm/v/@reiryoku/pro-inspector)](https://www.npmjs.com/package/@reiryoku/pro-inspector)
[![Image](https://img.shields.io/npm/l/@reiryoku/pro-inspector)](LICENSE)
<br>

A JavaScript utility improving inspection of objects on Node.js.

## Introduction
Let's suppose that we have this declaration.
```javascript
class Person {
    constructor (firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    get fullName () {
        return `${this.firstName} ${this.lastName}`;
    }
    
    drink () {
        // ...
    }
    
    async read () {
        // ...
    }
}
```

Now let's create an instance of this class and log it using our beloved `console.log`.
```javascript
console.log(new Person("John", "Chen"));
```
This is the log in our console.
```console
Person { firstName: 'John', lastName: 'Chen' }
```
Where is the problem? The getter is not visible and the methods are not visible. This is because
by default certain class properties are not enumerable. This would happen also with a literal
object (only for getters).

Pro Inspector solves this issues by reading the descriptors of the logged entities and presenting
them with a nice syntax highlighted format.

This is the log with Pro Inspector.
<p align="center">
    <img src="images/introduction.png" alt=""/>
</p>
