import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaPhoneSlash,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * VideoCall Component
 * Implements WebRTC video/audio consultation using SimplePeer and Socket.IO
 * 
 * @param {string} consultationId - Unique ID for the consultation session
 * @param {boolean} isInitiator - Whether this user initiates the call (typically the doctor)
 * @param {function} onCallEnd - Callback when call ends
 */
const VideoCall = ({ consultationId, isInitiator = false, onCallEnd }) => {
  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  // State management
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  /**
   * Initialize Socket.IO connection and WebRTC peer
   */
  useEffect(() => {
    // Connect to Socket.IO server
    // Remove /api suffix from VITE_API_URL for Socket.IO connection
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketUrl = apiUrl.replace('/api', '');

    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Socket event handlers
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id);
      socketRef.current.emit('join-consultation', consultationId);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setConnectionError('Failed to connect to server');
      setIsConnecting(false);
    });

    socketRef.current.on('user-joined', (userId) => {
      console.log('👤 User joined:', userId);
      toast.success('Other participant joined the call');

      // If we're the initiator, create and send offer
      if (isInitiator) {
        createPeer(true);
      }
    });

    socketRef.current.on('room-ready', ({ usersInRoom }) => {
      console.log('🏠 Room ready, users already in room:', usersInRoom);

      // If we're NOT the initiator and there are users in the room, wait for offer
      // The initiator will send the offer when they receive 'user-joined'
      if (!isInitiator && usersInRoom > 0) {
        console.log('⏳ Waiting for offer from initiator...');
      }
    });

    socketRef.current.on('offer', (offer) => {
      console.log('📨 Received offer');
      createPeer(false, offer);
    });

    socketRef.current.on('answer', (answer) => {
      console.log('📨 Received answer');
      if (peerRef.current) {
        peerRef.current.signal(answer);
      }
    });

    socketRef.current.on('ice-candidate', (candidate) => {
      console.log('📨 Received ICE candidate');
      if (peerRef.current) {
        peerRef.current.signal(candidate);
      }
    });

    socketRef.current.on('user-left', () => {
      console.log('👤 User left the call');
      toast.info('Other participant left the call');
      handleCallEnd();
    });

    // Get user media (camera and microphone)
    initializeMedia();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [consultationId, isInitiator]);

  /**
   * Initialize local media stream (camera and microphone)
   */
  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      localStreamRef.current = stream;
      
      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsConnecting(false);
      console.log('✅ Local media initialized');
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      setConnectionError('Failed to access camera/microphone. Please check permissions.');
      setIsConnecting(false);
      toast.error('Failed to access camera/microphone');
    }
  };

  /**
   * Create WebRTC peer connection
   * @param {boolean} initiator - Whether this peer initiates the connection
   * @param {object} offer - Optional offer from remote peer
   */
  const createPeer = (initiator, offer = null) => {
    try {
      const peer = new SimplePeer({
        initiator,
        trickle: true,
        stream: localStreamRef.current,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
          ]
        }
      });

      // Handle signaling data (offer/answer/ICE candidates)
      peer.on('signal', (data) => {
        console.log('📤 Sending signal data');
        
        if (data.type === 'offer') {
          socketRef.current.emit('offer', { consultationId, offer: data });
        } else if (data.type === 'answer') {
          socketRef.current.emit('answer', { consultationId, answer: data });
        } else {
          // ICE candidate
          socketRef.current.emit('ice-candidate', { consultationId, candidate: data });
        }
      });

      // Handle incoming stream from remote peer
      peer.on('stream', (remoteStream) => {
        console.log('✅ Received remote stream');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setIsConnected(true);
        toast.success('Connected to call');
      });

      // Handle connection events
      peer.on('connect', () => {
        console.log('✅ Peer connected');
        setIsConnected(true);
      });

      peer.on('close', () => {
        console.log('🔌 Peer connection closed');
        setIsConnected(false);
      });

      peer.on('error', (error) => {
        console.error('❌ Peer error:', error);
        toast.error('Connection error occurred');
      });

      // If we received an offer, signal it to the peer
      if (offer) {
        peer.signal(offer);
      }

      peerRef.current = peer;
    } catch (error) {
      console.error('❌ Error creating peer:', error);
      toast.error('Failed to establish connection');
    }
  };

  /**
   * Toggle audio on/off
   */
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        toast.success(audioTrack.enabled ? 'Microphone on' : 'Microphone off');
      }
    }
  };

  /**
   * Toggle video on/off
   */
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        toast.success(videoTrack.enabled ? 'Camera on' : 'Camera off');
      }
    }
  };

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  /**
   * End the call and cleanup resources
   */
  const handleCallEnd = () => {
    cleanup();
    if (onCallEnd) {
      onCallEnd();
    }
  };

  /**
   * Cleanup all resources
   */
  const cleanup = () => {
    // Stop all media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
    }

    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.emit('leave-consultation', consultationId);
      socketRef.current.disconnect();
    }
  };

  // Render loading state
  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-900 rounded-lg">
        <div className="text-center text-white">
          <div className="spinner mx-auto mb-4"></div>
          <p>Connecting to call...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (connectionError) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-900 rounded-lg">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">{connectionError}</p>
          <button onClick={initializeMedia} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="video-container" className="relative bg-neutral-900 rounded-lg overflow-hidden">
      {/* Remote Video (Main) */}
      <div className="relative aspect-video">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
            <div className="text-center text-white">
              <div className="spinner mx-auto mb-4"></div>
              <p>Waiting for other participant...</p>
            </div>
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute top-4 right-4 w-48 h-36 bg-neutral-800 rounded-lg overflow-hidden shadow-lg border-2 border-white">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!isVideoEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-700">
            <FaVideoSlash className="text-white text-3xl" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all ${
              isAudioEnabled 
                ? 'bg-neutral-700 hover:bg-neutral-600' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            {isAudioEnabled ? (
              <FaMicrophone className="text-white text-xl" />
            ) : (
              <FaMicrophoneSlash className="text-white text-xl" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all ${
              isVideoEnabled 
                ? 'bg-neutral-700 hover:bg-neutral-600' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoEnabled ? (
              <FaVideo className="text-white text-xl" />
            ) : (
              <FaVideoSlash className="text-white text-xl" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleCallEnd}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
            title="End call"
          >
            <FaPhoneSlash className="text-white text-xl" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-4 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-all"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <FaCompress className="text-white text-xl" />
            ) : (
              <FaExpand className="text-white text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Connection Status Indicator */}
      <div className="absolute top-4 left-4">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
          isConnected ? 'bg-green-600' : 'bg-yellow-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-white animate-pulse' : 'bg-white'
          }`}></div>
          <span className="text-white text-sm font-medium">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

