type ReceivedFile = {
    filename: string;
    document: ArrayBuffer | string;
}

type ApiResponse = {
    message: string;
    success: boolean | null;
    data: any;
}

type User = {
    uid: string;
    name: string;
}

export type { ReceivedFile, ApiResponse, User };