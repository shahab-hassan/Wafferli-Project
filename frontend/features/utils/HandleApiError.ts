import toast from "react-hot-toast";

// Function to handle API errors safely
export const HandleApiError = (error: any): string => {
  let errorMessage = "An unexpected error occurred.";

  const safeMessage = (msg: any) => {
    if (typeof msg === "string") return msg;
    try {
      return JSON.stringify(msg);
    } catch {
      return "Unknown error";
    }
  };

  if (error.response) {
    const statusCode = error.response.status;
    const data = error.response.data;
    const message =
      safeMessage(data?.message) || "An error occurred on the server side.";
    const url = error.config?.url || "Unknown URL";

    switch (statusCode) {
      case 400:
        // ✅ Check if backend sent validation errors array
        if (data?.error && Array.isArray(data.error) && data.error.length > 0) {
          errorMessage = data.error.join(", ");
        } else {
          errorMessage =
            message || "Bad Request: Check the request parameters.";
        }
        break;
      case 401:
        errorMessage =
          message || "Unauthorized: You need to log in to continue.";
        break;
      case 403:
        errorMessage =
          message ||
          "Forbidden: You don't have permission to access this resource.";
        break;
      case 404:
        errorMessage =
          message || "Not Found: The requested resource could not be found.";
        break;
      case 500:
        errorMessage =
          message ||
          "Internal Server Error: Something went wrong on the server.";
        break;
      default:
        errorMessage =
          message || `Error: Something went wrong. Status Code: ${statusCode}`;
    }

    toast.error(errorMessage);
    console.error(`Error ${statusCode} from URL: ${url}`, data);
  } else if (error.request) {
    errorMessage =
      "No response received from the server. Please check your internet connection or try again later.";
    toast.error(errorMessage);
    console.error("Error: No response received from the server", error.request);
  } else {
    errorMessage = `An error occurred while processing your request: ${safeMessage(
      error.message
    )}`;
    toast.error(errorMessage);
    console.error("Error: General error in the request setup", error.message);
  }

  return errorMessage;
};
