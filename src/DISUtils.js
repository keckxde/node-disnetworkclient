function DISUtils() 
{


    /**
     * DISPduToBuffer
     * Create an Buffer Object from DIS-PDU to be used for sending over networks
     * @param disPduObject Javascript buffer object - used for networking
     * @return Binary Buffer Object
     */
    this.DISPduToBuffer= function(disPduObject) {
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
     * DISObjectFromBuffer
     *  1.) Create an ArrayBuffer - OBject from Buffer - Object
     *  2.) Create a DisPduFactory
     *  3.) Parse Arraybuffer & Create PDU using pdufactory 
     * @param buffer Javascript buffer object - used for networking
     * @return disMessage 
     */
    this.DISObjectFromBuffer = function(buffer)
    {
        let arrayBuffer = this.toArrayBuffer(buffer)

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
    this.toArrayBuffer = function(buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }



}

module.exports = DISUtils;