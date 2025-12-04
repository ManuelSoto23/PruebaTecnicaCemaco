import { useState, useCallback } from "react";

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error, userMessage = null) => {
    console.error("Error:", error);

    let message = userMessage;

    if (!message) {
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      } else {
        message = "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
      }
    }

    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null,
  };
};
