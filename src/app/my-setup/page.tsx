"use client";

import { ExternalLink, ZoomIn, Home, Maximize } from "lucide-react";
import { useRef, useEffect, useState } from "react";

import assets from "@/assets";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SetupItem {
  name: string;
  description?: string;
  x: number;
  y: number;
  zoom: number;
  link: string;
}

const setupItems: SetupItem[] = [
  {
    name: "Laptop",
    description: "ASUS TUF Gaming F17 Intel Core i7 12th Gen 12700H",
    x: 20,
    y: 17,
    zoom: 0.3,
    link: "https://www.flipkart.com/asus-tuf-gaming-f17-2022-core-i7-12th-gen-16-gb-1-tb-ssd-windows-11-home-6-gb-graphics-nvidia-geforce-rtx-3060-144-hz-fx707zm-hx030ws-laptop/p/itm237135512c36d"
  },
  {
    name: "Mic",
    description: "JBL Commercial CSUM10 Compact USB Microphone",
    x: 37,
    y: 47,
    zoom: 0.3,
    link: "https://amzn.in/d/6MBoB0R"
  },
  {
    name: "Monitor",
    description: "BenQ GW2790QT 27' IPS 2k QHD Monitor",
    x: 55,
    y: 23,
    zoom: 0.2,
    link: "https://amzn.in/d/fMQveLu"
  },
  {
    name: "WebCam",
    description: "HP 320 FHD Webcam 1080 Full HD 30fps",
    x: 55.5,
    y: 1,
    zoom: 0.3,
    link: "https://amzn.in/d/3RRz1VH"
  },
  {
    name: "Keyboard",
    description: "TVS ELECTRONICS Gold Prime Mechanical Wired Keyboard",
    x: 53,
    y: 67,
    zoom: 0.3,
    link: "https://amzn.in/d/iGTiYeX"
  },
  {
    name: "Earbuds",
    description: "JBL Wave Buds 2 Ear Buds",
    x: 30.5,
    y: 58,
    zoom: 1,
    link: "https://amzn.in/d/gmqqYMj"
  },
  {
    name: "Mouse",
    description: "Acer Wireless Mouse",
    x: 86,
    y: 71,
    zoom: 0.5,
    link: "https://amzn.in/d/5oyTTw7"
  },
  {
    name: "Hub",
    description: "TP-Link UH400 USB 3.0 4-Port Portable Data Hub",
    x: 6,
    y: 59,
    zoom: 0.6,
    link: "https://amzn.in/d/32iwqBw"
  }
];

