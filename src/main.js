import { uploadMediaFile, sendToApi } from "./api.js";
import { API_PROMPT } from "./prompt.js";

// DOM Elements
const fileInput = document.getElementById("fileInput");
const sendButton = document.getElementById("sendToGemini");
const apiKeyInput = document.getElementById("apiKey");
const latexOutput = document.getElementById("latexOutput");
const compileButton = document.getElementById("compileLatex");

// Variable to store the selected file
let selectedFile = null;

// When the file is chosen, store it for later processing.
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    selectedFile = file;
});

// When the user clicks the "Convert File" button, process the file.
sendButton.addEventListener("click", async () => {
    if (!selectedFile) {
        alert("Please select a file first.");
        return;
    }

    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert("Please enter your API key.");
        return;
    }

    try {
        // Upload the file using the media.upload endpoint.
        const fileObject = await uploadMediaFile(apiKey, selectedFile);

        // Send the text prompt and file reference to the Gemini API.
        const latexText = await sendToApi(apiKey, fileObject, API_PROMPT);

        // Display the LaTeX output in the textarea.
        latexOutput.value = latexText;
    } catch (error) {
        console.error("Error during processing:", error);
        alert("An error occurred. Please try again.");
    }
});

// Helper function to base64-encode a Unicode string.
function toBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// When the user clicks "Compile LaTeX", open the LaTeX code in Overleaf.
compileButton.addEventListener("click", () => {
    const latexText = latexOutput.value;
    if (!latexText.trim()) {
        alert("LaTeX output is empty.");
        return;
    }

    // Convert the LaTeX code to a Base64 string.
    const base64Latex = toBase64(latexText);

    // Create a Data URL for the LaTeX file.
    const dataUrl = "data:application/x-tex;base64," + base64Latex;

    // Construct the Overleaf URL using the snip_uri parameter.
    const overleafUrl = "https://www.overleaf.com/docs?snip_uri=" + encodeURIComponent(dataUrl);

    // Open Overleaf in a new browser tab.
    window.open(overleafUrl, "_blank");
});
