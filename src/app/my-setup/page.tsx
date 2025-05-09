"use client";

import { ExternalLink, ZoomIn, Home, Maximize, ZoomOut, Map } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

import assets from "@/assets";
import { Button } from "@/components/ui/button";
import profile from "@/data/profile";
import { cn } from "@/lib/utils";
import { SetupItem } from "@/types/profile";

export default function Setup() {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<{ id: number; x: number; y: number } | null>(null);
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [transformState, setTransformState] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = assets.setup.src;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      setIsLoaded(true);
    };
  }, []);

  const handleZoomToItem = (item: SetupItem, index: number) => {
    if (!transformComponentRef.current) return;

    setFocusedItem(index);

    const { zoomToElement } = transformComponentRef.current;
    const targetElement = document.getElementById(`marker-${index}`);

    if (targetElement) {
      zoomToElement(targetElement, item.zoom, 800);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

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

  const getButtonSize = () => {
    return windowSize.width < 640 ? "sm" : "default";
  };

  const getButtonClass = () => {
    return windowSize.width < 640 ? "h-8 w-8 rounded-full p-0" : "h-10 w-10 rounded-full p-0";
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 p-4 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-white">My Setup</h1>

        <div className="relative mb-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div
            ref={containerRef}
            className="relative h-[70vh] max-h-[700px] min-h-[400px] w-full overflow-hidden"
            style={{ contain: "strict" }}
          >
            <TransformWrapper
              ref={transformComponentRef}
              initialScale={1}
              minScale={0.2}
              maxScale={5}
              centerOnInit
              limitToBounds={false}
              doubleClick={{ disabled: true }}
              panning={{ velocityDisabled: true }}
              onPanning={() => {
                setActiveTooltip(null);
              }}
              onTransformed={(ref) => {
                setTransformState({
                  scale: ref.state.scale,
                  positionX: ref.state.positionX,
                  positionY: ref.state.positionY
                });
              }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent
                    wrapperClass={cn(
                      "h-full! w-full! transition-opacity duration-500",
                      isLoaded ? "opacity-100" : "opacity-0"
                    )}
                    contentClass="h-full w-full"
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden"
                    }}
                  >
                    <div className="relative">
                      <img
                        src={assets.setup.src}
                        alt="My setup"
                        className="h-auto w-full"
                        onLoad={() => setIsLoaded(true)}
                      />

                      {profile.setupItems.map((item, index) => (
                        <div
                          id={`marker-${index}`}
                          key={index}
                          className={cn(
                            "absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full",
                            focusedItem === index || hoveredItemId === index ? "bg-red-500/80" : "bg-red-500/60"
                          )}
                          style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            transition: "all 0.2s ease"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleZoomToItem(item, index);
                          }}
                          onMouseEnter={() => {
                            setHoveredItemId(index);
                            setActiveTooltip({
                              id: index,
                              x: (item.x / 100) * imageSize.width,
                              y: (item.y / 100) * imageSize.height
                            });
                          }}
                          onMouseLeave={() => {
                            setHoveredItemId(null);
                            setActiveTooltip(null);
                          }}
                        >
                          <div
                            className={cn(
                              "h-3 w-3 rounded-full bg-white",
                              (focusedItem === index || hoveredItemId === index) && "animate-pulse"
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </TransformComponent>

                  {activeTooltip && (
                    <div
                      className="pointer-events-none absolute z-20 rounded-md bg-black/90 px-3 py-2 text-sm font-medium text-white shadow-lg"
                      style={{
                        left: `${activeTooltip.x}px`,
                        top: `${activeTooltip.y - 40}px`,
                        transform: "translateX(-50%)"
                      }}
                    >
                      {profile.setupItems.find((_, index) => index === activeTooltip.id)?.name}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full bg-black/60 p-1.5 backdrop-blur-md">
                    <Button
                      onClick={() => zoomOut()}
                      size={getButtonSize()}
                      variant="ghost"
                      className={cn(getButtonClass(), "text-white hover:bg-white/20 hover:text-white")}
                      title="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => zoomIn()}
                      size={getButtonSize()}
                      variant="ghost"
                      className={cn(getButtonClass(), "text-white hover:bg-white/20 hover:text-white")}
                      title="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setShowMinimap(!showMinimap)}
                      size={getButtonSize()}
                      variant="ghost"
                      className={cn(getButtonClass(), "text-white hover:bg-white/20 hover:text-white")}
                      title={showMinimap ? "Hide minimap" : "Show minimap"}
                    >
                      <Map className="h-4 w-4" />
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
                      onClick={() => resetTransform()}
                      size={getButtonSize()}
                      variant="ghost"
                      className={cn(getButtonClass(), "text-white hover:bg-white/20 hover:text-white")}
                      title="Reset view"
                    >
                      <Home className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </TransformWrapper>

            {showMinimap && isLoaded && (
              <div className="pointer-events-none absolute right-4 bottom-4 z-20 h-24 w-24 overflow-hidden rounded-lg border border-slate-700 bg-black/60 shadow-lg backdrop-blur-md sm:h-28 sm:w-28">
                <img src={assets.setup.src} alt="Minimap" className="h-full w-full object-cover opacity-70" />
                {imageSize.width > 0 && (
                  <div className="absolute inset-0 border-2 border-red-500/50">
                    <div
                      className="absolute border border-red-500/70 bg-red-500/20"
                      style={{
                        width: `${Math.min(100, Math.max(10, ((containerRef.current?.clientWidth || 0) / (imageSize.width * transformState.scale)) * 100))}%`,
                        height: `${Math.min(100, Math.max(10, ((containerRef.current?.clientHeight || 0) / (imageSize.height * transformState.scale)) * 100))}%`,
                        left: `${Math.min(100, Math.max(0, (-transformState.positionX / (imageSize.width * transformState.scale)) * 100))}%`,
                        top: `${Math.min(100, Math.max(0, (-transformState.positionY / (imageSize.height * transformState.scale)) * 100))}%`
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-red-400"></div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.setupItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/50",
                (focusedItem === index || hoveredItemId === index) &&
                  "border-green-500/50 bg-slate-800/70 ring-1 ring-green-500/30"
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

              <div className="absolute inset-0 -z-10 bg-linear-to-r from-green-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