export default function Setup() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(1.0);
  const [currentX, setCurrentX] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{ id: number; x: number; y: number } | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [minZoom, setMinZoom] = useState<number>(0.2);

  const resetView = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let newZoom = 1.0;
    let newX = 0;
    let newY = 0;

    if (canvasRatio > imgRatio) {
      newZoom = (canvas.height / img.height) * 0.9;
      newX = (canvas.width - img.width * newZoom) / 2;
      newY = canvas.height * 0.05;
    } else {
      newZoom = (canvas.width / img.width) * 0.9;
      newX = canvas.width * 0.05;
      newY = (canvas.height - img.height * newZoom) / 2;
    }

    setMinZoom(newZoom * 0.5);
    animateToPosition(newX, newY, newZoom);
  };

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = assets.setup.src;

    img.onload = () => {
      imageRef.current = img;
      canvas.width = containerRef.current?.clientWidth || window.innerWidth > 896 ? 896 : window.innerWidth - 32;
      canvas.height = containerRef.current?.clientHeight || 500;
      drawCanvas(ctx, img, currentX, currentY, currentZoom);
      setIsLoaded(true);
      resetView();
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      if (!containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      if (imageRef.current) {
        drawCanvas(ctx, imageRef.current, currentX, currentY, currentZoom);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx || !imageRef.current) return;

    const renderFrame = () => {
      drawCanvas(ctx, imageRef.current!, currentX, currentY, currentZoom);
    };

    const frameId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(frameId);
  }, [currentX, currentY, currentZoom, hoveredItem, focusedItem, hoveredItemId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomSpeed = currentZoom < 1 ? 0.05 : 0.1;
      const zoomDelta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
      const newZoom = Math.max(minZoom, Math.min(5, currentZoom + zoomDelta));

      if (imageRef.current) {
        const img = imageRef.current;
        const worldX = (mouseX - currentX) / (img.width * currentZoom);
        const worldY = (mouseY - currentY) / (img.height * currentZoom);
        const newX = mouseX - worldX * img.width * newZoom;
        const newY = mouseY - worldY * img.height * newZoom;

        setCurrentZoom(newZoom);
        setCurrentX(newX);
        setCurrentY(newY);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const rect = canvas.getBoundingClientRect();
      setDragStartX(e.clientX - rect.left - currentX);
      setDragStartY(e.clientY - rect.top - currentY);
      canvas.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (imageRef.current && !isDragging) {
        const img = imageRef.current;
        let foundItem = false;

        setupItems.forEach((item, index) => {
          const markerX = currentX + (item.x / 100) * img.width * currentZoom;
          const markerY = currentY + (item.y / 100) * img.height * currentZoom;
          const distance = Math.sqrt(Math.pow(mouseX - markerX, 2) + Math.pow(mouseY - markerY, 2));

          if (distance <= 15) {
            setHoveredItem(index);
            setHoveredItemId(index);
            setActiveTooltip({ id: index, x: markerX, y: markerY - 15 });
            foundItem = true;
            canvas.style.cursor = "pointer";
          }
        });

        if (!foundItem && hoveredItem !== null) {
          setHoveredItem(null);
          setHoveredItemId(null);
          setActiveTooltip(null);
          canvas.style.cursor = "grab";
        }
      }

      if (isDragging) {
        const newX = e.clientX - rect.left - dragStartX;
        const newY = e.clientY - rect.top - dragStartY;
        setCurrentX(newX);
        setCurrentY(newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      canvas.style.cursor = "grab";
    };

    const handleClick = () => {
      if (hoveredItem !== null) {
        const item = setupItems.find((_, index) => index === hoveredItem);
        if (item) {
          handleZoomToItem(item, hoveredItem);
        }
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      if (!canvasRef.current || !imageRef.current) return;

      const canvas = canvasRef.current;
      const img = imageRef.current;
      const rect = canvas.getBoundingClientRect();

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const imageX = (clickX - currentX) / (img.width * currentZoom);
      const imageY = (clickY - currentY) / (img.height * currentZoom);

      const percentX = Math.round(imageX * 100);
      const percentY = Math.round(imageY * 100);

      console.log(`Item coordinates: x: ${percentX}, y: ${percentY}`);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        setIsDragging(true);
        const rect = canvas.getBoundingClientRect();
        setDragStartX(e.touches[0].clientX - rect.left - currentX);
        setDragStartY(e.touches[0].clientY - rect.top - currentY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const newX = e.touches[0].clientX - rect.left - dragStartX;
        const newY = e.touches[0].clientY - rect.top - dragStartY;
        setCurrentX(newX);
        setCurrentY(newY);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("click", handleCanvasClick);

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("click", handleCanvasClick);

      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentZoom, currentX, currentY, isDragging, dragStartX, dragStartY, hoveredItem, minZoom]);

  const drawCanvas = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    offsetX: number,
    offsetY: number,
    zoom: number
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const scaledWidth = img.width * zoom;
    const scaledHeight = img.height * zoom;
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

    setupItems.forEach((item, index) => {
      const markerX = offsetX + (item.x / 100) * img.width * zoom;
      const markerY = offsetY + (item.y / 100) * img.height * zoom;

      if (markerX >= -20 && markerX <= ctx.canvas.width + 20 && markerY >= -20 && markerY <= ctx.canvas.height + 20) {
        if (focusedItem === index || hoveredItemId === index) {
          const pulseSize = 20;
          const pulseOpacity = 0.7 + Math.sin(Date.now() / 200) * 0.3;

          ctx.beginPath();
          ctx.arc(markerX, markerY, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${pulseOpacity * 0.2})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(
          markerX,
          markerY,
          hoveredItem === index || focusedItem === index || hoveredItemId === index ? 8 : 6,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
          markerX,
          markerY,
          hoveredItem === index || focusedItem === index || hoveredItemId === index ? 6 : 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle =
          hoveredItem === index || focusedItem === index || hoveredItemId === index ? "#ef4444" : "#f87171";
        ctx.fill();
      }
    });

    if (showMinimap) {
      drawMinimap(ctx, img);
    }
  };

  const animateToPosition = (targetX: number, targetY: number, targetZoom: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startZoom = currentZoom;
    const startX = currentX;
    const startY = currentY;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = ease(progress);

      const newZoom = startZoom + (targetZoom - startZoom) * easedProgress;
      const newX = startX + (targetX - startX) * easedProgress;
      const newY = startY + (targetY - startY) * easedProgress;

      setCurrentZoom(newZoom);
      setCurrentX(newX);
      setCurrentY(newY);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleZoomToItem = (item: SetupItem, index: number) => {
    setFocusedItem(index);
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;
    const targetZoom = item.zoom;
    const targetX = -((item.x / 100) * img.width * targetZoom - canvas.width / 2);
    const targetY = -((item.y / 100) * img.height * targetZoom - canvas.height / 2);

    animateToPosition(targetX, targetY, targetZoom);

    setTimeout(() => {
      setFocusedItem(null);
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const drawMinimap = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const minimapSize = windowSize.width < 640 ? 100 : 120;
    const padding = 10;
    const minimapX = ctx.canvas.width - minimapSize - padding;
    const minimapY = ctx.canvas.height - minimapSize - padding;

    ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
    ctx.beginPath();
    ctx.roundRect(minimapX, minimapY, minimapSize, minimapSize, 8);
    ctx.fill();

    const imgRatio = img.width / img.height;
    let minimapImgWidth = minimapSize - 10;
    let minimapImgHeight = minimapSize - 10;

    if (imgRatio > 1) {
      minimapImgHeight = minimapImgWidth / imgRatio;
    } else {
      minimapImgWidth = minimapImgHeight * imgRatio;
    }

    const minimapImgX = minimapX + (minimapSize - minimapImgWidth) / 2;
    const minimapImgY = minimapY + (minimapSize - minimapImgHeight) / 2;

    ctx.drawImage(img, minimapImgX, minimapImgY, minimapImgWidth, minimapImgHeight);

    const viewportWidth = (ctx.canvas.width / (img.width * currentZoom)) * minimapImgWidth;
    const viewportHeight = (ctx.canvas.height / (img.height * currentZoom)) * minimapImgHeight;
    const viewportX = minimapImgX - (currentX / (img.width * currentZoom)) * minimapImgWidth;
    const viewportY = minimapImgY - (currentY / (img.height * currentZoom)) * minimapImgHeight;

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(
      Math.max(minimapImgX, viewportX),
      Math.max(minimapImgY, viewportY),
      Math.min(minimapImgWidth, viewportWidth),
      Math.min(minimapImgHeight, viewportHeight),
      4
    );
    ctx.stroke();
  };

  const getButtonSize = () => {
    return windowSize.width < 640 ? "sm" : "default";
  };

  const getButtonClass = () => {
    return windowSize.width < 640 ? "h-8 w-8 rounded-full p-0" : "h-10 w-10 rounded-full p-0";
  };

  const zoomOut = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;

    const targetZoom = minZoom;
    const targetX = (canvas.width - img.width * targetZoom) / 2;
    const targetY = (canvas.height - img.height * targetZoom) / 2;

    animateToPosition(targetX, targetY, targetZoom);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-white">My Setup</h1>

        <div className="relative mb-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div ref={containerRef} className="relative h-[70vh] max-h-[700px] min-h-[400px] w-full overflow-hidden">
            <canvas
              ref={canvasRef}
              className={cn(
                "h-full w-full cursor-grab transition-opacity duration-500",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
            />

            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-red-400"></div>
              </div>
            )}

            {activeTooltip && (
              <div
                className="pointer-events-none absolute z-10 rounded-md bg-black/90 px-3 py-2 text-sm font-medium text-white shadow-lg"
                style={{
                  left: `${activeTooltip.x}px`,
                  top: `${activeTooltip.y - 40}px`,
                  transform: "translateX(-50%)"
                }}
              >
                {setupItems.find((_, index) => index === activeTooltip.id)?.name}
              </div>
            )}

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/60 p-1.5 backdrop-blur-md">
              <Button
                onClick={zoomOut}
                size={getButtonSize()}
                variant="ghost"
                className={cn(getButtonClass(), "text-white hover:bg-white/20 hover:text-white")}
                title="Zoom out fully"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </Button>
              <Button
                onClick={() => setShowMinimap(!showMinimap)}
                size={getButtonSize()}
                variant="ghost"
                className={cn(getButtonClass(), "text-white hover:bg-white/20 hover:text-white")}
                title={showMinimap ? "Hide minimap" : "Show minimap"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                </svg>
              </Button>
              <Button
                onClick={toggleFullscreen}
                size={getButtonSize()}
                variant="ghost"
                className={cn(getButtonClass(), "text-white hover:bg-white/20 hover:text-white")}
                title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                <Maximize className="h-4 w-4" />
              </Button>
              <Button
                onClick={resetView}
                size={getButtonSize()}
                variant="ghost"
                className={cn(getButtonClass(), "text-white hover:bg-white/20 hover:text-white")}
                title="Reset view"
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {setupItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/50",
                (focusedItem === index || hoveredItemId === index) &&
                  "border-red-500/50 bg-slate-800/70 ring-1 ring-red-500/30"
              )}
              onMouseEnter={() => setHoveredItemId(index)}
              onMouseLeave={() => setHoveredItemId(null)}
              onClick={() => handleZoomToItem(item, index)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-slate-100">{item.name}</h3>
                  {item.description && <p className="mt-1 text-sm text-slate-400">{item.description}</p>}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomToItem(item, index);
                    }}
                    className="h-7 w-7 rounded-full p-0 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                    <span className="sr-only">Zoom to {item.name}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-7 w-7 rounded-full p-0 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  >
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sr-only">View {item.name} details</span>
                    </a>
                  </Button>
                </div>
              </div>

              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
