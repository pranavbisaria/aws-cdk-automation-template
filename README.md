# CDK Script Automation

## Objective
This is a template module that contains code to deploy any function to AWS Lambda and associate an API Gateway trigger to execute the function.

## Prerequisites
1. Aws CLI
2. NodeJs [ `> 18` ]
3. Latest Cdk [`npm install -g aws-cdk`]

## Steps to Setup:
1. Go to the root directory `aws-cdk-automation-template`.

2. Initialize the CDK setup using:
`npm install`.

3. Add your code to the `src` folde (the code can be in JavaScript, Python, Java, etc.). 
Example: Create a folder named "pythn-test" under `src` and set the handler path inside the `src` folder as "pythn-test/main.handler_name".

4. Go to the `lib` folder, open the `envconfig.ts` file, and update the following properties:
- `IAM_ACTIONS`: Define the additional role permissions required for the Lambda execution.
- `STAGE_INFO`:
  - `stackName`: Name for your stack.
  - `region`: Default is 'us-west-2'.
  - `handler`: Path to the handler (default is `pythn-test/main.lambda_handler`).
  - `runtime`: Define the runtime for your script, changing it according to the language your script is based on:
    - `Runtime.PYTHON_3_9`
    - `Runtime.NODEJS_20_X`
    - `Runtime.NODEJS_16_X`
    - `Runtime.PYTHON_3_8`
    - `Runtime.JAVA_17`, etc.
  - `environmentVariables`: includes the environment variables as required by your code.
  - `tags`: includes the tags associated with the resources created in aws.
  - `cors`: includes cors configuration to allow API access. ( Default: Allows all the sources. )

5. Login to the aws using sso: `aws configure sso` or using simple Access and Secret key.

6. Once everything is set up, execute the following commands in sequence to deploy your code:
    * `cdk synth --profile <AWS_ACCOUNT_PROFILE>`
    * `cdk bootstrap --profile  <AWS_ACCOUNT_PROFILE>`
    * `cdk deploy --profile  <AWS_ACCOUNT_PROFILE>`

7. Go to the AWS Lambda console and search for the stack to find your deployed code.

## Customizability

1. **API Endpoint**: You can change the endpoint for the API associated with your Lambda by going to the `lib/stacks/my-cdk-stack.ts` file and updating the path defined by the `cdkAPIResource` variable. You can also update the API version using `lib/constants.ts`.

2. **API HTTP METHOD TYPE**: You can change the http method type (Default is `GET`) for the API associated with your Lambda by going to the `lib/stacks/my-cdk-stack.ts` file and updating the method type defined by the `cdkAPIResource` variable.

3. **Trigger**: You can change the trigger for the Lambda by modifying the `lib/stacks/my-cdk-stack.ts` file.

4. **Additional Customizability**: More customizations can be performed by adding custom constructs to the stack defined in `lib/stacks/my-cdk-stack.ts`.

5. **New Stack**: An entirely new stack can be defined by adding a stack template to the `lib/stacks` directory and adding it to `bin/aws-cdk-deployment-automation.ts`. You can also define multiple stacks and deploy them simultaneously.

## TODO
1. Layers support.
2. Add authorization for the API trigger using IAM or Cognito.
