/**
 * Uploads a media file to the Gemini API.
 * @param {string} apiKey - Your API key.
 * @param {File} file - The file to upload.
 * @returns {Promise<Object>} - Resolves with the file object returned by the API.
 */
export async function uploadMediaFile(apiKey, file) {
    // Use the media upload endpoint for uploading files.
    const uploadUrl = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`;

    const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            // Set the Content-Type to the file's MIME type.
            "Content-Type": file.type,
        },
        body: file,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`File upload failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.file) {
        throw new Error("File upload did not return a file object.");
    }
    return data.file;
}

/**
 * Sends the prompt and file reference to Gemini for processing.
 * @param {string} apiKey - Your API key.
 * @param {Object} fileObject - The file object returned from uploadMediaFile.
 * @param {string} prompt - The text prompt describing the conversion.
 * @returns {Promise<string>} - Resolves with the generated LaTeX code.
 */
export async function sendToApi(apiKey, fileObject, prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Create a single content object that includes both the prompt text and the file data.
    const payload = {
        contents: [
            {
                parts: [
                    { text: prompt },
                    {
                        file_data: {
                            mime_type: fileObject.mimeType,
                            file_uri: fileObject.uri,
                        },
                    },
                ],
            },
        ],
        generationConfig: {
            response_mime_type: "application/json",
            response_schema: {
                type: "OBJECT",
                properties: {
                    latex: { type: "STRING" },
                },
                required: ["latex"],
            },
        },
    };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No candidates returned from the API.");
    }

    // Retrieve the candidate output from the proper field.
    // The correct field is data.candidates[0].content.parts[0].text
    const candidateOutput = data.candidates[0].content.parts[0].text;
    console.log("Raw candidate output:", candidateOutput);

    // Try to parse the candidate output as JSON.
    let parsedOutput;
    try {
        parsedOutput = JSON.parse(candidateOutput);
    } catch (err) {
        // If extra text is present, attempt to extract the JSON substring.
        const firstBrace = candidateOutput.indexOf("{");
        const lastBrace = candidateOutput.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonString = candidateOutput.substring(firstBrace, lastBrace + 1);
            try {
                parsedOutput = JSON.parse(jsonString);
            } catch (err2) {
                throw new Error("Failed to extract and parse JSON from output: " + candidateOutput);
            }
        } else {
            throw new Error("No valid JSON structure found in output: " + candidateOutput);
        }
    }

    if (!parsedOutput.latex) {
        throw new Error("Structured output did not contain 'latex'. Output: " + JSON.stringify(parsedOutput));
    }

    return parsedOutput.latex;
}
