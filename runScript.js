async function triggerScript() {
  // Use dynamic import for node-fetch (ESM module)
  const fetch = (await import("node-fetch")).default;

  const url = "https://script.google.com/macros/s/AKfycbwmOHRtABQKFU-k8BfBvuySfW4xXreKc5oy67HM4MmeQqnTccNDAGfbrnZ05kmuRDyB/exec";
  const secret = "RoopeshSuperSecret_9843";

  // Create abort controller with 1 minute timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 60000); // 60 seconds = 1 minute

  try {
    console.log("Sending request...");
    const response = await fetch(`${url}?secret=${secret}`, {
      signal: controller.signal
    });
    const text = await response.text();
    console.log("Response:", text);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request timed out after 1 minute");
    } else {
      console.error("Error:", error.message);
    }
  } finally {
    clearTimeout(timeout);
  }
}

triggerScript();
