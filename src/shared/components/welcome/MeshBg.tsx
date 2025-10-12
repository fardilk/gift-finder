import React from 'react';

/**
 * MeshBg: soft mesh gradient background (purple → teal), full-screen behind content
 */
export function MeshBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Radial gradients blended to create a soft mesh look */}
      <div
        className="absolute -inset-1 opacity-60"
        style={{
          background:
            'radial-gradient(60rem 60rem at 20% 20%, rgba(168, 85, 247, 0.35), transparent 55%),' +
            'radial-gradient(50rem 45rem at 80% 30%, rgba(56, 189, 248, 0.35), transparent 55%),' +
            'radial-gradient(40rem 40rem at 40% 80%, rgba(45, 212, 191, 0.30), transparent 55%)',
          filter: 'blur(20px)',
        }}
      />
      {/* Subtle vignette to soften edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
      {/* Very light noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<?xml version=\'1.0\' encoding=\'UTF-8\'?><svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.4\'/></svg>" )' }}
      />
    </div>
  );
}

export default MeshBg;
