# node-disnetworkclient
Example implementations for UDP client/server exchanging DIS (Distributed Interactive Simulation) packages

## Installation

Get the source:

```
git clone https://github.com/keckxde/node-disnetworkclient.git
```

Install the dependencies:

```
cd node-disnetworkclient
npm install
```

Run the Server - by default listening on port 3000:

```
npm run-script server

Result:

> node src/dis-udpserver.js

server listening 0.0.0.0:3000
```

Run the Client - by default sending to localhost:3000 :

```
npm run-script client

Result:
> node src/dis-udpclient.js

UDP message sent to 127.0.0.1:3000
```

After that, you will see, a DIS EntityState PDU was sent to server
```
server got msg from 127.0.0.1:64528
Got EntityState: { site: 11, application: 22, entity: 33 } Location { x: 0, y: 0, z: 0 } 
Marking
```


#Writing an own client

See example implementation in [dis-udpclient.js](./src/dis-udpclient.js) as a starting point


#Writing an own server


See example implementation in [dis-udpserver.js](./src/dis-udpserver.js) as a starting point
