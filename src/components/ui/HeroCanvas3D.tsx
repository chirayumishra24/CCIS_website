"use client";
import React, { useEffect, useRef } from "react";

export default function HeroCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes setup with depth layer
    const particleCount = Math.min(Math.floor(width / 18), 65);
    const particles: Array<{
      x: number;
      y: number;
      z: number; // depth layer (0.5 to 2.5)
      radius: number;
      vx: number;
      vy: number;
      baseAlpha: number;
      isGold: boolean;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const z = Math.random() * 2 + 0.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        radius: (Math.random() * 1.8 + 1) * (z * 0.7),
        vx: ((Math.random() - 0.5) * 0.35) / z,
        vy: ((Math.random() - 0.5) * 0.35) / z,
        baseAlpha: Math.random() * 0.45 + 0.2,
        isGold: Math.random() > 0.4,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Draw connecting lines with gold gradient
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 135 * ((particles[i].z + particles[j].z) / 2.5);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Gentle interactive mouse push / pull
        const mdx = mouseX - p.x;
        const mdy = mouseY - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        
        let displayX = p.x;
        let displayY = p.y;

        if (mdist < 160) {
          const force = (1 - mdist / 160) * 12;
          displayX -= (mdx / mdist) * force;
          displayY -= (mdy / mdist) * force;
        }

        const alpha = mdist < 140 ? Math.min(p.baseAlpha + 0.35, 0.95) : p.baseAlpha;

        ctx.beginPath();
        ctx.arc(displayX, displayY, p.radius, 0, Math.PI * 2);
        
        if (p.isGold) {
          ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[5] opacity-75"
    />
  );
}
