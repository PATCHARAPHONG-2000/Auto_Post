export declare const facebookQueue: any;
export declare const facebookWorker: any;
export interface FacebookContentJob {
    productId: string;
    images: string[];
    shopeeLink: string;
    settings: {
        postType: 'profile' | 'page' | 'group';
        targetAudience?: string;
        scheduleTime?: Date;
    };
}
export declare function createFacebookContentJob(jobData: FacebookContentJob): Promise<any>;
//# sourceMappingURL=facebook.queue.d.ts.map