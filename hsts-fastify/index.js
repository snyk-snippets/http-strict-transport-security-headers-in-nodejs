const fs = require( "fs" );
const helmet = require( "@fastify/helmet" );

// Replace the following with your own domain certificate path
const certificatePath = `/etc/letsencrypt/live/snykdemo.instafluff.tv/`;
const fastify = require( "fastify" )({
    https: {
        key: fs.readFileSync( `${certificatePath}/privkey.pem`, "utf8" ),
        cert: fs.readFileSync( `${certificatePath}/fullchain.pem`, "utf8" ),
        // // Add the following if your certificate includes a certificate chain
        // ca: fs.readFileSync( `${certificatePath}/chain.pem`, "utf8" ),
    },
});
const fastifyHttp = require( "fastify" )();

// Option 1: Use Helmet for HSTS
const hsts = { maxAge: 300, includeSubDomains: true, preload: true };
fastify.register( helmet, { hsts } );
fastifyHttp.register( helmet, { hsts } );

fastify.get( "/", ( req, res ) => {
    // Option 2: Manually set HSTS header
    // res.header( "Strict-Transport-Security", "max-age=300; includeSubDomains; preload" );
    res.send( "Hello secure web!" );
});
fastifyHttp.get( "/", ( req, res ) => {
    // Option 2: Manually set HSTS header
    // res.header( "Strict-Transport-Security", "max-age=300; includeSubDomains; preload" );
    res.send( "Redirect to HTTPS" );
});

fastifyHttp.listen( { port: 80, host: "0.0.0.0" }, ( err, address ) => {
    console.log( "HTTP server started" );
});

fastify.listen( { port: 443, host: "0.0.0.0" }, ( err, address ) => {
    console.log( "HTTPS server started" );
});
