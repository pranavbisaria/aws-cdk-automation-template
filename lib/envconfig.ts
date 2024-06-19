import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { CorsConfig } from './stacks/my-cdk-stack';
import { Cors } from 'aws-cdk-lib/aws-apigateway';

export const STAGE_NAME: string = "dev-ops-ci";
export const REGION: string = "us-west-2";
export const IAM_ACTIONS: string[] = [
    "xray:PutTraceSegments"
    // "xray:PutTelemetryRecords"
]

export const STAGE_INFO: StageInfo[] = [
    {
        stage: STAGE_NAME,
        owner: "Pranav",
        stackName: "hellow-world-python",
        region: REGION,
        handler: "pythn-test/main.lambda_handler",
        runtime: Runtime.PYTHON_3_9,
        environmentVariables: {
            // key: "value" // Add environment variables here
        },
        tags: {
            Owner: "Pranav",
            CostCentre: "1000",
            CreatedBy: "DevOpsCI"
        },
        cors: {
            allowOrigins: Cors.ALL_ORIGINS,
            allowHeaders: Cors.DEFAULT_HEADERS,
            allowMethods: Cors.ALL_METHODS
        }
    }
]

export interface StageInfo {
    readonly stage: string;
    readonly owner: string;
    readonly stackName: string;
    readonly region: string;
    readonly handler: string;
    readonly runtime: Runtime;
    readonly environmentVariables: { [key: string]: string },
    readonly tags: { [key: string]: string },
    readonly cors: CorsConfig;
}