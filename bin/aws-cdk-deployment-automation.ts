#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { MyCdkStack } from '../lib/stacks/my-cdk-stack';
import { sourcePackage } from '../lib/constants';
import { STAGE_INFO } from '../lib/envconfig';

const app = new App();

STAGE_INFO.forEach((stageProps) => {
  new MyCdkStack(app, stageProps.stackName, {
      stage: stageProps.stage,
      owner: stageProps.owner,
      runtime: stageProps.runtime,
      code: sourcePackage,
      handler: stageProps.handler,
      environmentVariables: stageProps.environmentVariables,
      tags: stageProps.tags,
      cors: stageProps.cors
  });
});