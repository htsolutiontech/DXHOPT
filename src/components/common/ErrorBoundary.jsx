import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if this is a ResizeObserver error
    const isResizeObserverError = error && error.message && 
      (error.message.includes('ResizeObserver loop completed with undelivered notifications') ||
       error.message.includes('ResizeObserver loop limit exceeded'));
    
    if (isResizeObserverError) {
      // Don't update state for ResizeObserver errors - just suppress them
      return null;
    }
    
    // Update state for other errors
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Check if this is a ResizeObserver error
    const isResizeObserverError = error && error.message && 
      (error.message.includes('ResizeObserver loop completed with undelivered notifications') ||
       error.message.includes('ResizeObserver loop limit exceeded'));
    
    if (isResizeObserverError) {
      // Suppress ResizeObserver errors - don't log or report them
      return;
    }
    
    // Log other errors
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for non-ResizeObserver errors
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#d32f2f',
          backgroundColor: '#ffeaea',
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          margin: '10px'
        }}>
          <h3>Something went wrong</h3>
          <p>An error occurred while rendering this component.</p>
          <details style={{ textAlign: 'left', marginTop: '10px' }}>
            <summary>Error Details</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
