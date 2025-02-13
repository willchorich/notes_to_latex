export function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the data prefix and return only the Base64 content
            const base64Content = reader.result.split(",")[1];
            resolve(base64Content);
        };
        reader.onerror = (error) => reject(error);
    });
}
