async function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);

  const code = params.get("code");
  const error = params.get("error");
  const errorDescription = params.get("error_description");

  const statusElement = document.getElementById("status");

  if (error) {
    statusElement.textContent = `Error: ${errorDescription || error}`;
    return;
  }

  if (!code) {
    statusElement.textContent = "No authorization code found in the callback.";
    return;
  }

  try {
    statusElement.textContent =
      "Authorization code received. Exchanging token...";

    const tokenData = await exchangeOAuthCode(code);

    console.log("Token response:", tokenData);

    statusElement.textContent = "Access token received successfully!";
  } catch (err) {
    console.error("Token exchange failed:", err);

    statusElement.textContent = "Token exchange failed.";
  }
}

window.onload = handleOAuthCallback;
