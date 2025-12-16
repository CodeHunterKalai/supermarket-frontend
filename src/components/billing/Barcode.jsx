"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Barcode = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const audioRef = useRef(new Audio("/beep.mp3")); // Optional: Add a beep sound file to public folder if desired

  useEffect(() => {
    let mounted = true;

    const initCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (mounted) {
          if (devices && devices.length) {
            setCameras(devices);
            // Prefer back camera if available
            const backCamera = devices.find((device) =>
              device.label.toLowerCase().includes("back")
            );
            setSelectedCamera(backCamera?.id || devices[0].id);
          } else {
            onError("No cameras found on this device.");
          }
        }
      } catch (err) {
        console.error("Error getting cameras:", err);
        if (mounted) {
          onError("Failed to access camera. Please ensure permissions are granted.");
        }
      }
    };

    initCameras();

    return () => {
      mounted = false;
      stopScanning();
    };
  }, []);

  const playBeep = () => {
    // Basic beep using AudioContext if file doesn't exist
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 1000;
        osc.type = "sine";
        gain.gain.value = 0.1;
        osc.start();
        setTimeout(() => osc.stop(), 200);
      }
    } catch (e) {
      console.error("Audio beep failed", e);
    }
  };

  const startScanning = async () => {
    if (!selectedCamera) {
      onError("No camera selected");
      return;
    }

    if (isScanning) return;

    try {
      // Ensure any previous instance is cleared
      if (html5QrCodeRef.current) {
        await stopScanning();
      }

      const html5QrCode = new Html5Qrcode("barcode-reader-element");
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.777778,
      };

      await html5QrCode.start(
        selectedCamera,
        config,
        (decodedText) => {
          // Successfully scanned barcode
          playBeep();
          onScan(decodedText);
          // Optional: Stop after scan? billing usually allows continuous scanning
        },
        (errorMessage) => {
          // Scanning errors (no barcode found) - ignore these
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      onError("Failed to start camera: " + err.message);
      setIsScanning(false);
      // Clean up if start failed
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.clear();
        } catch (e) { /* ignore */ }
        html5QrCodeRef.current = null;
      }
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        // html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      } finally {
        setIsScanning(false);
      }
    } else {
      setIsScanning(false);
    }
  };

  const handleCameraChange = (e) => {
    const cameraId = e.target.value;
    setSelectedCamera(cameraId);

    // If currently scanning, restart with new camera
    if (isScanning) {
      stopScanning().then(() => {
        // Wait a bit to ensure DOM is clean? 
        setTimeout(() => {
          // Restart needs to happen with new camera, but startScanning uses selectedCamera state
          // State might not be updated yet inside restart closure if we just called it.
          // But setSelectedCamera update triggers re-render.
          // If we really want to restart immediately:
          // We can't easily call startScanning here relying on state.
          // User has to click Start again or we use useEffect on selectedCamera?
          // Let's just stop and let user start again to be safe.
        }, 100);
      });
    }
  };

  // Using useEffect to restart if camera changes while scanning is tricky due to async.
  // Safer to just stop and let user start.

  return (
    <div className="barcode-scanner">
      <div className="mb-3">
        <div className="row g-2">
          <div className="col">
            <select
              className="form-select"
              value={selectedCamera || ""}
              onChange={handleCameraChange}
              disabled={cameras.length === 0}
            >
              <option value="" disabled>
                {cameras.length === 0 ? "Searching for cameras..." : "Select Camera"}
              </option>
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Camera ${camera.id}`}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            {!isScanning ? (
              <button
                className="btn btn-success"
                onClick={startScanning}
                disabled={!selectedCamera}
              >
                <i className="bi bi-camera-fill me-2"></i>
                Start Camera
              </button>
            ) : (
              <button className="btn btn-danger" onClick={stopScanning}>
                <i className="bi bi-stop-circle-fill me-2"></i>
                Stop Camera
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="barcode-reader-wrapper"
        style={{
          border: isScanning ? "2px solid #198754" : "2px dashed #dee2e6",
          borderRadius: "8px",
          overflow: "hidden",
          minHeight: "300px",
          position: "relative",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* The element specific for Html5Qrcode to attach to */}
        <div id="barcode-reader-element" style={{ width: "100%", height: "100%" }}></div>

        {/* Overlay/Placeholder shown when NOT scanning */}
        {!isScanning && (
          <div
            className="text-center text-muted p-4"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10
            }}
          >
            <i className="bi bi-camera" style={{ fontSize: "3rem" }}></i>
            <p className="mt-2 mb-0">Camera preview will appear here</p>
            <small>
              Select a camera and click "Start Camera" to begin scanning
            </small>
          </div>
        )}

        {isScanning && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "0",
              width: "100%",
              textAlign: "center",
              zIndex: 20
            }}
          >
            <div className="badge bg-info opacity-75 fs-6 fw-normal px-3 py-2">
              <i className="bi bi-info-circle me-2"></i>
              Point camera at barcode
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Barcode;
