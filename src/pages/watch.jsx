import React, { useEffect, useRef } from 'react';

function Watch() {
  const videoRef = useRef(null);

  useEffect(() => {
    const startWatching = async () => {
      try {
        // Simulate a media stream (replace this with your actual stream source)
        const stream = new MediaStream();
        // Example: Add a dummy track (in a real scenario, this would come from a stream source)
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const dst = context.createMediaStreamDestination();
        oscillator.connect(dst);
        oscillator.start();
        stream.addTrack(dst.stream.getAudioTracks()[0]);

        // Set the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error setting up stream:', error);
      }
    };

    startWatching();

    // Cleanup on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Watching Live</h1>
      <video ref={videoRef} id="remoteVideo" autoPlay className="w-full rounded" />
    </div>
  );
}

export default Watch;