//. dokku.js
var express = require( 'express' ),
    //bodyParser = require( 'body-parser' ),
    { exec } = require( 'child_process' ),
    api = express();

var settings_cors = 'CORS' in process.env ? process.env.CORS : '';
api.all( '/*', function( req, res, next ){
  if( settings_cors ){
    res.setHeader( 'Access-Control-Allow-Origin', settings_cors );
    res.setHeader( 'Vary', 'Origin' );
  }
  next();
});

//. bodyParser 不要？
//api.use( bodyParser.urlencoded( { extended: true } ) );
//api.use( bodyParser.json() );
api.use( express.Router() );

api.listDb = function( db ){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      var cmd1 = 'dokku ' + db + ':list';
      exec( cmd1, function( err1, stdout1, stderr1 ){
        if( stderr1 ){
          resolve( { status: false, error: stderr1 } );
        }else{
          resolve( { status: true, result: stdout1 } );
        }
      });
    }else{
      resolve( { status: false, error: 'parameter db required.' } );
    }
  });
};

api.createDb = function( db, name ){
  return new Promise( ( resolve, reject ) => {
    if( db && name ){
      var cmd1 = 'dokku ' + db + ':create ' + name;
      exec( cmd1, function( err1, stdout1, stderr1 ){
        console.log( {err1} );  //. stderr1: '/home/dokku/.basher/bash: line 1: main: command not found\n'
        console.log( {stdout1} );
        console.log( {stderr1} );
        //if( stderr1 ){
        //  resolve( { status: false, error: stderr1 } );
        //}else{
          var cmd2 = 'dokku ' + db + ':expose ' + name;
          exec( cmd2, function( err2, stdout2, stderr2 ){
        console.log( {err2} );
        console.log( {stdout2} );
        console.log( {stderr2} );
            if( stderr2 ){
              resolve( { status: false, error: stderr2 } );
            }else{
              resolve( { status: true, result: stdout2 } );
            }
          });
        //}
      });
    }else{
      resolve( { status: false, error: 'parameter db and/or name required.' } );
    }
  });
};

api.getDb = function( db, name ){
  return new Promise( ( resolve, reject ) => {
    if( db && name ){
      var cmd1 = 'dokku ' + db + ':info ' + name;
      exec( cmd1, function( err1, stdout1, stderr1 ){
        if( stderr1 ){
          resolve( { status: false, error: stderr1 } );
        }else{
          resolve( { status: true, result: stdout1 } );
        }
      });
    }else{
      resolve( { status: false, error: 'parameter db and/or name required.' } );
    }
  });
};

api.deleteDb = function( db, name ){
  return new Promise( ( resolve, reject ) => {
    if( db && name ){
      var cmd1 = 'dokku ' + db + ':destroy ' + name;
      exec( cmd1, function( err1, stdout1, stderr1 ){
        if( stderr1 ){
          resolve( { status: false, error: stderr1 } );
        }else{
          resolve( { status: true, result: stdout1 } );
        }
      });
    }else{
      resolve( { status: false, error: 'parameter db and/or name required.' } );
    }
  });
};


api.get( '/dokku/:db', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var db = req.params.db;

  api.listDb( db ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.post( '/dokku/:db/:name', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var db = req.params.db;
  var name = req.params.name;

  api.createDb( db, name ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.get( '/dokku/:db/:name', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var db = req.params.db;
  var name = req.params.name;

  api.getDb( db, name ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.delete( '/dokku/:db/:name', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var db = req.params.db;
  var name = req.params.name;

  api.deleteDb( db, name ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});


//. api をエクスポート
module.exports = api;
