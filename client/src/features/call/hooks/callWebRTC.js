import { useEffect, useRef } from "react";
import socket from "../../../services/socket";

// WebRTC configuration.
// STUN/TURN servers can be added here later.
const rtcConfig = {
  iceServers: [],
};

const useWebRTC = ({ currentUser, otherUserId, isCaller, callAccepted }) => {
  // Store the WebRTC peer connection.
  const peerRef = useRef(null);

  // Store the current user's microphone stream.
  const localStreamRef = useRef(null);

  // Store ICE candidates that arrive before
  // the WebRTC connection is ready.
  const candidatesRef = useRef([]);

  // MICROPHONE

  const getLocalStream = async () => {
    // If we already have the microphone stream,
    // return it instead of asking for permission again.
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    // If we don't have a microphone stream,
    // ask the browser for microphone access.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Store the microphone stream
      // so we can reuse it during the call.
      localStreamRef.current = stream;

      // Return the microphone stream.
      return stream;
    } catch (error) {
      console.error("Microphone error:", error);

      return null;
    }
  };

  // CREATE PEER
  //create a connection between two devices
  //call getLocalStream
  //get audio tracks
  //when audio from the other user
  // reaches our browser.
  //ICE CANDIDATE
  const createPeer = async () => {
    // If a peer connection already exists,
    // return the existing connection.
    if (peerRef.current) {
      return peerRef.current;
    }

    // Create a new WebRTC peer connection.
    //manages the direct connection and media streaming between two devices
    const peer = new RTCPeerConnection(rtcConfig);

    // Store the peer connection
    // so we can use the same connection later.
    peerRef.current = peer;

    // Get the current user's microphone stream.
    const stream = await getLocalStream();

    // Add the microphone tracks to WebRTC.
    if (stream) {
      // Get the audio tracks from the microphone stream
      // and add them to the peer connection.
      // This allows us to send our audio to the other user.
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });
    }

    // RECEIVE AUDIO

    // This runs when audio from the other user
    // reaches our browser.
    peer.ontrack = (event) => {
      // Get the audio element from AudioCall component.
      const audio = document.getElementById("remoteAudio");

      // If the audio element and remote stream exist,
      // play the other user's audio.
      if (audio && event.streams[0]) {
        // Connect the remote stream to the audio element.
        audio.srcObject = event.streams[0];

        // Start playing the other user's audio.
        // catch() prevents an autoplay error.
        audio.play().catch(() => {});
      }
    };

    // ICE CANDIDATE

    // WebRTC calls this when it finds a new ICE candidate.
    peer.onicecandidate = (event) => {
      // If there is no candidate, there is nothing to send.
      if (!event.candidate) return;

      // Caller sends the ICE candidate
      // through the callUser event.
      if (isCaller) {
        socket.emit("callUser", {
          callerId: currentUser.id,
          calleeId: otherUserId,
          candidate: event.candidate,
        });
      }

      // Receiver sends the ICE candidate
      // through the acceptCall event.
      else {
        socket.emit("acceptCall", {
          callerId: otherUserId,
          calleeId: currentUser.id,
          candidate: event.candidate,
        });
      }
    };

    // Return the peer connection.
    return peer;
  };

  // CREATE OFFER

  const createOffer = async () => {
    try {
      // Create or get the existing peer connection.
      const peer = await createPeer();

      // Create an offer containing
      // our WebRTC connection information.
      const offer = await peer.createOffer();

      // Save the offer as our local description.
      //saves device media and network settings to start a connection with another peer
      await peer.setLocalDescription(offer);

      // Send the offer to the other user
      // through the callUser Socket.IO event.
      socket.emit("callUser", {
        callerId: currentUser.id,

        calleeId: otherUserId,

        offer,
      });
    } catch (error) {
      console.error("Offer error:", error);
    }
  };

  // HANDLE OFFER

  const handleOffer = async (data) => {
    try {
      // Create or get the existing peer connection.
      const peer = await createPeer();

      // Save the caller's offer
      // as the remote description.
      //setRemoteDescription tells your browser the media settings of the other person's device.
      // RTCSessionDescription holds the media settings
      await peer.setRemoteDescription(new RTCSessionDescription(data.offer));

      // Add ICE candidates that arrived
      // before the remote description was ready.
      for (const candidate of candidatesRef.current) {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }

      // Clear the candidates because
      // they have now been added.
      candidatesRef.current = [];

      // Create an answer for the caller's offer.
      const answer = await peer.createAnswer();

      // Save the answer as our local description.
      await peer.setLocalDescription(answer);

      // Send the answer back to the caller
      // through the acceptCall event.
      socket.emit("acceptCall", {
        callerId: data.callerId,

        calleeId: data.calleeId,

        answer,
      });
    } catch (error) {
      console.error("Offer error:", error);
    }
  };

  // HANDLE ANSWER

  const handleAnswer = async (data) => {
    try {
      // Get the existing peer connection.
      const peer = peerRef.current;

      // If the peer does not exist,
      // there is nothing to do.
      if (!peer) return;

      // Save the receiver's answer
      // as the remote description.
      await peer.setRemoteDescription(new RTCSessionDescription(data.answer));

      // Add ICE candidates that arrived
      // before the connection was ready.
      for (const candidate of candidatesRef.current) {
        //RTCIceCandidate contains the network path details used to reach a device
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }

      // Clear the candidates because
      // they have now been added.
      candidatesRef.current = [];
    } catch (error) {
      console.error("Answer error:", error);
    }
  };

  // HANDLE ICE (Interactive Connectivity Establishment)

  const handleCandidate = async (candidate) => {
    try {
      // Get the existing peer connection.
      const peer = peerRef.current;

      // If the peer or remote description is not ready,
      // save the candidate and add it later.
      if (!peer || !peer.remoteDescription) {
        candidatesRef.current.push(candidate);

        return;
      }

      // Add the received ICE candidate
      // to the WebRTC connection.
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("ICE error:", error);
    }
  };

  // HANDLE CALL DATA

  const handleCallData = async (data) => {
    // If an offer was received, handle it.
    if (data.offer) {
      await handleOffer(data);

      return;
    }

    // If an answer was received, handle it.
    if (data.answer) {
      await handleAnswer(data);

      return;
    }

    // If an ICE candidate was received, handle it.
    if (data.candidate) {
      await handleCandidate(data.candidate);

      return;
    }
  };

  // START WebRTC

  useEffect(() => {
    // Start WebRTC only when:
    // 1. Current user exists
    // 2. Other user exists
    // 3. Current user is the caller
    // 4. Call has been accepted
    if (currentUser?.id && otherUserId && isCaller && callAccepted) {
      // Create the WebRTC offer.
      createOffer();
    }
  }, [currentUser?.id, otherUserId, isCaller, callAccepted]);

  // CLEANUP

  const endWebRTC = () => {
    // Close the WebRTC peer connection.
    peerRef.current?.close();

    // Remove the old peer connection.
    // A new one can be created for the next call.
    peerRef.current = null;

    // Stop all microphone tracks.
    // This turns off the microphone.
    localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    // Remove the old microphone stream.
    localStreamRef.current = null;

    // Remove old ICE candidates.
    // This prevents them from being used
    // in the next call.
    candidatesRef.current = [];
  };

  // RETURN

  return {
    createPeer,
    getLocalStream,
    handleCallData,
    endWebRTC,
  };
};

export default useWebRTC;
