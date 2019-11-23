const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const dis = require("open-dis");
var argv = require('yargs').argv;

var DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3000

/**
 * Read host & port as commandline arguments - or take the default if not given:
 */
var host = argv.host || DEFAULT_HOST
var port = argv.port || DEFAULT_PORT


var client = dgram.createSocket('udp4');        /** Open a UDP-Client */


/**
 * Create a Dummy EntityState-PDU and fill it with dummy data - just for testing:
 */
var disEntityStatePDU= new dis.EntityStatePdu()
disEntityStatePDU.entityID.site = 11;
disEntityStatePDU.entityID.application = 22;
disEntityStatePDU.entityID.entity = 33;

/**
 * Encode the PDU intoto networkbuffer:
 */
message = DISPduToBuffer(disEntityStatePDU);

/**
 * Send the message on network and finish
 */
client.send(message, 0, message.length, port, host, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + host +':'+ port);
    client.close()
});

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
 * DISPduToBuffer
 * Create an Buffer Object from DIS-PDU to be used for sending over networks
 * @param disPduObject Javascript buffer object - used for networking
 * @return Binary Buffer Object
 */
function DISPduFromBuffer(bufferObject) {
    var disPDU = undefined;
    // create ArrayBuffer from Buffer:
    var ab = new ArrayBuffer(bufferObject);
    
    var outputstream = new dis.OutputStream(ab)
    // Encode the DIS Object -> binary buffer
    disPduObject.encodeToBinary(outputstream);
    // Create Buffer from ArrayBuffer
    o_ResultBuffer = Buffer.from(ab);
    return o_ResultBuffer;
}

