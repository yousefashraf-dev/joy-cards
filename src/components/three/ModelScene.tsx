"use client";

import { useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import AcrylicStand from "./AcrylicStand";
import NfcCard from "./NfcCard";
import { modelRig } from "./rig";

function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function Rig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    modelRig.tiltY += (state.pointer.x * 0.45 - modelRig.tiltY) * 0.08;
    modelRig.tiltX += (state.pointer.y * 0.28 - modelRig.tiltX) * 0.08;
    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * 0.06;
    void t;
  });
  return null;
}

function Models() {
  const rot = -modelRig.scroll * Math.PI * 2;

  return (
    <group>
      <group position={[-1.5, 0.1, 0]} rotation={[0, rot, 0]}>
        <AcrylicStand rotationY={0} mouseX={modelRig.tiltY} mouseY={modelRig.tiltX} />
      </group>
      <group position={[1.6 + modelRig.cardSlide * 2.8, 0, 0.4]} rotation={[0, -rot * 0.4, 0]}>
        <NfcCard rotationY={rot * 0.4} mouseX={modelRig.tiltY} mouseY={modelRig.tiltX} />
      </group>
    </group>
  );
}

const emptySubscribe = () => () => {};

export default function ModelScene() {
  const container = useRef<HTMLDivElement>(null);
  const supported = useSyncExternalStore(
    emptySubscribe,
    () => webglSupported(),
    () => true
  );

  if (!supported) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-40 w-56 rounded-2xl border border-slate-200/15 bg-slate-900/40 p-4 backdrop-blur-sm sm:h-48 sm:w-64">
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <svg className="h-8 w-8 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="2" y="5" width="20" height="15" rx="2.5" />
              <circle cx="12" cy="12.5" r="3.5" />
              <path d="M7 5 6.5 2M17 5l.5-3M8.5 20l-.6 2M15.5 20l.6 2" />
            </svg>
            <p className="text-xs text-slate-500">
              GoTap
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={container} className="absolute inset-0" aria-hidden="true">
      <Canvas
        fallback={
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
            GoTap
          </div>
        }
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 5.4], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#68B0B7" />
        <pointLight position={[0, 0, 3]} intensity={0.7} color="#A0CDD2" />
        <Rig />
        <Models />
        <Sparkles count={50} scale={[6, 4, 3]} size={1.4} speed={0.25} color="#A0CDD2" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}