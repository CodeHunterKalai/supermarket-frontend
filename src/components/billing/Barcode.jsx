"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Barcode = ({ onScan, onError }) => {
  const scannerRef = useRef(null);
  const lastScanRef = useRef("");

  useEffect(() => {
    let active = true;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices.length) throw new Error("No camera found");

        const cameraId =
          devices.find(d => d.label.toLowerCase().includes("back"))?.id ||
          devices[0].id;

        const scanner = new Html5Qrcode("barcode-reader");
        scannerRef.current = scanner;

        await scanner.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (text) => {
            if (!active) return;

            // prevent duplicate scan
            if (text === lastScanRef.current) return;

            lastScanRef.current = text;
            onScan(text);

            // unlock after delay
            setTimeout(() => {
              lastScanRef.current = "";
            }, 800);
          }
        );
      } catch (err) {
        console.error(err);
        onError("Camera start failed");
      }
    };

    startScanner();

    return () => {
      active = false;
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  return (
    <div
      id="barcode-reader"
      style={{
        width: "100%",
        height: "320px",
        border: "2px solid #198754",
        borderRadius: "8px",
        background: "#f8f9fa",
      }}
    />
  );
};

export default Barcode;
