import React, { useRef, useEffect } from 'react';

const ChartWrapper = ({ children, style = {} }) => {
  const containerRef = useRef();

  useEffect(() => {
    // Enhanced ResizeObserver error suppression for chart containers
    const suppressChartErrors = () => {
      // Store original ResizeObserver
      const originalResizeObserver = window.ResizeObserver;
      
      if (originalResizeObserver) {
        // Create enhanced ResizeObserver class
        window.ResizeObserver = class extends originalResizeObserver {
          constructor(callback) {
            const enhancedCallback = (entries, observer) => {
              // Use multiple async methods to prevent loops
              Promise.resolve().then(() => {
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    try {
                      callback(entries, observer);
                    } catch (error) {
                      // Completely suppress ResizeObserver errors
                      if (!error.message?.includes('ResizeObserver')) {
                        console.warn('Chart callback error:', error);
                      }
                    }
                  }, 0);
                });
              }).catch(() => {
                // Silent catch for any promise errors
              });
            };
            
            super(enhancedCallback);
          }
        };
        
        // Return cleanup function
        return () => {
          if (window.ResizeObserver !== originalResizeObserver) {
            window.ResizeObserver = originalResizeObserver;
          }
        };
      }
      return () => {};
    };

    const cleanup = suppressChartErrors();
    
    // Additional error boundary for the container
    if (containerRef.current) {
      const container = containerRef.current;
      
      // Prevent any resize observer errors from bubbling up
      const handleError = (event) => {
        if (event.error?.message?.includes('ResizeObserver')) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      };
      
      container.addEventListener('error', handleError, true);
      
      return () => {
        cleanup();
        container.removeEventListener('error', handleError, true);
      };
    }
    
    return cleanup;
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default ChartWrapper;
