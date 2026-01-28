import { dataService } from './dataService';

export const backupService = {
    /**
     * Fetches all CMS data and triggers a JSON download
     */
    async downloadCompleteBackup() {
        try {
            const [articles, blocks, pages, settings] = await Promise.all([
                dataService.getArticles(1000), // High limit for backup
                dataService.getContentBlocks(),
                dataService.getPages(),
                dataService.getSiteSettings()
            ]);

            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                site: 'FMA Madagascar',
                data: {
                    news: articles,
                    content_blocks: blocks,
                    pages: pages,
                    site_settings: settings
                }
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `fma-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return true;
        } catch (err) {
            console.error('Backup failed:', err);
            throw err;
        }
    }
};
