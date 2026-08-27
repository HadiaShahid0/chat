// Import useEffect so we can register and remove Socket.IO listeners.
import { useEffect } from "react";

// Import the Socket.IO connection.
// It is used to receive call events from the server.
import socket from "../../../services/socket";

// Custom hook for handling call-related Socket.IO events.
const useCallHook = (
  // Information about the currently logged-in user.
  currentUser,

  // Function to store caller/callee information.
  setCaller,

  // Function to show or hide the incoming call popup.
  setShowIncomingCall,

  // Function to show or hide the outgoing call UI.
  setShowAudioCall,

  // Function to show or hide the active call UI.
  setShowAcceptCall,

  // Function to update the current call status.
  setCallStatus,

  // Function to update whether the call was accepted.
  setCallAccepted,

  // Function to update whether the current user is the caller.
  setIsCaller,

  // Function to close the WebRTC connection.
  // It is called when the call is rejected or ended.
  endWebRTC,
) => {
  // useEffect is used to set up Socket.IO listeners.
  // It runs when the current user's ID changes.
  useEffect(() => {
    // If the current user is not available,
    // do not register any call listeners.
    if (!currentUser?._id) {
      return;
    }

    // -----------------------------------------
    // INCOMING CALL
    // -----------------------------------------

    // This function runs when another user calls
    // the current user.
    const handleIncomingCall = (data) => {
      // Show the received call information in the console.
      // This is useful for debugging.
      console.log("INCOMING CALL:", data);

      // Save the caller information in state.
      // For example:
      // { callerId: "userA" }
      setCaller(data);

      // The current user is the receiver,
      // so they are not the caller.
      setIsCaller(false);

      // The call has not been accepted yet.
      setCallAccepted(false);

      // Set the call status to incoming.
      setCallStatus("incoming");

      // Show the incoming call popup.
      setShowIncomingCall(true);

      // Hide the outgoing calling UI.
      // The current user did not start this call.
      setShowAudioCall(false);

      // Hide the active call UI.
      // The call has not been accepted yet.
      setShowAcceptCall(false);
    };

    // -----------------------------------------
    // CALL ACCEPTED
    // -----------------------------------------

    // This function runs when the receiver accepts the call.
    const handleCallAccepted = (data) => {
      // Show the accepted call information in the console.
      console.log("CALL ACCEPTED:", data);

      // Save the complete call information.
      // The server sends callerId and calleeId here.
      setCaller(data);

      // Mark the call as accepted.
      setCallAccepted(true);

      // Change the call status to connected.
      setCallStatus("connected");

      // The caller no longer needs the
      // "calling/waiting" UI.
      setShowAudioCall(false);

      // Show the active call UI for the caller.
      setShowAcceptCall(true);
    };

    // -----------------------------------------
    // CALL REJECTED
    // -----------------------------------------

    // This function runs when the receiver rejects the call.
    const handleCallRejected = (data) => {
      // Show the rejected call information in the console.
      console.log("CALL REJECTED:", data);

      // Close the WebRTC connection if one exists.
      // This makes sure the microphone and peer connection are cleaned up.
      endWebRTC();

      // Change the call status to rejected.
      setCallStatus("rejected");

      // The call is no longer accepted.
      setCallAccepted(false);

      // Hide the outgoing call UI.
      setShowAudioCall(false);

      // Hide the active call UI.
      setShowAcceptCall(false);

      // Hide the incoming call UI.
      setShowIncomingCall(false);

      // Remove the current call information.
      setCaller(null);

      // Reset the caller state.
      setIsCaller(false);
    };

    // -----------------------------------------
    // CALL ENDED
    // -----------------------------------------

    // This function runs when either user ends the call.
    const handleEndCall = (data) => {
      // Show information about who ended the call.
      console.log("CALL ENDED:", data);

      // IMPORTANT:
      // Close the WebRTC connection on this side too.
      //
      // The other user already called endWebRTC()
      // on their own side.
      //
      // The server sends "callEnd" to both users,
      // so this function also runs on the other user's side.
      endWebRTC();

      // Hide the outgoing call UI.
      setShowAudioCall(false);

      // Hide the active call UI.
      setShowAcceptCall(false);

      // Hide the incoming call UI.
      setShowIncomingCall(false);

      // Remove the current call information.
      setCaller(null);

      // Mark the call as not accepted.
      setCallAccepted(false);

      // Clear the call status.
      setCallStatus(null);

      // Reset the caller state.
      setIsCaller(false);
    };

    // -----------------------------------------
    // SOCKET LISTENERS
    // -----------------------------------------

    // Listen for an incoming call from the server.
    // The server sends this event to the callee.
    socket.on("incomingCall", handleIncomingCall);

    // Listen for a call accepted event.
    // The server sends this to the caller.
    socket.on("callAccepted", handleCallAccepted);

    // Listen for a call rejected event.
    // The server sends this to the caller.
    socket.on("callRejected", handleCallRejected);

    // Listen for a call ended event.
    // The server sends this to both users.
    socket.on("callEnd", handleEndCall);

    // -----------------------------------------
    // CLEANUP
    // -----------------------------------------

    // Remove the Socket.IO listeners when the component
    // is unmounted or when the effect runs again.
    return () => {
      // Remove the incoming call listener.
      socket.off("incomingCall", handleIncomingCall);

      // Remove the accepted call listener.
      socket.off("callAccepted", handleCallAccepted);

      // Remove the rejected call listener.
      socket.off("callRejected", handleCallRejected);

      // Remove the ended call listener.
      socket.off("callEnd", handleEndCall);
    };
  }, [
    // Re-run the effect if the current user's ID changes.
    currentUser?._id,

    // These functions are used inside the effect.
    // They are included as dependencies.
    setCaller,
    setShowIncomingCall,
    setShowAudioCall,
    setShowAcceptCall,
    setCallStatus,
    setCallAccepted,
    setIsCaller,

    // WebRTC cleanup function.
    endWebRTC,
  ]);
};

// Export the custom hook so it can be used in ChatLayout.
export default useCallHook;
