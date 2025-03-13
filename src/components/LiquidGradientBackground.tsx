import React, { useEffect, useRef, useState, useContext, useMemo } from 'react';
import { getUserSettings } from '@/lib/supabaseClient';
import { gradientOptions, generateRandomGradient, shouldUseWhiteText } from './SettingsDialog';
import { TextColorContext } from '@/contexts/TextColorContext';

interface Blob {
  x: number;
  y: number;
  radius: number;
  xSpeed: number;
  ySpeed: number;
  color: number;
  phase: number;
  amplitude: number;
  targetX?: number;
  targetY?: number;
}

const LiquidGradientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gradientColors, setGradientColors] = useState<[string, string]>(['173, 216, 200', '240, 219, 165']); // Default mint-gold
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const lastMouseMoveRef = useRef<number>(0);
  
  // Get the context directly to update it
  const textColorContext = useContext(TextColorContext) as any;

  // Function to update gradient colors and text color
  const updateGradientColors = (colors: [string, string]) => {
    setGradientColors(colors);
    
    // Update the text color context if it has a setter
    if (textColorContext && textColorContext.setShouldUseWhite) {
      const shouldUseWhite = shouldUseWhiteText(colors[0]);
      textColorContext.setShouldUseWhite(shouldUseWhite);
    }
  };

  // Load gradient from settings
  useEffect(() => {
    const loadGradientFromSettings = async () => {
      try {
        const settings = await getUserSettings();
        if (settings?.appearance?.backgroundGradient) {
          const gradientId = settings.appearance.backgroundGradient;
          
          if (gradientId === 'random') {
            const randomColors = generateRandomGradient();
            updateGradientColors(randomColors);
          } else {
            const selectedGradient = gradientOptions.find(g => g.id === gradientId);
            if (selectedGradient) {
              updateGradientColors(selectedGradient.colors);
            }
          }
        } else {
          const savedSettings = localStorage.getItem('wishone_settings');
          if (savedSettings) {
            try {
              const parsedSettings = JSON.parse(savedSettings);
              const gradientId = parsedSettings?.appearance?.backgroundGradient;
              
              if (gradientId === 'random') {
                const randomColors = generateRandomGradient();
                updateGradientColors(randomColors);
              } else if (gradientId) {
                const selectedGradient = gradientOptions.find((g) => g.id === gradientId);
                if (selectedGradient) {
                  updateGradientColors(selectedGradient.colors);
                }
              }
            } catch (error) {
              console.error('Error parsing saved settings:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading gradient settings:', error);
      }
    };

    loadGradientFromSettings();
  }, []);

  // Parse gradient colors once when they change
  const parsedColors = useMemo(() => {
    return [
      { r: parseInt(gradientColors[0].split(',')[0]), g: parseInt(gradientColors[0].split(',')[1]), b: parseInt(gradientColors[0].split(',')[2]) },
      { r: parseInt(gradientColors[1].split(',')[0]), g: parseInt(gradientColors[1].split(',')[1]), b: parseInt(gradientColors[1].split(',')[2]) }
    ];
  }, [gradientColors]);

  // Create blobs once
  const blobs = useMemo(() => {
    return Array.from({ length: 4 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 0.15 + 0.1, // Slightly smaller blobs
      xSpeed: (Math.random() - 0.5) * 0.001, // Base speed
      ySpeed: (Math.random() - 0.5) * 0.001,
      color: Math.random(),
      phase: Math.random() * Math.PI * 2,
      amplitude: Math.random() * 0.0002 + 0.0001,
      targetX: undefined,
      targetY: undefined
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        isMoving: true
      };
      lastMouseMoveRef.current = performance.now();
    };

    // Set canvas to full screen with DPR support
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    // Draw the background with blur overlay
    const drawBackground = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Create and draw main gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `rgb(${parsedColors[0].r}, ${parsedColors[0].g}, ${parsedColors[0].b})`);
      gradient.addColorStop(1, `rgb(${parsedColors[1].r}, ${parsedColors[1].g}, ${parsedColors[1].b})`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle whitish blur overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 0, width, height);
    };

    // Draw initial background
    drawBackground();

    // Animation with improved fluid movement
    const animate = (timestamp: number) => {
      // Throttle to 60 FPS
      if (timestamp - lastTimeRef.current < 16.67) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = timestamp;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Redraw background
      drawBackground();

      // Check if mouse is still considered moving
      const timeSinceLastMove = timestamp - lastMouseMoveRef.current;
      if (timeSinceLastMove > 100) { // Reset after 100ms of no movement
        mouseRef.current.isMoving = false;
      }

      // Draw and update blobs
      blobs.forEach((blob: Blob, index: number) => {
        // Update blob movement
        if (mouseRef.current.isMoving) {
          // Calculate distance to mouse
          const dx = mouseRef.current.x - blob.x;
          const dy = mouseRef.current.y - blob.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Apply attraction/repulsion based on distance
          if (distance < 0.3) { // Interaction radius
            const force = 0.001 / (distance + 0.1);
            blob.xSpeed += dx * force * (index % 2 ? 1 : -0.5); // Alternate attraction/repulsion
            blob.ySpeed += dy * force * (index % 2 ? 1 : -0.5);
          }
        }

        // Add fluid movement
        blob.xSpeed *= 0.99; // Damping
        blob.ySpeed *= 0.99;
        
        // Add sinusoidal movement
        blob.x += blob.xSpeed + Math.sin(timestamp * 0.002 + blob.phase) * blob.amplitude;
        blob.y += blob.ySpeed + Math.cos(timestamp * 0.002 + blob.phase) * blob.amplitude;

        // Wrap around edges
        blob.x = (blob.x + 1) % 1;
        blob.y = (blob.y + 1) % 1;

        // Convert to screen coordinates
        const x = blob.x * width;
        const y = blob.y * height;
        const radius = blob.radius * Math.min(width, height);

        // Interpolate colors
        const r = Math.floor(parsedColors[0].r + (parsedColors[1].r - parsedColors[0].r) * blob.color);
        const g = Math.floor(parsedColors[0].g + (parsedColors[1].g - parsedColors[0].g) * blob.color);
        const b = Math.floor(parsedColors[0].b + (parsedColors[1].b - parsedColors[0].b) * blob.color);

        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`);
        gradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0.1)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Add highlight effect
        const highlightGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.5);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [parsedColors, blobs]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default LiquidGradientBackground; 