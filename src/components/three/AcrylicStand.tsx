"use client";

import { RoundedBox, Text, Float } from "@react-three/drei";

const STAND = {
  w: 1.9,
  h: 2.3,
  c: 0.16,
  r: 0.09,
};

export default function AcrylicStand({
  rotationY,
  mouseX,
  mouseY,
}: {
  rotationY: number;
  mouseX: number;
  mouseY: number;
}) {
  const driftX = mouseX * 0.5;
  const driftY = mouseY * 0.5;

  return (
    <group position={[driftX, driftY, 0]}>
      {/* Stand plate (rotates slowly, feels like turning on a display stand) */}
      <RoundedBox
        args={[STAND.w, STAND.h, STAND.c]}
        radius={STAND.r}
        smoothness={10}
        rotation={[0, rotationY, 0]}
      >
        <meshPhysicalMaterial
          color="#0E2230"
          roughness={0.08}
          transmission={0}
          transparent
          opacity={1}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </RoundedBox>

      {/* Acrylic border highlight */}
      <mesh rotation={[0, rotationY, 0]} position={[0, 0, 0]}>
        <boxGeometry args={[STAND.w + 0.03, STAND.h + 0.03, STAND.c + 0.03]} />
        <meshStandardMaterial
          color="#68B0B7"
          emissive="#68B0B7"
          emissiveIntensity={0.25}
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Content zone that "comes alive" on the stand face */}
      <group rotation={[0, rotationY, 0]}>
        {/* Logo orb */}
        <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.4}>
          <mesh position={[0, 0.55, STAND.c / 2 + 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.34, 48]} />
            <meshPhysicalMaterial
              color="#68B0B7"
              roughness={0.1}
              metalness={0.2}
              emissive="#2A7A82"
              emissiveIntensity={0.8}
              transparent
              opacity={0.92}
              clearcoat={1}
            />
          </mesh>
          <Text
            position={[0, 0.55, STAND.c / 2 + 0.06]}
            fontSize={0.3}
            color="#04120f"
            fontWeight={900}
            font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1O4a0Fg.ttf"
          >
            {`G`}
          </Text>
        </Float>

        {/* Stand branding */}
        <Text
          position={[0, -0.05, STAND.c / 2 + 0.03]}
          fontSize={0.09}
          color="#A0CDD2"
          maxWidth={1.3}
        >
          {`GoTap · NFC Display Stand`}
        </Text>

        {/* QR chip */}
        <mesh position={[0.6, -0.5, STAND.c / 2 + 0.03]}>
          <boxGeometry args={[0.34, 0.34, 0.03]} />
          <meshStandardMaterial
            color="#0B132B"
            roughness={0.3}
            emissive="#68B0B7"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* base feet */}
        <mesh position={[-0.45, -0.9, STAND.c / 2 - 0.02]}>
          <boxGeometry args={[0.7, 0.12, 0.22]} />
          <meshStandardMaterial color="#10242e" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0.45, -0.9, STAND.c / 2 - 0.02]}>
          <boxGeometry args={[0.7, 0.12, 0.22]} />
          <meshStandardMaterial color="#10242e" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}