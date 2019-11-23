const dgram = require('dgram');
var argv = require('yargs').argv;

const server = dgram.createSocket('udp4');
const dis = require("open-dis")

const DEFAULT_PORT = 3000

/**
 * Read port as commandline arguments - or take the default if not given:
 */
var port = argv.port || DEFAULT_PORT

/**
 * Messagehandler
 * 
 */
server.on('message', (msg, rinfo) => {
  console.log(`server got msg from ${rinfo.address}:${rinfo.port}`);

  try
  {
    var disMessage = createDISObjectFromBuffer(msg);
    switch(disMessage.pduType)
    {
        case 1: // EntityState PDU:
            var entityID = disMessage.entityID;
            var location = disMessage.entityLocation;
            var marking  = disMessage.marking.getMarking();

            console.log("Got EntityState:", entityID, "Location", location, "Marking", marking )
           
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


/**
 * createDISObjectFromBuffer
 *  1.) Create an ArrayBuffer - OBject from Buffer - Object
 *  2.) Create a DisPduFactory
 *  3.) Parse Arraybuffer & Create PDU using pdufactory 
 * @param buffer Javascript buffer object - used for networking
 * @return disMessage 
 */
function createDISObjectFromBuffer(buffer)
{
    let arrayBuffer = toArrayBuffer(buffer)

    var pduFactory = new dis.PduFactory();
    var disMessage = pduFactory.createPdu(arrayBuffer) 
    return disMessage 
}

/**
 * DISPduToBuffer
 * Create an Buffer Object from DIS-PDU to be used for sending over networks
 * @param disPduObject Javascript buffer object - used for networking
 * @return Binary Buffer Object
 */
function DISPduToBuffer(disPduObject) {
    var o_ResultBuffer = undefined;
    /**
     * Initialize ArrayBuffer & DIS-Outputstream to be used for the encoding
     */
    var ab = new ArrayBuffer(1500);
    var outputstream = new dis.OutputStream(ab)
    // Encode the DIS Object -> binary buffer
    disPduObject.encodeToBinary(outputstream);
    // Create Buffer from ArrayBuffer
    o_ResultBuffer = Buffer.from(ab);
    return o_ResultBuffer;
}

/**
 * toArrayBuffer
 *  1.) Create an ArrayBuffer - Object from Buffer - Object
 * @param buffer Javascript buffer object - used for networking
 * @return ArrayBuffer Object (used by DIS Implementation) 
 */
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}