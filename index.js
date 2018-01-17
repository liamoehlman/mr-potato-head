var dialects = {
        mysql: require('./dialects/mysql'),
        postgres: require('./dialects/postgres')
    };

function mrPotatoHead(config) {
    var dialect = dialects[config.dialect];

    if (!dialect) {
        throw new Error('Unsupported database dialect');
    }

    return dialect(config);
}

module.exports = mrPotatoHead;