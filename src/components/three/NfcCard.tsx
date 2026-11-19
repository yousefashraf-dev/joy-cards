"use client";

import { RoundedBox, Text } from "@react-three/drei";

const CARD = { w: 2.5, h: 1.56, c: 0.11, r: 0.07 };
const OFFSET = 0.05;

export default function NfcCard({
  rotationY,
  mouseX,
  mouseY,
}: {
  rotationY: number;
  mouseX: number;
  mouseY: number;
}) {
  const driftX = mouseX * 0.35;
  const driftY = mouseY * 0.35;

  return (
    <group position={[driftX, driftY, 0]}>
      {/* Card body — shared rotation via parent group */}
      <RoundedBox args={[CARD.w, CARD.h, CARD.c]} radius={CARD.r} smoothness={8} rotation={[0, rotationY, 0]}>
        <meshStandardMaterial color="#0B132B" roughness={0.3} metalness={0.65} />
      </RoundedBox>

      {/* Front face — floats just above surface while parent rotates */}
      <group rotation={[0, rotationY, 0]}>
        <mesh position={[0, 0, CARD.c / 2 + 0.02]}>
          <planeGeometry args={[CARD.w - 0.16, CARD.h - 0.16]} />
          <meshStandardMaterial
            color="#68B0B7"
            roughness={0.25}
            metalness={0.7}
            emissive="#0A3B40"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 0, CARD.c / 2 + 0.021]}>
          <planeGeometry args={[CARD.w - 0.26, CARD.h - 0.26]} />
          <meshBasicMaterial color="#0E1F26" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0, 0, CARD.c / 2 + 0.022]}>
          <planeGeometry args={[CARD.w - 0.3, CARD.h - 0.3]} />
          <meshBasicMaterial color="#0E1F26" />
        </mesh>

        <Text
          position={[-0.55, 0.38, CARD.c / 2 + OFFSET]}
          fontSize={0.13}
          color="#A0CDD2"
          maxWidth={0.9}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1O4a0Fg.ttf"
        >
          {`GoTap`}
        </Text>
        <Text
          position={[-0.62, 0.12, CARD.c / 2 + OFFSET]}
          fontSize={0.055}
          color="rgba(255,255,255,0.8)"
          maxWidth={1.5}
        >
          {`Digital Business Card`}
        </Text>
        <Text
          position={[-0.62, -0.02, CARD.c / 2 + OFFSET]}
          fontSize={0.045}
          color="#A0CDD2"
          maxWidth={1.5}
        >
          {`TAP · SHARE · GROW`}
        </Text>

        {/* NFC chip */}
        <mesh position={[-0.85, -0.4, CARD.c / 2 + OFFSET]} rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[0.11, 0.17, 32]} />
          <meshStandardMaterial
            color="#A0CDD2"
            roughness={0.2}
            metalness={0.9}
            emissive="#A0CDD2"
            emissiveIntensity={0.6}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[-0.85, -0.4, CARD.c / 2 + OFFSET]}>
          <circleGeometry args={[0.06, 24]} />
          <meshBasicMaterial color="#A0CDD2" />
        </mesh>
      </group>
    </group>
  );
}