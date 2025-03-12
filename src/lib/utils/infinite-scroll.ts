import { useEffect, useRef, useState, useCallback } from "react";

interface UseInfiniteScrollOptions {
  // Threshold for triggering loading (percentage from 0 to 1)
  threshold?: number;
  // Initial number of items to display
  initialBatchSize?: number;
  // Number of items to load in each batch
  batchSize?: number;
  // Direction of infinite scrolling ('top' or 'bottom')
  direction?: "top" | "bottom";
  // Whether to enable loading more items
  enabled?: boolean;
}

interface UseInfiniteScrollResult<T> {
  // Items currently displayed (subset of allItems)
  visibleItems: T[];
  // Whether more items are being loaded
  isLoading: boolean;
  // Function to load more items
  loadMore: () => void;
  // Function to handle scroll events
  handleScroll: (event: React.UIEvent<HTMLElement>) => void;
  // Ref to attach to the scrollable container
  scrollRef: React.RefObject<HTMLDivElement>;
  // Set to true when all items have been loaded
  hasReachedEnd: boolean;
}

/**
 * Hook for implementing infinite scrolling for large lists
 * 
 * @param allItems - All items in the list
 * @param options - Configuration options
 * @returns Objects and functions for implementing infinite scrolling
 */
export function useInfiniteScroll<T>(
  allItems: T[],
  options?: UseInfiniteScrollOptions
): UseInfiniteScrollResult<T> {
  const {
    threshold = 0.8,
    initialBatchSize = 50,
    batchSize = 30,
    direction = "bottom",
    enabled = true,
  } = options || {};

  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [displayCount, setDisplayCount] = useState(initialBatchSize);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const totalItems = allItems.length;

  // Update visible items when display count or allItems change
  useEffect(() => {
    if (direction === "bottom") {
      // Show the most recent items first (from the end of the array)
      setVisibleItems(allItems.slice(-displayCount));
    } else {
      // Show the oldest items first (from the beginning of the array)
      setVisibleItems(allItems.slice(0, displayCount));
    }
    
    // Check if we've reached the end of the list
    setHasReachedEnd(displayCount >= totalItems);
  }, [allItems, displayCount, direction, totalItems]);

  // Preserve scroll position when adding items at the top
  useEffect(() => {
    if (direction === "top" && scrollRef.current) {
      scrollRef.current.scrollTop = 
        scrollRef.current.scrollHeight - scrollPositionRef.current;
    }
  }, [visibleItems, direction]);

  // Function to load more items
  const loadMore = useCallback(() => {
    if (!enabled || isLoading || hasReachedEnd) return;

    setIsLoading(true);
    
    // Save current scroll height for position restoration
    if (direction === "top" && scrollRef.current) {
      scrollPositionRef.current = scrollRef.current.scrollHeight;
    }
    
    // Simulate network delay for smoother UX
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + batchSize, totalItems));
      setIsLoading(false);
    }, 300);
  }, [enabled, isLoading, hasReachedEnd, batchSize, totalItems, direction]);

  // Handle scroll events to trigger loading more items
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      if (!enabled || isLoading || hasReachedEnd) return;

      const element = event.currentTarget;
      
      if (direction === "bottom") {
        // Check if we're close to the bottom
        const scrollPosition = element.scrollTop;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;
        
        const distanceFromBottom = scrollHeight - scrollPosition - clientHeight;
        const thresholdPixels = scrollHeight * (1 - threshold);
        
        if (distanceFromBottom < thresholdPixels) {
          loadMore();
        }
      } else {
        // Check if we're close to the top
        const scrollPosition = element.scrollTop;
        const thresholdPixels = element.scrollHeight * (1 - threshold);
        
        if (scrollPosition < thresholdPixels) {
          loadMore();
        }
      }
    },
    [enabled, isLoading, hasReachedEnd, threshold, direction, loadMore]
  );

  return {
    visibleItems,
    isLoading,
    loadMore,
    handleScroll,
    scrollRef,
    hasReachedEnd,
  };
} 