class Shard {

  Greet = ( peer )=>{
    console.log(`Peer[${peer}] connected to the shard`);
  }

  Dismiss = ( peer )=>{}

  Propogate = ( wave )=>{}

  Deliver = ( note )=>{}

  Unpeel = ( onion )=>{}

  decrypt = ( code, cypher )=>{}

  encrypt = ( message, enigmus )=>{}

  /* WebRTC Logic ( Real-Time Video, sharing, & complex comms ) */

  // Updates the select element with the provided set of cameras
  updateCameraList = (cameras) => {
      const listElement = document.querySelector('select#availableCameras');
      listElement.innerHTML = '';
      cameras.map(camera => {
          const cameraOption = document.createElement('option');
          cameraOption.label = camera.label;
          cameraOption.value = camera.deviceId;
      }).forEach(cameraOption => listElement.add(cameraOption));
  }

  getConnectedDevices = async ( type ) => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if( type ) return devices.filter( device => device.kind === type );
      else return devices;
  }

  openMediaDevices = async ( constraints ) => {
    return await navigator.mediaDevices.getUserMedia( constraints );
  }

  // Open camera with at least minWidth and minHeight capabilities
  openCamera = async (cameraId, minWidth, minHeight) => {
      const constraints = {
          'audio': {'echoCancellation': true},
          'video': {
              'deviceId': cameraId,
              'width': {'min': minWidth},
              'height': {'min': minHeight}
              }
          }
      return await navigator.mediaDevices.getUserMedia(constraints);
  }

  playVideoFromCamera = async () => {
    try {
        const constraints = {'video': true, 'audio': true};
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.createElement( 'video');
        videoElement.setAttribute( 'id', 'local_video' );
        videoElement.setAttribute( 'autoplay', true );
        videoElement.setAttribute( 'playsinline', true );
        videoElement.setAttribute( 'controls', 'false' );
        videoElement.srcObject = stream;
        document.body.append( videoElement );
    } catch(error) {
        console.error('Error opening video camera.', error);
    }
  }

  makeCall = async () => {
      const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
      const peerConnection = new RTCPeerConnection(configuration);
      socket.addEventListener('message', async message => {
          if (message.answer) {
              const remoteDesc = new RTCSessionDescription(message.answer);
              await peerConnection.setRemoteDescription(remoteDesc);
          }
      });
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.send({'offer': offer});
  }

  constructor(){

    const { io } = require("socket.io-client");

    let config = {
      host: 'localhost',
      port: 9000,
      path: '',
      config: {
        'iceServers': [
          { urls: 'stun:stun.l.google.com:19302' }	]
        }
    };

    const socket = new io('wss://localhost:3099');

    // Set up an asynchronous communication channel that will be
    // used during the peer connection setup
    socket.addEventListener('message', message => {
        // New message from remote client received
    });

    // Send an asynchronous message to the remote client
    socket.send('Hello!');
    const peerConnection = new RTCPeerConnection( );

    peerConnection.addEventListener('track', async (event) => {
      debugger;
      const [remoteStream] = event.streams;
      const videoElement = document.createElement( 'video');
      videoElement.setAttribute( 'id', 'remote_video' );
      videoElement.setAttribute( 'autoplay', true );
      videoElement.setAttribute( 'playsinline', true );
      videoElement.setAttribute( 'controls', 'false' );
      videoElement.srcObject = remoteStream;
      document.body.append( videoElement );
    });

    socket.addEventListener('message', async message => {
        if (message.offer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.send({'answer': answer});
        }
    });

    // Listen for local ICE candidates on the local RTCPeerConnection
    peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
            socket.send({'new-ice-candidate': event.candidate});
        }
    });

    // Listen for remote ICE candidates and add them to the local RTCPeerConnection
    socket.addEventListener('message', async message => {
        if (message.iceCandidate) {
            try {
                await peerConnection.addIceCandidate(message.iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });

    // Listen for connectionstatechange on the local RTCPeerConnection
    peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            // Peers connected!
        }
    });
    
    // Listen for changes to media devices and update the list accordingly
    navigator.mediaDevices.addEventListener('devicechange', event => {
      const newCameraList = getConnectedDevices('video');
      updateCameraList(newCameraList);
    });
/*
    this.addEventListener('open', (id) => {
      console.log(`Client connected with ID: ${id}`);
      debugger;
    });
    // A peer has connected.
    this.addEventListener('connection', (id) => {
    });
    // A peer disconnected (gracefully)
    this.addEventListener('disconnect', (id) => {
      console.log(`Peer[${id}] has left the shard`);
    });
    // Propogate this wave.
    this.addEventListener('surf',( wave )=>{
      console.log( `surf: ${wave}` );
    });
    // Directly deliver this note to the address indicated.
    this.addEventListener('pass',( note )=>{
      console.log( `pass: ${note}` );
    });
    // Peel the onion to discover where to send it to next.
    this.addEventListener('peel',( onion )=>{
      console.log( `peel: ${onion}` );
    });*/
  }
}

export { Shard };
