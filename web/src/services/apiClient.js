const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "https://showmyskills.xyphx.com/api";
  return url.replace(/\/$/, "");
};

export async function apiRequest(endpoint, method = "GET", body = null) {
  const baseUrl = getBaseUrl();
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${baseUrl}${formattedEndpoint}`, options);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}
