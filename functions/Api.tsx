const path = 'https://ocpexu1uki.execute-api.us-east-2.amazonaws.com/Prod/api/nature-scanner/';

export const GetPresignedURL = async () => {
    let url = path + 'upload';
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = `HTTP error: ${response.status} - ${response.statusText}`;
            console.error(errorText);
            throw new Error(errorText);
        }

        const json = await response.json();
        console.log(json);
        return { success: true, data: json};
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export const UploadToS3 = async (image: any, presignedURL: URL) => {
    try {
        const resp = await fetch(image);
        const imageBody = await resp.blob();
        const response = await fetch(presignedURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'image/*',
            },
            body: imageBody,
        });
        if (!response.ok) {
            const errorText = `HTTP error: ${response.status} - ${response.statusText}`;
            console.error(errorText);
            throw new Error(errorText);
        }
        console.log("Upload successful");
        return { success: true }
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export const ProcessApi = async (key: string) => {
    let url = path + 'process';
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                'img_id': key,
            }),
        });

        if (!response.ok) {
            const errorText = `HTTP error: ${response.status} - ${response.statusText}`;
            console.error(errorText);
        }

        const json = await response.json();
        console.log("Identification process complete");
        return { success: true, data: json};
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}