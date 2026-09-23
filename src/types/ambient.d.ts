// Ambient declarations for external 3D and utility libraries

declare module "canvas-confetti" {
  export default function confetti(options?: any): Promise<null>;
}

declare module "@react-three/fiber" {
  export const Canvas: any;
  export function useFrame(callback: (state: any, delta: number) => void): void;
  export function useThree(): any;
}

declare module "@react-three/drei" {
  export const OrbitControls: any;
  export const Sphere: any;
  export const MeshDistortMaterial: any;
  export const Float: any;
  export const Html: any;
  export const Text: any;
  export const Line: any;
  export const Icosahedron: any;
  export const Points: any;
  export const PointMaterial: any;
  export const Ring: any;
}

