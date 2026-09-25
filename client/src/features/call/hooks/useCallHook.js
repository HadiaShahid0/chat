import { useEffect } from "react";
import socket from "../../../services/socket";

const useCallHook = (
  currentUser,

  setCaller,
  setShowIncomingCall,
  setShowAudioCall,
  setShowAcceptCall,
  setCallStatus,
  setCallAccepted,
  setIsCaller,

  endWebRTC,
  handleCallData,
) => {
  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    // INCOMING CALL

    const handleIncomingCall = (data) => {
      console.log("INCOMING CALL:", data);

      // If offer or candidate exists,
      // this is WebRTC data, not a new call.
      if (data.offer || data.candidate) {
        handleCallData(data);

        return;
      }

      // Normal incoming call.
      setCaller(data);
      // Current user is the receiver.
      setIsCaller(false);
      // Call has not been accepted yet.
      setCallAccepted(false);
      // Show incoming call status.
      setCallStatus("incoming");

      // Show incoming call popup.
      setShowIncomingCall(true);

      // Hide other call UI.
      setShowAudioCall(false);
      setShowAcceptCall(false);
    };

    // CALL ACCEPTED

    const handleCallAccepted = (data) => {
      console.log("CALL ACCEPTED:", data);

      // If answer or candidate exists,
      // this is WebRTC data, not a new acceptance.
      if (data.answer || data.candidate) {
        handleCallData(data);

        return;
      }
      // Normal call accepted.
      setCaller(data);

      // Call has been accepted.
      setCallAccepted(true);

      // Call is now connected.
      setCallStatus("connected");

      // Hide waiting UI.
      setShowAudioCall(false);

      // Show active call UI.
      setShowAcceptCall(true);
    };

    // CALL REJECTED

    const handleCallRejected = (data) => {
      console.log("CALL REJECTED:", data);

      // Close WebRTC.
      endWebRTC();

      // Hide all call UI.
      setShowIncomingCall(false);
      setShowAudioCall(false);
      setShowAcceptCall(false);

      // Reset call state.
      setCaller(null);
      setCallStatus(null);
      setCallAccepted(false);
      setIsCaller(false);
    };

    // CALL ENDED

    const handleEndCall = (data) => {
      console.log("CALL ENDED:", data);

      // Close WebRTC.
      endWebRTC();

      // Hide all call UI.
      setShowIncomingCall(false);
      setShowAudioCall(false);
      setShowAcceptCall(false);

      // Reset call state.
      setCaller(null);
      setCallStatus(null);
      setCallAccepted(false);
      setIsCaller(false);
    };

    // SOCKET LISTENERS

    socket.on("incomingCall", handleIncomingCall);

    socket.on("callAccepted", handleCallAccepted);

    socket.on("callRejected", handleCallRejected);

    socket.on("callEnd", handleEndCall);

    // CLEANUP

    return () => {
      socket.off("incomingCall", handleIncomingCall);

      socket.off("callAccepted", handleCallAccepted);

      socket.off("callRejected", handleCallRejected);

      socket.off("callEnd", handleEndCall);
    };
  }, [
    currentUser?.id,

    setCaller,
    setShowIncomingCall,
    setShowAudioCall,
    setShowAcceptCall,
    setCallStatus,
    setCallAccepted,
    setIsCaller,

    endWebRTC,
    handleCallData,
  ]);
};

export default useCallHook;
