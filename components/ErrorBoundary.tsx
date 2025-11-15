import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Switched to a class property for state initialization. The previous constructor-based
  // approach, while valid, was likely causing type inference issues with `this.props` in the
  // specific build environment, leading to errors both here and where the component was used.
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erreur interceptée par ErrorBoundary:", error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full max-w-sm mx-auto bg-[#FDF3F6] rounded-[50px] border-8 border-b-16 border-[#F7A6B9] shadow-2xl p-4 pt-6 flex flex-col gap-3">
            <div className="bg-[#A76B79] rounded-2xl h-64 md:h-80 w-full shadow-inner overflow-hidden relative flex items-center justify-center p-4 text-center">
                <div className="text-white">
                    <h2 className="text-xl font-bold font-fredoka mb-2">Oups ! Erreur !</h2>
                    <p className="text-sm mb-4">Quelque chose s'est mal passé. Essayez de rafraîchir la page.</p>
                    <button
                        onClick={this.handleRefresh}
                        className="px-4 py-2 bg-[#FDF3F6] text-[#A76B79] font-bold rounded-lg hover:bg-white transition-colors"
                    >
                        Rafraîchir
                    </button>
                    {this.state.error && (
                        <pre className="text-xs text-left bg-black/20 p-2 rounded-md mt-4 max-h-24 overflow-auto">
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
