import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { apiRoots, methods, version } from '../constants';
import { IAM_ACTIONS } from '../envconfig';
import { Effect, IManagedPolicy, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class MyCdkStack extends Stack {
    constructor(scope: Construct, id: string, props: CdkStackProps) {
        super(scope, id, props);

        const scriptAPI = new RestApi(this, `${props.owner}-${props.stage}`, {
            description: 'Aws Cdk Deployment API'
        });

        const managedPolicies = [
            ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaExecute"),
            ManagedPolicy.fromAwsManagedPolicyName("AWSLambda_FullAccess"),
            ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLambdaInsightsExecutionRolePolicy"),
        ];

        const lambda = this.createLambdaFunction(
            props.stage,
            props.owner,
            props.code,
            props.handler,
            props.environmentVariables,
            {
                roleName: `Role-${props.stage}`,
                managedPolicies: managedPolicies,
                resources: [ '*' ],
                actions: IAM_ACTIONS,
                tags: props.tags
            },
            props.runtime
        );


        const apiResource = scriptAPI.root.addResource(apiRoots.BASE, {
            defaultCorsPreflightOptions: props.cors
        });
        const v1Resource = apiResource.addResource(version.V1, {
            defaultCorsPreflightOptions: props.cors
        });
        const cdkAPIResource = v1Resource.addResource('app', {
            defaultCorsPreflightOptions: props.cors
        });
        cdkAPIResource.addMethod(methods.GET, new LambdaIntegration(lambda));
    }

    private createLambdaFunction(
        name: string,
        owner: string,
        code: string,
        handler: string,
        environmentVariables: { [key: string]: string },
        iamProps: IAMRoleProps,
        runtime: Runtime
    ): Function {
        const lambdaFunction = new Function(
            this,
            `${owner}-${name}`,
            {
                runtime: runtime,
                code: Code.fromAsset(code),
                handler: handler,
                role: this.createIAMRole(iamProps)
            },
        );

        if (iamProps.tags) {
            for (var key in iamProps.tags) {
                Tags.of(lambdaFunction).add(key, iamProps.tags[key]);
            }
        }

        if (environmentVariables) {
            for (var key in environmentVariables) {
                lambdaFunction.addEnvironment(key, environmentVariables[key]);
            }
        }
        return lambdaFunction;
    }

    private createIAMRole (props: IAMRoleProps): Role {
        const iamRole: Role = new Role(
            this,
            props.roleName,
            {
                roleName: props.roleName,
                assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
                managedPolicies: props.managedPolicies,
            },
        );

        iamRole.addToPolicy(
            new PolicyStatement(
                {
                    effect: Effect.ALLOW,
                    actions: props.actions,
                    resources: props.resources,
                },
            ),
        );
        if (props.tags) {
            for (var key in props.tags) {
                Tags.of(iamRole).add(key, props.tags[key]);
            }
        }
        
        return iamRole;
    }
}

export interface CdkStackProps extends StackProps {
    readonly stage: string;
    readonly owner: string;
    readonly runtime: Runtime;
    readonly code: string;
    readonly handler: string;
    readonly environmentVariables: { [key: string]: string };
    readonly tags: { [key: string]: string };
    readonly cors: CorsConfig;
}

export interface CorsConfig {
    readonly allowOrigins: string[];
    readonly allowMethods: string[];
    readonly allowHeaders: string[];
}

export interface IAMRoleProps {
    readonly roleName: string;
    readonly managedPolicies: IManagedPolicy[];
    readonly actions: string[];
    readonly resources: string[];
    readonly tags: { [key: string]: string }
}