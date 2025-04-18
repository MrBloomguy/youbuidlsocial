declare module '@orbisclub/orbis-sdk' {
    export class Orbis {
        constructor(options: {
            useLit?: boolean;
            node?: string;
            PINATA_GATEWAY?: string;
            CERAMIC_NODE?: string;
        });

        connect_v2(options: {
            provider: import('ethers').providers.ExternalProvider;
            chain?: string;
            lit?: boolean;
        }): Promise<{ status: number }>;

        isConnected(): Promise<{ status: boolean }>;

        createPost(options: {
            body: string;
            context?: string;
            tags?: string[];
            master?: string;
        }): Promise<{ status: number; doc: string; result: { streamId: string; timestamp: number } }>;

        getPosts(options: {
            context?: string;
        }): Promise<{ data: { id: string; content: string }[]; error: { message: string; code: number } | null }>;

        getPost(streamId: string): Promise<{
            data: {
                id: string;
                content: string;
                creator: string;
                creator_details?: {
                    did: string;
                    profile?: {
                        username: string;
                        pfp: string;
                    };
                };
                context?: string;
                timestamp: number;
                count_likes: number;
                count_replies: number;
                count_haha: number;
                count_downvotes: number;
                tags?: string[];
            };
            error: {
                message: string;
                code: number;
            } | null;
        }>;

        react(postId: string, type: string): Promise<{ status: number; message: string }>;
    }
}


