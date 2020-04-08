const client = require('mysql2');

const lockQuery = 'SELECT GET_LOCK(?, ?)';

function mysql(config) {
    const lockWaitTimeout = config.lockWaitTimeout || 5;
    const lockName = config.lockName || 'mr-potato-head';
    const connection = client.createConnection({
        host: config.host,
        port: config.port || 3306,
        user: config.user || config.username,
        password: config.password,
        database: config.database,
    });

    connection.connect();

    return {
        lock: function (callback) {
            connection.query(lockQuery, [lockName, lockWaitTimeout], (error, rows) => {
                if (error) {
                    return callback(error);
                }

                callback(!rows[0][Object.keys(rows[0])]);
            });
        },
        close: function (callback) {
            connection.end(callback);
        },
    };
}

module.exports = mysql;
