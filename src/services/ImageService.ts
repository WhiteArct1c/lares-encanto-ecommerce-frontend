export class ImageService {
    /**
     * Converts a file to a base64 string.
     * @param file - The file to convert.
     * @returns A promise that resolves to the base64 string of the file.
     */
    async convertToBase64(file: File): Promise<string | ArrayBuffer | null> {
        try {
            return await this.getBase64(file);
        } catch (error) {
            console.error('Error converting file to base64:', error);
            throw error;
        }
    }

    /**
     * Converts a base64 string to a file.
     * @param base64 - The base64 string to convert.
     * @param filename - The name of the file.
     * @returns A promise that resolves to the file.
     */
    async getImageFileFromBase64(base64: string, filename: string): Promise<File> {
        try{
            const response = await fetch(base64);
            const blob = await response.blob();
            return new File([blob], filename, {type: blob.type});
        }catch (error){
            console.error('Error converting base64 to file:', error);
            throw error;
        }
    }

    /**
     * Helper function to convert a file to a base64 string.
     * @param file - The file to convert.
     * @returns A promise that resolves to the base64 string of the file.
     */
    private getBase64(file: File): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
}