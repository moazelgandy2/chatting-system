"use client";
import { useEffect, useRef } from "react";
export default function StarFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const setCanvasDimensions = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    const stars = [] as {
      x: number;
      y: number;
      radius: number;
      speed: number;
      brightness: number;
    }[];
    const createStars = () => {
      stars.length = 0;
      const starCount = Math.floor((canvas.width * canvas.height) / 1800);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2,
          speed: Math.random() * 0.03,
          brightness: Math.random(),
        });
      }
    };
    const shootingStars = [] as {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      active: boolean;
      delay: number;
    }[];
    const createShootingStars = () => {
      shootingStars.length = 0;
      const count = 3;
      for (let i = 0; i < count; i++) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: (Math.random() * canvas.height) / 2,
          length: 50 + Math.random() * 70,
          speed: 5 + Math.random() * 10,
          angle: Math.PI / 4 + (Math.random() * Math.PI) / 4,
          active: false,
          delay: 1000 + Math.random() * 5000,
        });
      }
    };
    createStars();
    createShootingStars();
    window.addEventListener("resize", createStars);
    let animationFrameId: number;
    let lastTime = 0;
    const shootingStarTimers: ReturnType<typeof setTimeout>[] = [];
    shootingStars.forEach((star, index) => {
      shootingStarTimers[index] = setTimeout(() => {
        star.active = true;
        star.x = Math.random() * canvas.width;
        star.y = (Math.random() * canvas.height) / 2;
      }, star.delay);
    });
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const deltaTime = time - lastTime;
      lastTime = time;
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + star.brightness * 0.3})`;
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      shootingStars.forEach((star, index) => {
        if (star.active) {
          ctx.beginPath();
          const tailX = star.x - Math.cos(star.angle) * star.length;
          const tailY = star.y + Math.sin(star.angle) * star.length;
          const gradient = ctx.createLinearGradient(
            star.x,
            star.y,
            tailX,
            tailY
          );
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          star.x += Math.cos(star.angle) * star.speed;
          star.y -= Math.sin(star.angle) * star.speed;
          if (star.x > canvas.width || star.y < 0) {
            star.active = false;
            clearTimeout(shootingStarTimers[index]);
            shootingStarTimers[index] = setTimeout(() => {
              star.active = true;
              star.x = Math.random() * canvas.width;
              star.y = (Math.random() * canvas.height) / 2;
              star.angle = Math.PI / 4 + (Math.random() * Math.PI) / 4;
            }, 1000 + Math.random() * 5000);
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("resize", createStars);
      cancelAnimationFrame(animationFrameId);
      shootingStarTimers.forEach((timer) => clearTimeout(timer));
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
    />
  );
}
