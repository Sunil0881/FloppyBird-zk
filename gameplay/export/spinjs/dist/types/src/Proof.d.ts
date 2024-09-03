export interface ProveCredentials {
    USER_ADDRESS: string;
    USER_PRIVATE_KEY: string;
    IMAGE_HASH: string;
    CLOUD_RPC_URL: string;
}
export declare function signMessage(message: string, cloudCredential: ProveCredentials): Promise<string>;
export declare function add_proving_taks(inputs: string[], witness: string[], cloudCredential: ProveCredentials): Promise<any>;
export declare function getImageCommitmentBigInts(cloudCredential: ProveCredentials): Promise<BigInt[]>;
export declare function load_proving_taks_util_result(task_id: string, cloudCredential: ProveCredentials, retry_interval?: number): Promise<{
    proof: BigInt[];
    verify_instance: BigInt[];
    aux: BigInt[];
    instances: BigInt[];
    status: import("zkwasm-service-helper").TaskStatus;
} | null>;
export declare function load_proving_taks(task_id: string, cloudCredential: ProveCredentials): Promise<{
    proof: BigInt[];
    verify_instance: BigInt[];
    aux: BigInt[];
    instances: BigInt[];
    status: import("zkwasm-service-helper").TaskStatus;
} | null>;
