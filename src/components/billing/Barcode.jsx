"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Barcode = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    // Get available cameras on component mount
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer back camera if available
          const backCamera = devices.find((device) =>
            device.label.toLowerCase().includes("back")
          );
          setSelectedCamera(backCamera?.id || devices[0].id);
        }
      })
      .catch((err) => {
        console.error("Error getting cameras:", err);
      });

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    if (!selectedCamera) {
      onError("No camera selected");
      return;
    }

    try {
      html5QrCodeRef.current = new Html5Qrcode("barcode-reader");

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.777778,
      };

      await html5QrCodeRef.current.start(
        selectedCamera,
        config,
        (decodedText) => {
          // Successfully scanned barcode
          onScan(decodedText);
        },
        (errorMessage) => {
          // Scanning errors (no barcode found) - ignore these
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      onError("Failed to start camera: " + err.message);
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleCameraChange = (e) => {
    const cameraId = e.target.value;
    setSelectedCamera(cameraId);

    // If currently scanning, restart with new camera
    if (isScanning) {
      stopScanning().then(() => {
        setSelectedCamera(cameraId);
      });
    }
  };

  return (
    <div className="barcode-scanner">
      <div className="mb-3">
        <div className="row g-2">
          <div className="col">
            <select
              className="form-select"
              value={selectedCamera || ""}
              onChange={handleCameraChange}
              disabled={isScanning || cameras.length === 0}
            >
              <option value="" disabled>
                Select Camera
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
        id="barcode-reader"
        ref={scannerRef}
        className="barcode-reader-container"
        style={{
          border: isScanning ? "2px solid #198754" : "2px dashed #dee2e6",
          borderRadius: "8px",
          overflow: "hidden",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        {!isScanning && (
          <div className="text-center text-muted p-4">
            <i className="bi bi-camera" style={{ fontSize: "3rem" }}></i>
            <p className="mt-2 mb-0">Camera preview will appear here</p>
            <small>
              Select a camera and click "Start Camera" to begin scanning
            </small>
          </div>
        )}
      </div>

      {isScanning && (
        <div className="alert alert-info mt-3 mb-0">
          <i className="bi bi-info-circle me-2"></i>
          Point the camera at a barcode to scan it automatically
        </div>
      )}
    </div>
  );
};

export default Barcode;
