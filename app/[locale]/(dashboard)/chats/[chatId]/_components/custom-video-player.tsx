"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  MouseEvent, // Added MouseEvent for explicit typing
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Loader2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

interface CustomVideoPlayerProps {
  src: string;
  title?: string;
  containerClassName?: string;
  videoClassName?: string;
}

const CustomVideoPlayer = ({
  src,
  title,
  containerClassName,
  videoClassName,
}: CustomVideoPlayerProps) => {
  const t = useTranslations("chat.videoPlayer");
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  const handleVolumeChange = (newVolume: number[]) => {
    if (videoRef.current) {
      const vol = newVolume[0];
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted && volume === 0) {
        videoRef.current.volume = 0.5; // Unmute to a default volume
        setVolume(0.5);
      } else if (newMuted) {
        // setVolume(0); // Keep current volume but reflect mute state
      }
    }
  };

  const handleSeek = (newProgress: number[]) => {
    if (videoRef.current) {
      const seekTime = (newProgress[0] / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setProgress(newProgress[0]);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / duration) * 100);
      if (videoRef.current.currentTime === duration && duration > 0) {
        setIsPlaying(false); // Set to pause icon when video ends
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleVideoStateChange = () => {
    if (videoRef.current) {
      setIsPlaying(!videoRef.current.paused && !videoRef.current.ended);
      setIsMuted(videoRef.current.muted);
      setVolume(videoRef.current.volume);
    }
  };

  const handleSkip = (skipAmount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + skipAmount)
      );
    }
  };

  const toggleFullScreen = useCallback(() => {
    const elem = playerContainerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handleVideoStateChange);
      video.addEventListener("pause", handleVideoStateChange);
      video.addEventListener("ended", handleVideoStateChange);
      video.addEventListener("volumechange", handleVideoStateChange);
      video.addEventListener("waiting", () => setIsLoading(true));
      video.addEventListener("playing", () => setIsLoading(false));
      video.addEventListener("canplay", () => setIsLoading(false));

      // Set initial state from video element (e.g., if autoplay is involved or for muted attribute)
      setIsPlaying(!video.paused);
      setIsMuted(video.muted);
      setVolume(video.volume);
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
      setCurrentTime(video.currentTime);
      if (video.duration && video.currentTime && video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", handleVideoStateChange);
        video.removeEventListener("pause", handleVideoStateChange);
        video.removeEventListener("ended", handleVideoStateChange);
        video.removeEventListener("volumechange", handleVideoStateChange);
        video.removeEventListener("waiting", () => setIsLoading(true));
        video.removeEventListener("playing", () => setIsLoading(false));
        video.removeEventListener("canplay", () => setIsLoading(false));
      };
    }
  }, [duration]); // Added duration to re-run if it changes late

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const showControls = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        // Only hide if playing
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  const handleMouseEnter = () => {
    showControls();
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      // Only hide if playing
      controlsTimeoutRef.current = setTimeout(
        () => setIsControlsVisible(false),
        500
      ); // Shorter delay on leave
    }
  };

  const handleFocus = () => {
    showControls(); // Show controls when player or its children are focused
  };

  // Show controls when video is paused
  useEffect(() => {
    if (!isPlaying) {
      showControls();
    }
    // Clear timeout when component unmounts or isPlaying changes
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div
      ref={playerContainerRef}
      className={cn(
        "relative w-full h-full bg-black group/player overflow-hidden rounded-md",
        isFullScreen ? "fixed inset-0 z-[9999]" : "",
        containerClassName
      )}
      onMouseMove={showControls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus} // Show controls when focused
      tabIndex={0} // Make div focusable
      aria-label={title || t("videoPlayer")}
    >
      <video
        ref={videoRef}
        src={src}
        onClick={handlePlayPause}
        onDoubleClick={toggleFullScreen}
        className={cn("w-full h-full object-contain", videoClassName)}
        aria-label={title || t("videoContent")}
      >
        {t("videoNotSupported")}
      </video>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      <AnimatePresence>
        {isControlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-20"
            onClick={(e: MouseEvent) => e.stopPropagation()} // Prevent video click-to-play when interacting with controls
          >
            {/* Top controls: Title (optional) */}
            {title && (
              <div className="absolute top-2 left-2 right-2 text-white text-center text-sm font-semibold truncate">
                {title}
              </div>
            )}

            {/* Progress Bar */}
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full h-2 mb-2 [&>span:first-child]:h-2 [&>span:first-child_>span]:bg-primary [&>span:first-child_>span]:h-2"
              aria-label={t("progressBar")}
            />

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSkip(-10)}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span className="sr-only">{t("rewind10s")}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {isPlaying ? t("pause") : t("play")}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSkip(10)}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  <RotateCw className="h-5 w-5" />
                  <span className="sr-only">{t("fastForward10s")}</span>
                </Button>
                <div className="text-xs font-mono ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMuteToggle}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {isMuted ? t("unmute") : t("mute")}
                  </span>
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.05}
                  className="w-20 h-2 [&>span:first-child]:h-2 [&>span:first-child_>span]:bg-white [&>span:first-child_>span]:h-2"
                  aria-label={t("volumeControl")}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullScreen}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  {isFullScreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {isFullScreen ? t("exitFullscreen") : t("enterFullscreen")}
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// For AnimatePresence, we need a stable component, so not using memo here directly
// If performance issues arise, consider memoizing parts or the whole with careful dependency management.
export default CustomVideoPlayer;
