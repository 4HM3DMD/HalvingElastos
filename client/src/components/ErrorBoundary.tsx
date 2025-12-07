import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Elastos Logo */}
            <div className="mb-8">
              <img
                src="/figmaAssets/elastos-1-1680x919--22--copy00-1.png"
                alt="Elastos"
                className="w-24 h-auto mx-auto opacity-50"
              />
            </div>

            {/* Error Message */}
            <div className="glass-panel rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-red-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>

              <h2 
                className="text-xl font-light text-white mb-3"
                style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
              >
                Something went wrong
              </h2>
              
              <p 
                className="text-white/50 text-sm mb-6"
                style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
              >
                The halving countdown encountered an error. Please try refreshing the page.
              </p>

              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-[#94b5ff]/20 hover:bg-[#94b5ff]/30 border border-[#94b5ff]/30 rounded-lg text-[#94b5ff] text-sm font-medium transition-all duration-200"
                style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
              >
                Refresh Page
              </button>

              {/* Error details in dev mode */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 p-4 bg-red-500/10 rounded-lg text-left">
                  <p className="text-red-400 text-xs font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>

            {/* Footer link */}
            <p 
              className="mt-6 text-white/30 text-xs"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              <a 
                href="https://elastos.net" 
                className="hover:text-white/50 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                elastos.net
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

