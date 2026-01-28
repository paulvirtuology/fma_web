import { supabase } from '../lib/supabase';

export const mediaService = {
    /**
     * Optimizes an image before upload (Resizing and compression)
     */
    async optimizeImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error('Canvas toBlob failed'));
                        },
                        'image/jpeg',
                        quality
                    );
                };
            };
            reader.onerror = (error) => reject(error);
        });
    },

    /**
     * Lists all files in the images bucket
     */
    async listFiles() {
        const { data, error } = await supabase.storage
            .from('images')
            .list('news', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) throw error;

        // Get public URLs for each file
        const filesWithUrls = data.map(file => {
            const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(`news/${file.name}`);

            return {
                ...file,
                url: urlData.publicUrl
            };
        });

        return filesWithUrls;
    },

    /**
     * Deletes a file from storage
     */
    async deleteFile(name: string) {
        const { error } = await supabase.storage
            .from('images')
            .remove([`news/${name}`]);

        if (error) throw error;
    },

    /**
     * Uploads an optimized image
     */
    async uploadOptimized(file: File) {
        const optimizedBlob = await this.optimizeImage(file);
        const fileExt = 'jpg'; // We compress to jpeg
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, optimizedBlob, {
                contentType: 'image/jpeg'
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};
