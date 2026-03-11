import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedCarouselProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  title: string;
  autoplayInterval?: number;
  visibleCount?: number;
}

export function FeaturedCarousel<T extends { id?: string }>({
  items,
  renderCard,
  title,
  autoplayInterval = 3000,
  visibleCount = 1,
}: FeaturedCarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = Math.max(0, items.length - visibleCount);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isHovered || items.length <= visibleCount) return;
    intervalRef.current = setInterval(goNext, autoplayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, goNext, autoplayInterval, items.length, visibleCount]);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-lg">{title}</h2>
          <span className="text-xs text-muted-foreground">({items.length})</span>
        </div>
        {items.length > visibleCount && (
          <div className="flex items-center gap-1">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(Math.min(i, maxIndex))}
                className={`w-2 h-2 rounded-full transition-all ${
                  i >= currentIndex && i < currentIndex + visibleCount
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
            <Button variant="ghost" size="icon" className="w-7 h-7 ml-2" onClick={goPrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={goNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`grid gap-4 ${
              visibleCount === 1
                ? "grid-cols-1"
                : visibleCount === 2
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {items.slice(currentIndex, currentIndex + visibleCount).map((item, i) =>
              renderCard(item, i)
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
