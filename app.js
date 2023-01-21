//. app.js
var express = require( 'express' ),
    app = express();

var api = require( './api/dokku' );
app.use( '/api', api );

app.use( express.static( __dirname + '/public' ) );

var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
