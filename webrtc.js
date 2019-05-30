const Emitter = require('./emitter.js')

module.exports = function (config = {}) {
    Emitter(this)

    const peerConnection = new RTCPeerConnection(config)
    this.peerConnection = peerConnection;

    peerConnection.ondatachannel = event => {
        event.channel.onopen = () => this.emit('open')
        event.channel.onmessage = message => this.emit('message', JSON.parse(message.data))
        event.channel.onerror = error => this.emit('error', error)
    }

    const dataChannel = peerConnection.createDataChannel( "main", { reliable: true } );
    this.dataChannel = dataChannel

    peerConnection.onerror = event => this.emit('error', event)

    this.on('error', console.log)

    peerConnection.onicecandidate = event => { 
        if (event.candidate) this.emit('icecandidate', event.candidate)
    }

    peerConnection.ontrack = event => { 
        this.emit('track', event)
    }

    const setLocalDescription = offer =>
        peerConnection.setLocalDescription(new (RTCSessionDescription || wrtc.RTCSessionDescription)(offer))

    const setRemoteDescription = offer => 
        peerConnection.setRemoteDescription(new (RTCSessionDescription || wrtc.RTCSessionDescription)(offer))

    Object.assign(this, {
        setLocalDescription,
        setRemoteDescription
    })

    this.offer = () => new Promise ( (resolve, reject) => {
        peerConnection.createOffer(
            offer => {
                setLocalDescription(offer)
                resolve(offer)
            },

            reject
        )
    })

    this.answer = offer => new Promise ( (resolve, reject) => {
        setRemoteDescription(offer)
        peerConnection.createAnswer( 
            offer => {
                setLocalDescription(offer)
                resolve(offer)
            },

            reject
        )
    })

    this.addIceCandidate = candidates => {
        if (Array.isArray(candidates)) 
            for (const candidate of candidates) 
                peerConnection.addIceCandidate(new (RTCIceCandidate || wrtc.RTCIceCandidate)(candidate))
        else 
            peerConnection.addIceCandidate(new (RTCIceCandidate || wrtc.RTCIceCandidate)(candidates))
    }

	this.addTrack = (track, streams = []) => {
		if (!Array.isArray(streams)) streams = [streams]
		peerConnection.addTrack(track, ...streams)
	}

    this.send = data => dataChannel.send(JSON.stringify(data))
}