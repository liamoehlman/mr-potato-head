# mr-potato-head
Get an arbitrary, common mysql lock

    var mrPotatoHead = require('mr-potato-head');

    mrPotatoHead({
        host: 'localhost',
        username: 'database',
        password: 'databasepassword',
        database: 'databasename'
    }).lock(function(error) {
        if (error) {
            // no lock for you!
        }
    });