const dgram = require('dgram');
const argv = require('yargs').argv;
const dis = require("open-dis")
const DISUtils = require('./DISUtils');

var utils = new DISUtils();


const DEFAULT_PORT = 3000

/**
 * Read port as commandline arguments - or take the default if not given:
 */
var port = argv.port || DEFAULT_PORT


var server = dgram.createSocket('udp4');

/**
 * Messagehandler
 * 
 */
server.on('message', (msg, rinfo) => {
  console.log(`server got msg from ${rinfo.address}:${rinfo.port}`);

  try
  {
    var disMessage = utils.DISObjectFromBuffer(msg);
    switch(disMessage.pduType)
    {
        case 1: // EntityState PDU:
            var entityID = disMessage.entityID;
            var location = disMessage.entityLocation;
            var marking  = disMessage.marking.getMarking();

            console.log("Got EntityState:", entityID, "Location", location, "Marking: \'" + marking + "\'"             )
           
            break;
        case 20: // Data PDU:
            console.log("Got DataPDU:")
            break;
        default:
            console.log("Got Other PDU:", )
    }
  }catch(e)
  {
      console.log("Exception:",disMessage.pduType)
  }
 
});

/**
 * Some debug message to show errors
 */
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

/**
 * Some debug message to show, when the server started listening
 */
server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

/**
 * Actually start listening on port:
 */
server.bind(port);