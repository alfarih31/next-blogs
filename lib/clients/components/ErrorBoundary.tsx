import { Component, ReactNode } from 'react';
import { HttpError } from '$lib/http-error';
import ErrorPage from './Error';

class ErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  constructor(props: { children: ReactNode } | Readonly<{ children: ReactNode }>) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error?: Error) {
    return { error };
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      if (error instanceof HttpError) {
        return <ErrorPage statusCode={error.status} message={error.message} />;
      }

      return <ErrorPage statusCode={500} message="Internal Server Error" />;
    }

    return children;
  }
}

export default ErrorBoundary
