"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Barcode = ({ onScan, onError }) => {
  const scannerRef = useRef(null);
  const scanLockRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices.length) throw new Error("No camera");

        const cameraId =
          devices.find(d => d.label.toLowerCase().includes("back"))?.id ||
          devices[0].id;

        const scanner = new Html5Qrcode("barcode-reader");
        scannerRef.current = scanner;

        await scanner.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (text) => {
            if (!mounted) return;
            if (scanLockRef.current) return;

            scanLockRef.current = true;
            onScan(text);

            setTimeout(() => {
              scanLockRef.current = false;
            }, 700);
          }
        );
      } catch (e) {
        onError("Camera failed");
      }
    };

    start();

    return () => {
      mounted = false;
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  return (
    <div
      id="barcode-reader"
      style={{ height: 320, border: "2px solid green" }}
    />
  );
};

export default Barcode;
