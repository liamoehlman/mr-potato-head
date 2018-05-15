const righto = require('righto');
const { Client } = require('pg');

const createTableQuery =
    'CREATE TABLE IF NOT EXISTS public.migration_lock (locked integer, expires timestamp without time zone) WITH (OIDS=FALSE);';

function updateLock(connection, expiry, callback) {
    connection.query(
        {
            text: 'UPDATE migration_lock set expires = $1',
            values: [expiry],
        },
        callback,
    );
}

function insertLock(connection, expiry, callback) {
    connection.query(
        {
            text: 'INSERT INTO migration_lock VALUES (1, $1);',
            values: [expiry],
        },
        callback,
    );
}

function checkOrGetLock(connection, lockWaitTimeout, lockErrorTimeout, callback) {
    connection.query('SELECT * FROM migration_lock;', (error, result) => {
        if (error) {
            return callback(error);
        }

        if (result.rows.length > 1) {
            return callback(new Error('Unable to get lock - more than one lock exists'));
        }

        const now = Date.now();
        const expiry = new Date(now + lockWaitTimeout);

        if (result.rows.length) {
            if (now - new Date(result.rows[0].expires) > lockWaitTimeout) {
                return updateLock(connection, expiry, callback);
            }

            if (now < lockErrorTimeout) {
                return setTimeout(checkOrGetLock, 500, connection, lockWaitTimeout, lockErrorTimeout, callback);
            }

            return callback(new Error('Unable to get lock - timeout'));
        }

        insertLock(connection, expiry, callback);
    });
}

function createTable(connection, callback) {
    connection.query(createTableQuery, callback);
}

function postgres(config) {
    const lockWaitTimeout = (config.lockWaitTimeout || 5) * 1000;
    const lockErrorTimeout = Date.now() + 60000;
    const connection = new Client({
        host: config.host,
        user: config.user || config.username,
        password: config.password,
        database: config.database,
    });

    connection.connect();

    return {
        lock: function(callback) {
            const tables = righto(createTable, connection);
            const lock = righto(checkOrGetLock, connection, lockWaitTimeout, lockErrorTimeout, righto.after(tables));

            lock(callback);
        },
        close: function(callback) {
            connection.query('DELETE from migration_lock;', error => {
                if (error) {
                    return callback(error);
                }

                connection.end(callback);
            });
        },
    };
}

module.exports = postgres;
