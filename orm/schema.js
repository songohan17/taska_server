var schema = {};

schema.tables = {};
schema.getIdFieldname = function(tableName){
    if(schema.tables[tableName].primary !== undefined){
        return schema.tables[tableName].primary;
    }else{
        return 'id';
    }
};
schema.isAutoincement = function(tableName){
    if(schema.tables[tableName].autoincrement !== undefined){
        return schema.tables[tableName].autoincrement;
    }else{
        return true;
    }
};
schema.isView = function(tableName){
    if(schema.tables[tableName].type == 'VIEW'){
        return true;;
    }else{
        return false;
    }
};
schema.init = function(db_pool, callback){
	// Get a connection to the database
    db_pool.getConnection( function ( err, con ){
        // check for any connection errors
        if( err ){
            // There was an error, so send JSON with an error message and an HTTP status of 503 (Service Unavailable)
            sendError( res, 503, 'error', 'connection', err );
        }else{
            // connected
            // create SELECT query
            var strQuery  = "SHOW FULL TABLES";
            
            // execute query
            con.query(
                strQuery,
                function ( err, rows, fields ){
                    if( err ){ 
                        // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                        sendError( res, 500, 'error', 'query', err );
                    }else{
                    	var tablecount = rows.length;
                    	for (var row in rows) {
                    		var table = rows[row][fields[0].name];
			                schema.tables[table] = {};
			                schema.tables[table].type = rows[row]['Table_type'];
			            }
			            schema.i = -1;
			            for (var table2 in schema.tables) {
			            	schema.loadFields(con, table2, tablecount, callback);
			            }  
                    }
                }
            );
            con.release();
            
        }
    });
	// load tables 
	// load fields
	// 
schema.loadFields = function(con, tableName, tablecount, callback){
	var strQuery  = "SHOW COLUMNS FROM "+tableName;
	con.query(
        strQuery,
        function ( err, rows, fields ){
        	schema.i = schema.i + 1;
            if( err ){ 
            	console.log('ERROR');
                // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                sendError( res, 500, 'error', 'query', err );
            }else{
            	schema.tables[tableName].autoincrement = false;
            	schema.tables[tableName].fields = rows;
            	for(var i = 0; i < rows.length; i++){
            		if(rows[i]['Key'] == 'PRI'){
            			schema.tables[tableName].primary = rows[i]['Field'];
            		}
            		if(rows[i]['Extra'] == 'auto_increment'){
            			schema.tables[tableName].autoincrement = true;
            		}

            	}

            	if(schema.i == (tablecount-1)){
            		callback();
            	}
            }
        }
    );
}
	
};
module.exports = schema;