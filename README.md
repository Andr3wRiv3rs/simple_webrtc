# Simple WebRTC
A WebRTC wrapper that aims to be the as short and concise as possible.<br>
<br><br>


## installation (npm)

```bash
yarn add @andrewrivers/simple_webrtc
```
or..
```
npm i --save @andrewrivers/simple_webrtc
```
<br>


## installation (es6)
```js
import SimpleWebRTC from './simple_webrtc.js'
```
[Standalone Release](https://github.com/Andr3wRiv3rs/simple_webrtc/releases/latest)
<br><br>


## usage
```ts
import SimpleWebRTC from '@andrewrivers/simple_webrtc'

const { Peer, Broadcast } = SimpleWebRTC()

const peer = Peer('local')
const offer = await peer.offer( )
const answer = await peer.answer( offer )

peer.open(answer)

peer.on('open', ( ) => ...)
peer.on('message', ( message ) => ...)
peer.on('error', ( error ) => ...)
peer.on('close', ( ) => ...)

peer.send({ abc: "def" })

Broadcast("hello world")

const camera = Peer.camera( )
const microphone = Peer.microphone( )
const screenshare = Peer.screen( )

peer.on('track', ({ streams }) => ...)

```
<br>

## methods


### connection

* `offer` creates an offer, this is the first step in establishing a connection
```ts
const offer: string = await peer.offer()
```
<br>

* `answer` creates an answer with `offer`, second step
```ts
const answer: string = await peer.answer(offer)
```
<br>

* `open` establishes a connection with `answer`
```ts
await peer.open(answer)
```
<br>


### send data

* `broadcast` sends data to all peers
```ts
const data: object | string | number = { message: 'Hello World!' }
Broadcast(data)
```
<br>

* `peer.send` sends data to a single peer
```ts
const data: object | string | number = { message: 'Hello World!' }
peer.send(data)
```
<br>


### media

The UserMedia class supports callbacks as well as asynchronous functions. Each has an `allow` and `block` parameter, which are invoked depending on a user's prompt result. [[MDN]](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) 

```ts
Peer.microphone( 
    ( stream: MediaStream ) => ... , // allow
    ( ) => ... // block
)
```
<br>


* `Peer.microphone` adds the user's microphone's audio to a peer and returns its MediaStream, if unavailable or blocked returns `null`
```ts
const stream: MediaStream | void = await Peer.microphone()
```
<br>


* `Peer.camera` adds the user's cameras's video to a peer and returns its MediaStream, if unavailable or blocked returns `null`
```ts
const stream: MediaStream | void = await Peer.camera()
```
<br>


* `Peer.screen` prompts the user for a display/window/tab (with audio when available) and adds the user's choice to a peer  and returns its MediaStream, if unavailable or blocked returns `null`
```ts
const stream: MediaStream | void = await Peer.screen()
```
<br>

* `Peer.custom` uses custom constraints [[MDN]](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints) to add the resulting MediaStream to a peer and returns its MediaStream, if unavailable or blocked returns `null`

```ts
const stream: MediaStream | void = await Peer.custom({
   video: true,  // default `false`
   audio: false, // default `false`
   screen: false // default `false`
})
```
callback syntax for `Peer.custom`:
```ts
Peer.custom( constraints, allow, block )
```
<br>


## events

All events return `async` functions, so all events can be used in combination with `await`. 
```js
await peer.on('open')
```
Note that many of these events have no practical reason to be used this way, it is only for consistency and flexibility that it is provided.<br>
<br>


* `open`  a connection has been established, following `Peer.open()`
```ts
peer.on('open', () => {
    /* connection established, can transceive data */
})
```
<br>


* `message` data has been received, either by `Peer.broadcast()` or `DataChannel.send()`
```ts
peer.on('message', ( data: string | number | object ) => {
    /* if config.json is true, data will be parsed already */
})
```
<br>


* `icecandidate` ICE candidate has been found, handled internally and can be ignored
```ts
peer.on('icecandidate', ( candidate: RTCIceCandidate ) => ... )
```
<br>


* `track` track has been added via `media` [[MDN]](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack)
```ts
peer.on('track', ({ streams } : { streams: MediaStream[] }) => ... )
```
<br>


* `error` handled by `config.debug`
```ts
peer.on('error', ( method: string, message: string ) => ... )
```
<br>


* `log` handled by `config.log`
```ts
peer.on('log', ( message: string ) => ... )
```
<br>

---

<br>

If you have any questions or you're having trouble getting set up, feel free to message me.

E-Mail: [andrewarivers@gmail.com](mailto:andrewarivers@gmail.com)<br>
Twitter: [@Andr3wRiv3rs](https://twitter.com/Andr3wRiv3rs)<br>
Discord: [PoisonApple#9351](https://discordapp.com/)