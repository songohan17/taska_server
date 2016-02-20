var config = {};
config.db = {};
config.primary = {};

// set configurations here
config.port = 3030; // the application will run at that port http://localhost:port
config.db.host = 'localhost'; // database host
config.db.port = '3306'; // database port
config.db.database = 'taska'; // database name
config.db.user = 'root'; // database user
config.db.password = 'qwe123'; // database password
// end of configuration section

module.exports = config;