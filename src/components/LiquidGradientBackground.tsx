import React, { useEffect, useRef } from 'react';

const LiquidGradientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Gradient colors
    const colors = [
      { r: 173, g: 216, b: 200 }, // Mint green
      { r: 240, g: 219, b: 165 }  // Light gold
    ];

    // Blob parameters
    const blobs = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 300 + 100,
      xSpeed: (Math.random() - 0.5) * 0.7,
      ySpeed: (Math.random() - 0.5) * 0.7,
      color: Math.random()
    }));

    // Animation
    let animationId: number;
    const animate = () => {
      // Clear canvas with a very light base color
      ctx.fillStyle = 'rgba(240, 240, 240, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(173, 216, 200, 0.5)');
      gradient.addColorStop(1, 'rgba(240, 219, 165, 0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update blobs
      blobs.forEach(blob => {
        // Update position
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;

        // Bounce off edges
        if (blob.x < 0 || blob.x > canvas.width) blob.xSpeed *= -1;
        if (blob.y < 0 || blob.y > canvas.height) blob.ySpeed *= -1;

        // Interpolate between colors based on blob.color
        const r = Math.floor(colors[0].r + (colors[1].r - colors[0].r) * blob.color);
        const g = Math.floor(colors[0].g + (colors[1].g - colors[0].g) * blob.color);
        const b = Math.floor(colors[0].b + (colors[1].b - colors[0].b) * blob.color);

        // Draw blob
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default LiquidGradientBackground; 