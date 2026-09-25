import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import socket from "../../services/socket";

import IncomingCall from "../../features/call/components/incomingCall";
import AcceptCall from "../../features/call/components/acceptCall";
import AudioCall from "../../features/call/components/audioCall";

import useCallHook from "../../features/call/hooks/useCallHook";
import useWebRTC from "../../features/call/hooks/callWebRTC";

const ChatLayout = () => {
  const { currentUser } = useOutletContext();

  // Stores current call information.
  const [caller, setCaller] = useState(null);

  // Shows incoming call popup.
  const [showIncomingCall, setShowIncomingCall] = useState(false);

  // Shows outgoing call UI.
  const [showAudioCall, setShowAudioCall] = useState(false);

  // Shows active call UI.
  const [showAcceptCall, setShowAcceptCall] = useState(false);

  // Stores current call status.
  const [callStatus, setCallStatus] = useState(null);

  // true = current user started the call.
  // false = current user received the call.
  const [isCaller, setIsCaller] = useState(false);

  // true = receiver accepted the call.
  const [callAccepted, setCallAccepted] = useState(false);

  /*
    Find the other user's ID.

    If current user is the caller:
      other user = callee

    If current user is the receiver:
      other user = caller
  */

  const otherUserId = caller
    ? isCaller
      ? caller.calleeId
      : caller.callerId
    : null;

  //  WebRTC

  const { handleCallData, endWebRTC } = useWebRTC({
    currentUser,
    otherUserId,
    isCaller,
    callAccepted,
  });

  //  CALL SOCKET HOOK

  useCallHook(
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
  );

  //  START CALL
  const startCall = (user) => {
    if (!currentUser?.id || !user?.id) {
      return;
    }

    const callData = {
      callerId: currentUser.id,
      calleeId: user.id,

      // User information for the call UI
      name: user.name,
      profileImage: user.profileImage,
    };

    // Save call information locally
    setCaller(callData);

    // Current user is the caller
    setIsCaller(true);

    // Call is not accepted yet
    setCallAccepted(false);

    // Show calling status
    setCallStatus("calling");

    // Show outgoing call UI
    setShowAudioCall(true);

    // Send call information to receiver
    socket.emit("callUser", callData);
  };

  //  ACCEPT CALL

  const handleAcceptCall = () => {
    if (!caller?.callerId || !caller?.calleeId) {
      console.log("CALLER DATA MISSING:", caller);
      return;
    }

    console.log("ACCEPTING CALL:", caller);

    // Current user is the receiver.
    setIsCaller(false);

    // Call is accepted.
    setCallAccepted(true);

    // Update status.
    setCallStatus("connected");

    // Tell caller that we accepted.
    socket.emit("acceptCall", {
      callerId: caller.callerId,
      calleeId: caller.calleeId,
    });

    // Update UI.
    setShowIncomingCall(false);

    setShowAudioCall(false);

    setShowAcceptCall(true);
  };

  //  REJECT CALL

  const handleRejectCall = () => {
    if (!caller?.callerId || !caller?.calleeId) {
      console.log("CALLER DATA MISSING:", caller);
      return;
    }

    console.log("REJECTING CALL:", caller);

    // Tell caller that we rejected.
    socket.emit("rejectCall", {
      callerId: caller.callerId,
      calleeId: caller.calleeId,
    });

    // Close WebRTC.
    endWebRTC();

    // Reset UI.
    setShowIncomingCall(false);

    setShowAcceptCall(false);

    setShowAudioCall(false);

    // Reset call data.
    setCaller(null);

    setCallStatus(null);

    setCallAccepted(false);

    setIsCaller(false);
  };

  //  END CALL

  const handleEndCall = () => {
    if (!caller?.callerId || !caller?.calleeId) {
      return;
    }

    // Tell server that the call ended.
    socket.emit("endCall", {
      callerId: caller.callerId,
      calleeId: caller.calleeId,
    });

    // Close WebRTC locally.
    endWebRTC();

    // Hide all call UI.
    setShowIncomingCall(false);

    setShowAcceptCall(false);

    setShowAudioCall(false);

    // Reset call state.
    setCaller(null);

    setCallStatus(null);

    setCallAccepted(false);

    setIsCaller(false);
  };

  //  UI

  return (
    <>
      <Outlet
        context={{
          currentUser,

          // Call state
          caller,
          callStatus,
          showAudioCall,
          showAcceptCall,
          callAccepted,
          isCaller,

          // Call functions
          startCall,
          setCaller,
          setCallStatus,
          setIsCaller,
          setCallAccepted,
          setShowAudioCall,
          setShowAcceptCall,
          handleEndCall,
        }}
      />

      {/* Incoming call */}
      {showIncomingCall && (
        <IncomingCall
          caller={caller}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {/* Active call */}
      {showAcceptCall && (
        <AcceptCall caller={caller} onEndCall={handleEndCall} />
      )}

      {/* Caller waiting */}
      {showAudioCall && (
        <AudioCall
          user={caller}
          callStatus={callStatus}
          onEndCall={handleEndCall}
        />
      )}
    </>
  );
};

export default ChatLayout;
