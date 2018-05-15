function mrPotatoHead(config) {
    let dialect;

    switch (config.dialect) {
        case 'mysql':
            dialect = require('./dialects/mysql');
            break;
        case 'postgres':
            dialect = require('./dialects/postgres');
            break;
        default:
            throw new Error('Unsupported database dialect');
    }

    return dialect(config);
}

module.exports = mrPotatoHead;
