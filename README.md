# mr-potato-head

Get an arbitrary, common mysql lock

## Installation

```bash
$ npm install --save mr-potato-head

# And one of the following:
$ npm install --save pg
$ npm install --save mysql2
```

## Usage

```javascript
var mrPotatoHead = require('mr-potato-head');

mrPotatoHead({
    dialect: 'mysql', // or postgres
    host: 'localhost',
    username: 'database',
    password: 'databasepassword',
    database: 'databasename',
}).lock(function(error) {
    if (error) {
        // no lock for you!
    }
});
```
