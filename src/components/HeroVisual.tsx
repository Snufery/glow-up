"use client";

import { useEffect, useRef } from "react";

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const dpr = window.devicePixelRatio || 1;
    const W = 560;
    const H = 560;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2 + 20;

    // Colors
    const GREEN = "#7AB648";
    const TEAL = "#2BBCB3";
    const GG = "rgba(122,182,72,";  // green glow prefix
    const TG = "rgba(43,188,179,";  // teal glow prefix

    // ═══════ Particles ═══════
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.25 - 0.1,
        size: Math.random() * 2.2 + 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? GREEN : TEAL,
      });
    }

    // ═══════ IoT Icon draw functions ═══════
    const drawLightbulb = (x: number, y: number, s: number, a: number) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = GREEN; ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(x, y - s * 0.18, s * 0.42, Math.PI * 1.15, Math.PI * -0.15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - s * 0.2, y + s * 0.15); ctx.lineTo(x + s * 0.2, y + s * 0.15);
      ctx.moveTo(x - s * 0.16, y + s * 0.28); ctx.lineTo(x + s * 0.16, y + s * 0.28); ctx.stroke();
      // rays
      for (let i = 0; i < 5; i++) {
        const ra = -Math.PI * 0.8 + i * (Math.PI * 0.4);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(ra) * s * 0.5, y - s * 0.18 + Math.sin(ra) * s * 0.5);
        ctx.lineTo(x + Math.cos(ra) * s * 0.65, y - s * 0.18 + Math.sin(ra) * s * 0.65);
        ctx.strokeStyle = GG + "0.3)"; ctx.stroke();
      }
      const g = ctx.createRadialGradient(x, y - s * 0.1, 0, x, y - s * 0.1, s * 1.1);
      g.addColorStop(0, GG + "0.12)"); g.addColorStop(1, GG + "0)");
      ctx.fillStyle = g; ctx.fillRect(x - s * 1.2, y - s * 1.2, s * 2.4, s * 2.4);
      ctx.restore();
    };

    const drawLock = (x: number, y: number, s: number, a: number) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = TEAL; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(x - s * 0.32, y - s * 0.02, s * 0.64, s * 0.5, 3); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y - s * 0.12, s * 0.2, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + s * 0.18, s * 0.07, 0, Math.PI * 2); ctx.fillStyle = TEAL; ctx.fill();
      ctx.restore();
    };

    const drawCamera = (x: number, y: number, s: number, a: number) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = TEAL; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(x - s * 0.38, y - s * 0.22, s * 0.76, s * 0.48, 4); ctx.stroke();
      ctx.strokeStyle = GREEN;
      ctx.beginPath(); ctx.arc(x, y, s * 0.15, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, s * 0.05, 0, Math.PI * 2); ctx.fillStyle = GREEN; ctx.fill();
      // recording dot
      ctx.beginPath(); ctx.arc(x + s * 0.28, y - s * 0.12, s * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = "#FF4444"; ctx.fill();
      ctx.restore();
    };

    const drawWifi = (x: number, y: number, s: number, a: number) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = GREEN; ctx.lineWidth = 1.8; ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const r = s * 0.14 + i * s * 0.14;
        ctx.beginPath(); ctx.arc(x, y + s * 0.1, r, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(x, y + s * 0.1, s * 0.04, 0, Math.PI * 2); ctx.fillStyle = GREEN; ctx.fill();
      ctx.restore();
    };

    const drawThermo = (x: number, y: number, s: number, a: number) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = TEAL; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(x - s * 0.08, y - s * 0.32, s * 0.16, s * 0.48, 4); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + s * 0.24, s * 0.13, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + s * 0.24, s * 0.06, 0, Math.PI * 2); ctx.fillStyle = TEAL; ctx.fill();
      ctx.restore();
    };

    const drawPlug = (x: number, y: number, s: number, a: number) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = GREEN; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(x - s * 0.28, y - s * 0.22, s * 0.56, s * 0.48, 5); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s * 0.1, y - s * 0.06); ctx.lineTo(x - s * 0.1, y + s * 0.1);
      ctx.moveTo(x + s * 0.1, y - s * 0.06); ctx.lineTo(x + s * 0.1, y + s * 0.1);
      ctx.stroke();
      ctx.restore();
    };

    const drawShield = (x: number, y: number, s: number, a: number) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = TEAL; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.35);
      ctx.bezierCurveTo(x - s * 0.35, y - s * 0.2, x - s * 0.35, y + s * 0.15, x, y + s * 0.35);
      ctx.bezierCurveTo(x + s * 0.35, y + s * 0.15, x + s * 0.35, y - s * 0.2, x, y - s * 0.35);
      ctx.stroke();
      // checkmark
      ctx.strokeStyle = GREEN; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(x - s * 0.12, y); ctx.lineTo(x - s * 0.02, y + s * 0.1); ctx.lineTo(x + s * 0.14, y - s * 0.1); ctx.stroke();
      ctx.restore();
    };

    const drawSpeaker = (x: number, y: number, s: number, a: number) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = GREEN; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(x - s * 0.18, y - s * 0.28, s * 0.36, s * 0.56, 8); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + s * 0.05, s * 0.1, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y - s * 0.12, s * 0.04, 0, Math.PI * 2); ctx.fillStyle = TEAL; ctx.fill();
      ctx.restore();
    };

    const iotIcons = [
      { draw: drawLightbulb, angle: 0, orbitR: 210, size: 30, speed: 0.12 },
      { draw: drawLock, angle: Math.PI * 0.25, orbitR: 210, size: 28, speed: 0.12 },
      { draw: drawCamera, angle: Math.PI * 0.5, orbitR: 210, size: 30, speed: 0.12 },
      { draw: drawWifi, angle: Math.PI * 0.75, orbitR: 210, size: 28, speed: 0.12 },
      { draw: drawThermo, angle: Math.PI, orbitR: 210, size: 26, speed: 0.12 },
      { draw: drawPlug, angle: Math.PI * 1.25, orbitR: 210, size: 26, speed: 0.12 },
      { draw: drawShield, angle: Math.PI * 1.5, orbitR: 210, size: 28, speed: 0.12 },
      { draw: drawSpeaker, angle: Math.PI * 1.75, orbitR: 210, size: 26, speed: 0.12 },
    ];

    // ═══════ Draw Office Building (behind, to the right) ═══════
    const drawOffice = (t: number) => {
      const ox = cx + 75;
      const oy = cy - 20;
      const s = 42;
      const breathe = Math.sin(t * 0.5) * 0.015 + 1;
      const bs = s * breathe;

      ctx.save();
      ctx.globalAlpha = 0.55;

      const grad = ctx.createLinearGradient(ox - bs, oy - bs * 2, ox + bs, oy + bs);
      grad.addColorStop(0, TG + "0.6)");
      grad.addColorStop(1, GG + "0.3)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";

      // Main tall body
      ctx.beginPath();
      ctx.rect(ox - bs * 0.55, oy - bs * 1.6, bs * 1.1, bs * 2.2);
      ctx.stroke();

      // Side wing (shorter)
      ctx.beginPath();
      ctx.rect(ox + bs * 0.55, oy - bs * 0.8, bs * 0.6, bs * 1.4);
      ctx.stroke();

      // Antenna/spire on top
      ctx.beginPath();
      ctx.moveTo(ox, oy - bs * 1.6);
      ctx.lineTo(ox, oy - bs * 2.05);
      ctx.strokeStyle = TG + "0.4)";
      ctx.stroke();
      // blinking light on antenna
      const blink = Math.sin(t * 3) > 0.3 ? 0.8 : 0.2;
      ctx.beginPath(); ctx.arc(ox, oy - bs * 2.05, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = TG + blink + ")"; ctx.fill();

      // Windows grid - main building
      ctx.strokeStyle = TG + "0.35)";
      ctx.lineWidth = 0.8;
      const rows = 5;
      const cols = 3;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wx = ox - bs * 0.4 + c * bs * 0.32;
          const wy = oy - bs * 1.4 + r * bs * 0.4;
          const ww = bs * 0.2;
          const wh = bs * 0.22;
          ctx.beginPath();
          ctx.roundRect(wx, wy, ww, wh, 1);
          ctx.stroke();
          // random lit windows
          const lit = Math.sin(t * 0.7 + r * 3 + c * 7) > 0.2;
          if (lit) {
            ctx.fillStyle = TG + (0.06 + Math.sin(t * 0.8 + r + c) * 0.03) + ")";
            ctx.fill();
          }
        }
      }

      // Windows - side wing
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 1; c++) {
          const wx = ox + bs * 0.65 + c * bs * 0.3;
          const wy = oy - bs * 0.6 + r * bs * 0.4;
          ctx.beginPath();
          ctx.roundRect(wx, wy, bs * 0.2, bs * 0.22, 1);
          ctx.stroke();
          const lit = Math.sin(t * 0.5 + r * 5 + 2) > 0;
          if (lit) { ctx.fillStyle = GG + "0.05)"; ctx.fill(); }
        }
      }

      // Entrance
      ctx.strokeStyle = TG + "0.3)";
      ctx.beginPath();
      ctx.roundRect(ox - bs * 0.15, oy + bs * 0.35, bs * 0.3, bs * 0.25, 2);
      ctx.stroke();

      ctx.restore();
    };

    // ═══════ Draw House (main, front) ═══════
    const drawHouse = (t: number) => {
      const pulse = Math.sin(t * 0.8) * 0.025 + 1;
      const hx = cx - 30;
      const hy = cy + 15;
      const s = 65 * pulse;

      ctx.save();

      // Ground glow
      const groundGlow = ctx.createRadialGradient(cx, hy + s * 0.85, 0, cx, hy + s * 0.85, s * 2.8);
      groundGlow.addColorStop(0, GG + "0.1)");
      groundGlow.addColorStop(0.4, TG + "0.04)");
      groundGlow.addColorStop(1, "transparent");
      ctx.fillStyle = groundGlow;
      ctx.fillRect(cx - s * 3, hy - s, s * 6, s * 3);

      // Ground ellipses
      ctx.strokeStyle = TG + "0.18)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, hy + s * 0.82, s * 2.2, s * 0.45, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = GG + "0.1)";
      ctx.beginPath(); ctx.ellipse(cx, hy + s * 0.82, s * 2.8, s * 0.6, 0, 0, Math.PI * 2); ctx.stroke();

      // Rotating dashed orbit
      ctx.save();
      ctx.translate(cx, cy + 15);
      ctx.rotate(t * 0.03);
      ctx.setLineDash([5, 10]);
      ctx.strokeStyle = TG + "0.08)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, s * 3.2, s * 2.6, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // === House wireframe ===
      const grad = ctx.createLinearGradient(hx - s, hy - s, hx + s, hy + s);
      grad.addColorStop(0, GREEN); grad.addColorStop(1, TEAL);
      ctx.strokeStyle = grad; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.lineCap = "round";

      // Walls
      ctx.beginPath();
      ctx.moveTo(hx - s * 0.72, hy + s * 0.08);
      ctx.lineTo(hx - s * 0.72, hy + s * 0.72);
      ctx.lineTo(hx + s * 0.72, hy + s * 0.72);
      ctx.lineTo(hx + s * 0.72, hy + s * 0.08);
      ctx.closePath(); ctx.stroke();

      // Roof
      ctx.beginPath();
      ctx.moveTo(hx - s * 0.88, hy + s * 0.12);
      ctx.lineTo(hx, hy - s * 0.62);
      ctx.lineTo(hx + s * 0.88, hy + s * 0.12);
      ctx.closePath(); ctx.stroke();

      // Chimney
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.rect(hx + s * 0.35, hy - s * 0.55, s * 0.16, s * 0.35);
      ctx.stroke();
      // smoke particles from chimney
      for (let i = 0; i < 3; i++) {
        const smokeY = hy - s * 0.58 - i * 12 - ((t * 15) % 20);
        const smokeX = hx + s * 0.43 + Math.sin(t * 2 + i * 2) * 4;
        const smokeAlpha = Math.max(0, 0.15 - i * 0.04);
        ctx.beginPath(); ctx.arc(smokeX, smokeY, 3 - i * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = TG + smokeAlpha + ")"; ctx.fill();
      }

      // Roof top glow
      const roofGlow = ctx.createRadialGradient(hx, hy - s * 0.45, 0, hx, hy - s * 0.45, s * 0.6);
      roofGlow.addColorStop(0, GG + "0.18)"); roofGlow.addColorStop(1, "transparent");
      ctx.fillStyle = roofGlow;
      ctx.beginPath(); ctx.arc(hx, hy - s * 0.45, s * 0.6, 0, Math.PI * 2); ctx.fill();

      // Door
      ctx.strokeStyle = TG + "0.55)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(hx - s * 0.14, hy + s * 0.32, s * 0.28, s * 0.4, 3); ctx.stroke();
      // doorknob
      ctx.beginPath(); ctx.arc(hx + s * 0.07, hy + s * 0.52, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = TEAL; ctx.fill();

      // Windows with animated glow
      const drawWindow = (wx: number, wy: number, ww: number, wh: number, phase: number) => {
        ctx.strokeStyle = GG + "0.45)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 2); ctx.stroke();
        // cross divider
        ctx.beginPath();
        ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh);
        ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2);
        ctx.strokeStyle = GG + "0.2)"; ctx.lineWidth = 0.8; ctx.stroke();
        // warm glow
        const glow = 0.06 + Math.sin(t * 1.2 + phase) * 0.04;
        ctx.fillStyle = GG + glow + ")"; ctx.fillRect(wx, wy, ww, wh);
      };

      drawWindow(hx - s * 0.58, hy + s * 0.18, s * 0.28, s * 0.22, 0);
      drawWindow(hx + s * 0.3, hy + s * 0.18, s * 0.28, s * 0.22, 2);
      // upper window (attic)
      drawWindow(hx - s * 0.12, hy - s * 0.2, s * 0.24, s * 0.18, 4);

      // Garden / path
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = GG + "0.12)"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, hy + s * 0.72);
      ctx.quadraticCurveTo(hx - s * 0.3, hy + s * 0.95, hx - s * 0.8, hy + s * 0.85);
      ctx.stroke();
      ctx.setLineDash([]);

      // Smart hub dot (pulsing center)
      const dp = Math.sin(t * 2.2) * 0.3 + 0.7;
      ctx.beginPath(); ctx.arc(hx, hy - s * 0.12, s * 0.07, 0, Math.PI * 2);
      ctx.fillStyle = GG + dp + ")"; ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy - s * 0.12, s * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = GG + dp * 0.12 + ")"; ctx.fill();
      // expanding ring
      const ringR = (t * 20) % (s * 0.6);
      const ringA = Math.max(0, 0.2 - ringR / (s * 0.6) * 0.2);
      ctx.beginPath(); ctx.arc(hx, hy - s * 0.12, ringR + s * 0.1, 0, Math.PI * 2);
      ctx.strokeStyle = GG + ringA + ")"; ctx.lineWidth = 1; ctx.stroke();

      // Scan line
      ctx.strokeStyle = GG + "0.03)"; ctx.lineWidth = 0.5;
      const scanY = ((t * 25) % (s * 1.5)) - s * 0.6 + hy;
      for (let i = -1; i <= 1; i++) {
        const sy = scanY + i * 5;
        if (sy > hy - s * 0.65 && sy < hy + s * 0.75) {
          ctx.beginPath(); ctx.moveTo(hx - s * 0.85, sy); ctx.lineTo(hx + s * 0.85, sy); ctx.stroke();
        }
      }

      ctx.restore();
    };

    // ═══════ Connection lines ═══════
    const drawConnections = (t: number) => {
      ctx.save();
      iotIcons.forEach((icon, i) => {
        const angle = icon.angle + t * icon.speed;
        const ix = cx + Math.cos(angle) * icon.orbitR;
        const iy = cy + Math.sin(angle) * icon.orbitR * 0.6 + 20;
        ctx.setLineDash([3, 14]);
        ctx.lineDashOffset = -t * 35 + i * 25;
        ctx.strokeStyle = i % 2 === 0 ? GG + "0.1)" : TG + "0.1)";
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(cx - 10, cy + 15); ctx.lineTo(ix, iy); ctx.stroke();
      });
      ctx.setLineDash([]); ctx.restore();
    };

    // ═══════ Data stream effect between house and office ═══════
    const drawDataStream = (t: number) => {
      ctx.save();
      const hx = cx - 30, hy = cy + 15, ox = cx + 75, oy = cy - 20;
      const dots = 6;
      for (let i = 0; i < dots; i++) {
        const prog = ((t * 0.4 + i / dots) % 1);
        const dx = hx + (ox - hx) * prog;
        const dy = hy + (oy - hy) * prog + Math.sin(prog * Math.PI) * -15;
        const da = Math.sin(prog * Math.PI) * 0.5;
        ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fillStyle = TG + da + ")"; ctx.fill();
      }
      ctx.restore();
    };

    // ═══════ Main animation loop ═══════
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, W, H);

      // Particles
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const flicker = Math.sin(time * 2 + p.x * 0.1) * 0.25 + 0.75;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha * flicker; ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Connections (behind buildings)
      drawConnections(time);

      // Office building (behind house)
      drawOffice(time);

      // Data stream between buildings
      drawDataStream(time);

      // House (front)
      drawHouse(time);

      // IoT icons orbiting
      iotIcons.forEach((icon) => {
        const angle = icon.angle + time * icon.speed;
        const ix = cx + Math.cos(angle) * icon.orbitR;
        const iy = cy + Math.sin(angle) * icon.orbitR * 0.6 + 20;

        // Icon bg circle
        ctx.save();
        ctx.beginPath(); ctx.arc(ix, iy, icon.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(11,26,43,0.75)"; ctx.fill();
        ctx.strokeStyle = TG + "0.25)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();

        icon.draw(ix, iy, icon.size, 0.85);
      });

      // Floating glow orbs (inner layer)
      for (let i = 0; i < 5; i++) {
        const a = time * 0.25 + i * Math.PI * 0.4;
        const r = 130 + Math.sin(time * 0.7 + i * 1.5) * 35;
        const ox = cx + Math.cos(a) * r;
        const oy = cy + Math.sin(a) * r * 0.45 + 20;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, 10);
        grad.addColorStop(0, i % 2 === 0 ? GG + "0.35)" : TG + "0.35)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(ox, oy, 10, 0, Math.PI * 2); ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="flex-shrink-0 relative z-[1] animate-fade-in-up-delay hidden lg:block -mr-8">
      <canvas
        ref={canvasRef}
        className="w-[560px] h-[560px]"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
}
