const fs = require( "fs" );
const http = require( "http" );
const https = require( "https" );
const express = require( "express" );
const helmet = require( "helmet" );

// Replace the following with your own domain certificate path
const certificatePath = `/etc/letsencrypt/live/snykdemo.instafluff.tv/`;
const privateKey = fs.readFileSync( `${certificatePath}/privkey.pem`, "utf8" );
const certificate = fs.readFileSync( `${certificatePath}/fullchain.pem`, "utf8" );
// Add the following if your certificate includes a certificate chain
// const ca = fs.readFileSync( `${certificatePath}/chain.pem`, "utf8" );

const credentials = {
    key: privateKey,
    cert: certificate,
    // ca: ca, // Add the ca if there is a certificate chain
};

const app = express();
// Option 1: Use Helmet for HSTS
app.use( helmet() );
app.use( helmet.hsts( { maxAge: 300, includeSubDomains: true, preload: true } ) );

app.use( ( req, res ) => {
    // Option 2: Manually set HSTS header
    // if( req.secure ) {
    //      res.setHeader( "Strict-Transport-Security", "max-age=300; includeSubDomains; preload" );
    // }
    res.send( "Hello secure web!" );
});

const httpServer = http.createServer( app );
httpServer.listen( 80, () => {
	console.log( "HTTP server started" );
});

const httpsServer = https.createServer( credentials, app );
httpsServer.listen( 443, () => {
	console.log( "HTTPS server started" );
});
