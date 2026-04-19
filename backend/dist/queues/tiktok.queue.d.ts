export declare const tiktokQueue: any;
export declare const tiktokWorker: any;
export interface TikTokVideoJob {
    productId: string;
    imageData: {
        defaultImage: string;
        productionImages: string[];
    };
    settings: {
        style: string;
        duration: number;
        language: 'th';
    };
}
export declare function createTikTokVideoJob(jobData: TikTokVideoJob): Promise<any>;
//# sourceMappingURL=tiktok.queue.d.ts.map