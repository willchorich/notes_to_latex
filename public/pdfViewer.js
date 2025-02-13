import { jsPDF } from "jspdf";

export async function renderPDF(latexText) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new jsPDF();

            // For simplicity, add the LaTeX text as content.
            // In a real-world scenario, you might process the LaTeX code before rendering.
            doc.text(latexText, 10, 10);

            // Generate a Blob representing the PDF file
            const pdfBlob = doc.output("blob");

            // Render the PDF preview in the #pdfViewer div
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const pdfViewer = document.getElementById("pdfViewer");
            pdfViewer.innerHTML = ""; // Clear previous content

            const iframe = document.createElement("iframe");
            iframe.src = pdfUrl;
            iframe.width = "100%";
            iframe.height = "600px";
            pdfViewer.appendChild(iframe);

            resolve(pdfBlob);
        } catch (error) {
            reject(error);
        }
    });
}
