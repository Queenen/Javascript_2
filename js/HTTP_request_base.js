async function request(url, method, body = null, token = null) {
  const headers = {};

  // Add Authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If there's a body, stringify it and set the appropriate header
  if (body) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    // Handle potential non-ok responses
    if (!response.ok) {
      let errorText = "Request failed with status " + response.status;

      // Try to extract more detailed error information from the response body
      try {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          const errorMessages = errorData.errors.map((error) => error.message);
          errorText += ": " + errorMessages.join(", ");
        }
      } catch (parseError) {
        console.error("Error parsing response body:", parseError);
      }

      console.error(errorText);
      throw new Error(errorText);
    }

    // Return parsed response data
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
}

// Example usage:
// const data = await request('https://api.example.com/data', 'GET', null, 'yourToken');

export { request };
