import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import socket from "../../services/socket";
import IncomingCall from "../../features/call/components/incomingCall";
import AcceptCall from "../../features/call/components/acceptCall";
import AudioCall from "../../features/call/components/audioCall";
import useCallHook from "../../features/call/hooks/useCallHook";
import useWebRTC from "../../features/call/hooks/callWebRTC";

const ChatLayout = () => {
  // Get the current logged-in user from the parent route.
  // We need the user's ID for starting and handling calls.
  const { currentUser } = useOutletContext();

  // Store information about the current call.
  // It contains the callerId and calleeId.
  const [caller, setCaller] = useState(null);

  // Control whether the incoming call popup is visible.
  // true = show incoming call popup.
  // false = hide it.
  const [showIncomingCall, setShowIncomingCall] = useState(false);

  // Control whether the outgoing call UI is visible.
  // This is shown when the current user starts a call.
  const [showAudioCall, setShowAudioCall] = useState(false);

  // Control whether the active call UI is visible.
  // This is shown after the call is accepted.
  const [showAcceptCall, setShowAcceptCall] = useState(false);

  // Store the current call status.
  // Examples: "calling", "incoming", "connected", "rejected".
  const [callStatus, setCallStatus] = useState(null);

  // Store whether the current user is the caller.
  // true = current user started the call.
  // false = current user received the call.
  const [isCaller, setIsCaller] = useState(false);

  // Store whether the call has been accepted.
  // false = waiting for acceptance.
  // true = receiver accepted the call.
  const [callAccepted, setCallAccepted] = useState(false);

  // Get the WebRTC cleanup function from the useWebRTC hook.
  const { endWebRTC } = useWebRTC({
    // Pass the current logged-in user to WebRTC.
    currentUser,

    // Find the other user's ID.
    // If current user is the caller, use the callee ID.
    // Otherwise, use the caller ID.
    otherUserId: isCaller ? caller?.calleeId : caller?.callerId,

    // Tell WebRTC whether the current user is the caller.
    isCaller,

    // Tell WebRTC whether the call has been accepted.
    callAccepted,
  });

  // Start the custom call hook.
  // This hook listens for incoming, accepted, rejected,
  // and ended call events from Socket.IO.
  useCallHook(
    // Pass the current logged-in user.
    currentUser,

    // Pass the function used to update caller information.
    setCaller,

    // Pass the function used to show/hide incoming call UI.
    setShowIncomingCall,

    // Pass the function used to show/hide outgoing call UI.
    setShowAudioCall,

    // Pass the function used to show/hide active call UI.
    setShowAcceptCall,

    // Pass the function used to update call status.
    setCallStatus,

    // Pass the function used to update accepted state.
    setCallAccepted,

    // Pass the function used to update caller/receiver state.
    setIsCaller,

    // Pass the WebRTC cleanup function.
    // It is used when a call ends or is rejected.
    endWebRTC,
  );

  // Function used to start a new outgoing call.
  const startCall = (calleeId) => {
    // Stop if the current user's ID or receiver's ID is missing.
    if (!currentUser?._id || !calleeId) {
      return;
    }

    // Create an object containing both users' IDs.
    // callerId = current user.
    // calleeId = user being called.
    const callData = {
      callerId: currentUser._id,
      calleeId,
    };

    // Save the call information in state.
    setCaller(callData);

    // Mark the current user as the caller.
    setIsCaller(true);

    // The call has not been accepted yet.
    setCallAccepted(false);

    // Set the current call status to calling.
    setCallStatus("calling");

    // Show the outgoing call UI.
    setShowAudioCall(true);

    // Send the call request to the server.
    // The server will forward it to the callee.
    socket.emit("callUser", callData);
  };

  // Function used when the receiver accepts the incoming call.
  const handleAcceptCall = () => {
    // Make sure the caller ID and callee ID are available.
    if (!caller?.callerId || !caller?.calleeId) {
      // Show the current caller data for debugging.
      console.log("CALLER DATA MISSING:", caller);

      // Stop the function if the required data is missing.
      return;
    }

    // Show the caller information for debugging.
    console.log("ACCEPTING CALL:", caller);

    // The current user is the receiver, not the caller.
    setIsCaller(false);

    // Mark the call as accepted.
    setCallAccepted(true);

    // Change the call status to connected.
    setCallStatus("connected");

    // Tell the server that the receiver accepted the call.
    socket.emit("acceptCall", {
      // Send the original caller's ID.
      callerId: caller.callerId,

      // Send the receiver's ID.
      calleeId: caller.calleeId,
    });

    // Hide the incoming call popup.
    setShowIncomingCall(false);

    // Hide the outgoing calling UI.
    setShowAudioCall(false);

    // Show the active call UI.
    setShowAcceptCall(true);
  };

  // Function used when the receiver rejects the call.
  const handleRejectCall = () => {
    // Make sure both user IDs are available.
    if (!caller?.callerId || !caller?.calleeId) {
      // Show the data in the console for debugging.
      console.log("CALLER DATA MISSING:", caller);

      // Stop if the required data is missing.
      return;
    }

    // Show the call information in the console.
    console.log("REJECTING CALL:", caller);

    // Tell the server that the receiver rejected the call.
    socket.emit("rejectCall", {
      // Send the caller's ID.
      callerId: caller.callerId,

      // Send the callee's ID.
      calleeId: caller.calleeId,
    });

    // Close the WebRTC connection if one exists.
    endWebRTC();

    // Hide the incoming call popup.
    setShowIncomingCall(false);

    // Hide the active call UI.
    setShowAcceptCall(false);

    // Hide the outgoing call UI.
    setShowAudioCall(false);

    // Remove the current caller information.
    setCaller(null);

    // Clear the call status.
    setCallStatus(null);

    // Mark the call as not accepted.
    setCallAccepted(false);

    // Reset the caller state.
    setIsCaller(false);
  };

  // Function used when either user ends the call.
  const handleEndCall = () => {
    // Stop if caller or callee information is missing.
    if (!caller?.callerId || !caller?.calleeId) {
      return;
    }

    // Tell the server that the call has ended.
    // The server sends the callEnd event to both users.
    socket.emit("endCall", {
      // Send the caller's ID.
      callerId: caller.callerId,

      // Send the callee's ID.
      calleeId: caller.calleeId,
    });

    // Close the WebRTC connection for the current user.
    endWebRTC();

    // Hide the incoming call popup.
    setShowIncomingCall(false);

    // Hide the active call UI.
    setShowAcceptCall(false);

    // Hide the outgoing call UI.
    setShowAudioCall(false);

    // Remove the current call information.
    setCaller(null);

    // Clear the call status.
    setCallStatus(null);

    // Mark the call as not accepted.
    setCallAccepted(false);

    // Reset the caller state.
    setIsCaller(false);
  };

  // Return the layout UI.
  return (
    <>
      {/* 
        Render the child route.
        ChatPage and other child pages are displayed here.
      */}
      <Outlet
        context={{
          // Pass the current user to child routes.
          currentUser,

          // -------------------------
          // Call state
          // -------------------------

          // Pass the current call information.
          caller,

          // Pass the current call status.
          callStatus,

          // Pass whether the outgoing call UI is visible.
          showAudioCall,

          // Pass whether the active call UI is visible.
          showAcceptCall,

          // Pass whether the call has been accepted.
          callAccepted,

          // Pass whether the current user is the caller.
          isCaller,

          // -------------------------
          // Call functions
          // -------------------------

          // Allow child components to start a call.
          startCall,

          // Allow child components to update caller information.
          setCaller,

          // Allow child components to update call status.
          setCallStatus,

          // Allow child components to update caller state.
          setIsCaller,

          // Allow child components to update accepted state.
          setCallAccepted,

          // Allow child components to show/hide outgoing call UI.
          setShowAudioCall,

          // Allow child components to show/hide active call UI.
          setShowAcceptCall,

          // Allow child components to end the call.
          handleEndCall,
        }}
      />

      {/*
        Show the IncomingCall component only when
        another user is calling the current user.
      */}
      {showIncomingCall && (
        <IncomingCall
          // Pass information about the caller.
          caller={caller}
          // Run handleAcceptCall when the user clicks Accept.
          onAccept={handleAcceptCall}
          // Run handleRejectCall when the user clicks Reject.
          onReject={handleRejectCall}
        />
      )}

      {/*
        Show the AcceptCall component when the call
        has been accepted and is active.
      */}
      {showAcceptCall && (
        <AcceptCall
          // Pass the current call information.
          caller={caller}
          // Run handleEndCall when the user clicks End Call.
          onEndCall={handleEndCall}
        />
      )}

      {/*
        Show AudioCall while the caller is waiting
        for the receiver to accept the call.
      */}
      {showAudioCall && (
        <AudioCall
          // Pass the caller and callee information.
          caller={caller}
          // Pass the current call status such as "calling".
          callStatus={callStatus}
          // Run handleEndCall when the caller ends the call.
          onEndCall={handleEndCall}
        />
      )}
    </>
  );
};

// Export ChatLayout so it can be used in the application's routes.
export default ChatLayout;
