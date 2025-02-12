import { uploadMediaFile, sendToApi } from "./api.js";
import { renderPDF } from "./pdfViewer.js";
import { API_PROMPT } from "./prompt.js";

// DOM Elements
const fileInput = document.getElementById("fileInput");
const sendButton = document.getElementById("sendToGemini");
const apiKeyInput = document.getElementById("apiKey");
const latexOutput = document.getElementById("latexOutput");
const downloadButton = document.getElementById("downloadPdf");

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

        // Render the PDF preview using the LaTeX code.
        const pdfBlob = await renderPDF(latexText);

        // Enable the Download button and attach the download functionality.
        downloadButton.disabled = false;
        downloadButton.replaceWith(downloadButton.cloneNode(true));
        const newDownloadButton = document.getElementById("downloadPdf");
        newDownloadButton.addEventListener("click", () => {
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "converted_output.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error("Error during processing:", error);
        alert("An error occurred. Please try again.");
    }
});
