var mysql = require('mysql'),
    lockQuery = 'SELECT GET_LOCK(?, ?)';

function mysql(config) {
    var lockWaitTimeout = config.lockWaitTimeout || 5,
        lockName = config.lockName || 'mr-potato-head',
        connection = mysql.createConnection({
            host: config.host,
            user: config.user || config.username,
            password: config.password,
            database: config.database
        });

    connection.connect();

    return {
        lock: function(callback) {
            connection.query(lockQuery, [lockName, lockWaitTimeout], function(error, rows) {
                if (error) {
                    return callback(error);
                }

                callback(!rows[0][Object.keys(rows[0])]);
            });
        },
        close: function(callback) {
            connection.end(callback);
        }
    };
}

module.exports = mysql;