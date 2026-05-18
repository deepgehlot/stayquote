"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const SparklesCore = ({ className, particleCount = 50 }: { className?: string; particleCount?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5, alpha: Math.random(),
      speed: Math.random() * 0.3 + 0.1, dir: Math.random() > 0.5 ? 1 : -1,
    }));
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.alpha += p.speed * 0.01 * p.dir;
        if (p.alpha >= 1 || p.alpha <= 0) p.dir *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241,97,27,${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [particleCount]);
  return <canvas ref={canvasRef} className={cn("absolute inset-0 w-full h-full", className)} />;
};

export const GlowCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("group relative rounded-2xl bg-white border border-gray-100 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#f1611b]/10 hover:-translate-y-1 hover:border-[#f1611b]/30", className)}>
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#f1611b]/5 to-transparent" />
    <div className="relative z-10">{children}</div>
  </div>
);

export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f1611b]/30 bg-[#f1611b]/10 px-4 py-1.5 text-xs font-bold text-[#f1611b] uppercase tracking-widest">
    {children}
  </span>
);
