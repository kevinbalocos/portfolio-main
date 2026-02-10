"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useThreeD } from "@/contexts/ThreeDContext";
import { cn } from "@/lib/utils";
import { MagneticText } from "@/components/morphing-cursor";

/* CSS Animations */
const animationStyles = `
  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideOutFade {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-15px);
    }
  }

  .thank-you-enter {
    animation: slideUpFade 0.5s ease-out forwards;
  }

  .thank-you-exit {
    animation: slideOutFade 0.6s ease-in forwards;
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

/* Spotlight SVG (unchanged) */
export const Spotlight: React.FC<{ className?: string; fill?: string }> = ({
  className,
  fill = "white",
}) => (
  <svg
    aria-hidden="true"
    role="presentation"
    className={cn(
      "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
      className,
    )}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 3787 2842"
    fill="none"
  >
    <g filter="url(#filter)">
      <ellipse
        cx="1924.71"
        cy="273.501"
        rx="1924.71"
        ry="273.501"
        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        fill={fill}
        fillOpacity="0.21"
      />
    </g>
    <defs>
      <filter
        id="filter"
        x="0.860352"
        y="0.838989"
        width="3785.16"
        height="2840.26"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="151"
          result="effect1_foregroundBlur_1065_8"
        />
      </filter>
    </defs>
  </svg>
);

type SplineModule = { default: React.ComponentType<any> } | null;

interface SplineSceneProps {
  scene: string;
  className?: string;
  autoLoad?: boolean;
  unmountAfterMs?: number;
  previewImage?: string;
}

const getDeviceProfile = () => {
  if (typeof navigator === "undefined")
    return { lowEnd: false, cores: 4, ram: 8 };
  const cores = (navigator.hardwareConcurrency as number) || 4;
  const ram = (navigator as any).deviceMemory || 8;
  return { lowEnd: cores <= 2 || ram <= 4, cores, ram };
};

export const SplineScene: React.FC<SplineSceneProps> = memo(
  function SplineScene({
    scene,
    className,
    autoLoad = true,
    unmountAfterMs = 10_000,
    previewImage,
  }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [userRequested, setUserRequested] = useState(false);
    const [splineModule, setSplineModule] = useState<SplineModule>(null);
    const [isLoading, setIsLoading] = useState(false);
    const unloadTimerRef = useRef<number | undefined>(undefined);
    const profileRef = useRef(getDeviceProfile());

    // bubble & shake UI state
    const [bubble, setBubble] = useState<{
      active: boolean;
      message?: string;
      left?: number;
      top?: number;
    }>({
      active: false,
    });

    // thank you message state
    const [thankYou, setThankYou] = useState<{
      active: boolean;
      isExiting?: boolean;
      left?: number;
      top?: number;
    }>({
      active: false,
    });

    const loadSpline = useCallback(async () => {
      if (splineModule || isLoading) return;
      setIsLoading(true);
      try {
        const doImport = async () => {
          const mod = (await import("@splinetool/react-spline")) as any;
          setSplineModule(mod);
        };
        if (typeof (window as any).requestIdleCallback === "function") {
          (window as any).requestIdleCallback(() => void doImport(), {
            timeout: 1500,
          });
        } else {
          setTimeout(() => void doImport(), 300);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load @splinetool/react-spline", err);
      } finally {
        setIsLoading(false);
      }
    }, [splineModule, isLoading]);

    const requestLoad = useCallback(() => {
      setUserRequested(true);
      void loadSpline();
    }, [loadSpline]);

    useEffect(() => {
      const node = containerRef.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (autoLoad && !profileRef.current.lowEnd) requestLoad();
            if (unloadTimerRef.current) {
              window.clearTimeout(unloadTimerRef.current);
              unloadTimerRef.current = undefined;
            }
          } else {
            setIsVisible(false);
            if (unmountAfterMs > 0 && splineModule) {
              if (unloadTimerRef.current) clearTimeout(unloadTimerRef.current);
              unloadTimerRef.current = window.setTimeout(() => {
                setSplineModule(null);
                setUserRequested(false);
              }, unmountAfterMs);
            }
          }
        },
        { threshold: 0.12 },
      );

      observer.observe(node);
      return () => {
        observer.disconnect();
        if (unloadTimerRef.current) {
          clearTimeout(unloadTimerRef.current);
          unloadTimerRef.current = undefined;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoLoad, unmountAfterMs, splineModule]);

    // ---- global forward (original cursor-follow behavior) ----
    useEffect(() => {
      if (!splineModule) return;
      let active = true;
      const rootNode = containerRef.current;
      if (!rootNode) return;

      const findCanvas = (): HTMLCanvasElement | null =>
        rootNode.querySelector("canvas");
      const clamp = (v: number, a: number, b: number) =>
        Math.max(a, Math.min(b, v));

      const forwardPointer = (e: PointerEvent | MouseEvent) => {
        if (!active) return;
        const canvas = findCanvas();
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        let clientX = (e as PointerEvent).clientX;
        let clientY = (e as PointerEvent).clientY;
        const inside =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;

        if (!inside) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = clientX - centerX;
          const dy = clientY - centerY;
          const maxX = rect.width / 2 - 2;
          const maxY = rect.height / 2 - 2;
          const scale = Math.max(1, Math.abs(dx) / maxX, Math.abs(dy) / maxY);
          const projX = centerX + dx / scale;
          const projY = centerY + dy / scale;
          clientX = clamp(projX, rect.left + 2, rect.right - 2);
          clientY = clamp(projY, rect.top + 2, rect.bottom - 2);
        }

        try {
          const pe = new PointerEvent("pointermove", {
            bubbles: true,
            composed: true,
            clientX,
            clientY,
            pointerType: "mouse",
            isPrimary: true,
          } as PointerEventInit);
          canvas.dispatchEvent(pe);
        } catch {
          const me = new MouseEvent("mousemove", {
            bubbles: true,
            clientX,
            clientY,
            view: window,
          } as MouseEventInit);
          canvas.dispatchEvent(me);
        }
      };

      window.addEventListener("pointermove", forwardPointer, { passive: true });
      window.addEventListener("mousemove", forwardPointer, { passive: true });

      return () => {
        active = false;
        window.removeEventListener("pointermove", forwardPointer);
        window.removeEventListener("mousemove", forwardPointer);
      };
    }, [splineModule]);

    // ---- bot-shake: listens for bot-shake events and performs small oscillation around canvas center ----
    useEffect(() => {
      const rootNode = containerRef.current;
      if (!rootNode) return;

      let rafId: number | null = null;
      let startTs = 0;

      const findCanvas = () =>
        rootNode.querySelector("canvas") as HTMLCanvasElement | null;

      const dispatchPointer = (x: number, y: number) => {
        const canvas = findCanvas();
        if (!canvas) return;
        try {
          const pe = new PointerEvent("pointermove", {
            bubbles: true,
            composed: true,
            clientX: x,
            clientY: y,
            pointerType: "mouse",
            isPrimary: true,
          } as PointerEventInit);
          canvas.dispatchEvent(pe);
        } catch {
          const me = new MouseEvent("mousemove", {
            bubbles: true,
            clientX: x,
            clientY: y,
            view: window,
          } as MouseEventInit);
          canvas.dispatchEvent(me);
        }
      };

      const startShake = (opts?: {
        ampPx?: number;
        freqHz?: number;
        bob?: number;
      }) => {
        const canvas = findCanvas();
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const ampPx = opts?.ampPx ?? 36;
        const freqHz = opts?.freqHz ?? 5.5;
        const bob = opts?.bob ?? 6;

        // set bubble position above head (approx) - top right
        const containerRect = rootNode.getBoundingClientRect();
        const left = centerX - containerRect.left + 60; // Position to the right of head
        const top = centerY - containerRect.top - rect.height * 0.4; // Above head
        setBubble({ active: true, message: "dont turn me off pls", left, top });

        // look straight first (center)
        dispatchPointer(centerX, centerY);

        startTs = 0;
        const loop = (ts: number) => {
          if (!startTs) startTs = ts;
          const t = (ts - startTs) / 1000;
          // left-right sine
          const x = centerX + Math.sin(t * Math.PI * 2 * freqHz) * ampPx;
          const y = centerY + Math.sin(t * Math.PI * 2 * (freqHz / 2)) * bob;
          dispatchPointer(x, y);
          rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
      };

      const stopShake = () => {
        if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        // center head when stopping
        const canvas = findCanvas();
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          dispatchPointer(centerX, centerY);
        }
        setBubble({ active: false });
        startTs = 0;
      };

      const onBotShake = (_ev: Event) => {
        const detail = (_ev as CustomEvent)?.detail ?? (_ev as any)?.detail ?? {};
        const active = !!detail.active;
        const opts = {
          ampPx: detail.ampPx,
          freqHz: detail.freqHz,
          bob: detail.bob,
        };

        if (active) {
          // start with provided small amplitude/frequency if present
          // slight delay to ensure canvas bounding rect stable
          setTimeout(() => startShake(opts), 30);
          setBubble((s) => ({
            ...s,
            active: true,
          }));
        } else {
          stopShake();
        }
      };

      window.addEventListener("bot-shake", onBotShake as EventListener);
      return () => {
        window.removeEventListener("bot-shake", onBotShake as EventListener);
        if (rafId != null) cancelAnimationFrame(rafId);
      };
    }, [splineModule]);

    // ---- thank-you message: shows after hover leaves ----
    useEffect(() => {
      const onThankYou = (_ev: Event) => {
        const rootNode = containerRef.current;
        if (!rootNode) return;

        const canvas = rootNode.querySelector(
          "canvas",
        ) as HTMLCanvasElement | null;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const containerRect = rootNode.getBoundingClientRect();

        const left = centerX - containerRect.left + 60;
        const top = centerY - containerRect.top - rect.height * 0.4;

        // Show thank you with fade-in animation
        setThankYou({ active: true, left, top });

        // Auto-hide after 1 second with fade-out animation
        setTimeout(() => {
          setThankYou((prev) => ({ ...prev, isExiting: true }));
          setTimeout(() => {
            setThankYou({ active: false });
          }, 600);
        }, 1000);
      };

      window.addEventListener("thank-you", onThankYou as EventListener);
      return () => {
        window.removeEventListener("thank-you", onThankYou as EventListener);
      };
    }, []);

    const { lowEnd } = profileRef.current;
    const onClickLoad = () => requestLoad();
    const SplineComp = splineModule ? (splineModule as any).default : null;

    return (
      <div
        ref={containerRef}
        className={className ?? "relative"}
        aria-live="polite"
      >
        {/* bubble overlay placed above head when active */}
        {bubble.active && bubble.message ? (
          <div
            aria-hidden
            className="pointer-events-none absolute z-40"
            style={{
              left: bubble.left != null ? `${bubble.left}px` : "50%",
              top: bubble.top != null ? `${bubble.top}px` : "6%",
            }}
          >
            <div className="inline-flex items-center gap-1">
              <div className="w-0 h-0 border-t-6 border-b-6 border-r-8 border-transparent border-r-teal-900/60" />
              <div className="px-3 py-1.5 rounded-full bg-teal-900/60 text-teal-200 text-xs font-medium italic shadow-sm backdrop-blur-sm">
                {bubble.message}
              </div>
            </div>
          </div>
        ) : null}

        {/* thank you message overlay */}
        {thankYou.active ? (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute z-40",
              thankYou.isExiting ? "thank-you-exit" : "thank-you-enter",
            )}
            style={{
              left: thankYou.left != null ? `${thankYou.left}px` : "50%",
              top: thankYou.top != null ? `${thankYou.top}px` : "6%",
            }}
          >
            <div className="inline-flex items-center gap-2">
              <div className="w-0 h-0 border-t-6 border-b-6 border-r-8 border-transparent border-r-teal-400/60" />
              <div className="px-4 py-2 rounded-full bg-teal-500/20 text-teal-300 text-xs font-medium italic backdrop-blur-md border border-teal-400/30 shadow-lg">
                Thank you!
              </div>
            </div>
          </div>
        ) : null}

        {SplineComp && isVisible ? (
          <SplineComp scene={scene} />
        ) : isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-300 bg-gray-900">
            Loading 3D...
          </div>
        ) : lowEnd && !userRequested ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3  text-gray-300">
            {previewImage ? (
              <img
                src={previewImage}
                alt="3D preview"
                className="max-h-48 object-contain rounded-md"
              />
            ) : null}
            <p className="text-sm">
              3D content is disabled on this device for performance.
            </p>
            <button
              onClick={onClickLoad}
              className="px-3 py-2 rounded cursor-pointer bg-white/8 border border-white/10 text-white text-sm hover:bg-white/12"
            >
              Load 3D anyway
            </button>
          </div>
        ) : null}
      </div>
    );
  },
);

export function SplineSceneBasic() {
  const [isLowEnd] = useState(() => {
    if (typeof window === "undefined") return false;
    const cores = (navigator.hardwareConcurrency as number) || 1;
    const ram = (navigator as any).deviceMemory || 8;
    return cores <= 2 || ram <= 4;
  });
  const { is3DEnabled, isHoveringToggle } = useThreeD();
  const sceneContainerRef = useRef<HTMLDivElement | null>(null);

  // Trigger bot shake animation when hovering the toggle (if 3D is ON)
  useEffect(() => {
    if (isHoveringToggle && is3DEnabled) {
      // Start the head-shaking animation with small amplitude
      window.dispatchEvent(
        new CustomEvent("bot-shake", {
          detail: {
            active: true,
            ampPx: 2, // Small amplitude for just left-right motion
            freqHz: 4, // Fast oscillation
            bob: 0, // No vertical movement
          },
        }),
      );
    } else {
      // Stop the animation when not hovering
      window.dispatchEvent(
        new CustomEvent("bot-shake", {
          detail: { active: false },
        }),
      );
    }
  }, [isHoveringToggle, is3DEnabled]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-teal-500/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div
          ref={sceneContainerRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full"
        >
          <div className="relative z-10 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-teal-400 font-mono text-sm">
                Hi, my name is
              </span>
              <div className="h-px bg-teal-400/30 flex-1 max-w-12" />
            </div>
            <h1 className="text-8xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none">
              <MagneticText
                text="KEVIN"
                hoverText="KEVIN"
                className="text-white"
                baseTextClassName="text-white text-6xl md:text-6xl lg:text-8xl"
                hoverTextClassName="text-white text-6xl md:text-6xl lg:text-8xl"
                circleClassName="bg-teal-400"
              />
              <br />
              <MagneticText
                text="CALALO"
                hoverText="CALALO"
                className="text-white"
                baseTextClassName="text-teal-400 text-6xl md:text-6xl lg:text-8xl"
                hoverTextClassName="text-teal-400 text-6xl md:text-6xl lg:text-8xl"
                circleClassName="bg-white"
              />
            </h1>
            <h2 className="text-2xl md:text-3xl text-slate-300 font-semibold mb-6 mt-4">
              Software Engineer & Creative Technologist
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-8">
              I'm a passionate developer obsessed with building beautiful,
              functional digital experiences. I specialize in crafting
              interactive web applications with modern technologies and creating
              immersive 3D experiences that engage users.
            </p>

            <div className="flex gap-4">
              <a
                href="#projects"
                className="px-8 py-3 border-2 border-teal-400 text-teal-400 font-semibold rounded hover:bg-teal-400/10 transition-colors"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="px-8 py-3 bg-teal-400/20 border border-teal-400/50 text-teal-300 font-semibold rounded hover:bg-teal-400/30 transition-colors"
              >
                Get In Touch
              </a>
            </div>

            <div className="flex gap-6 mt-12">
              <a
                href="https://github.com/kevinbalocos"
                className="text-slate-400 hover:text-teal-400 transition-colors font-mono text-sm"
                title="GitHub"
              >
                GitHub
              </a>
              <a
                href="https://www.instagram.com/jeydnd_/"
                className="text-slate-400 hover:text-teal-400 transition-colors font-mono text-sm"
                title="Instagram"
              >
                Instagram
              </a>
            </div>
          </div>

          {is3DEnabled && !isLowEnd && (
            <div className="relative z-5 order-1 lg:order-2 h-96 lg:h-full">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {isLowEnd && (
            <div className="relative z-5 order-1 lg:order-2 h-96 lg:h-full flex items-center justify-center">
              <div className="text-center text-slate-400">
                <p className="text-sm">
                  3D content is not available on this device to maintain optimal
                  performance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-teal-400/60 text-sm font-mono">
          Scroll to explore
        </span>
        <svg
          className="w-5 h-5 text-teal-400/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
