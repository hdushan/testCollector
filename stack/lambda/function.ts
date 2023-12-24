import { aws_lambda as lambda, Duration, Stack, Fn } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { getNRLambdaLayer } from '../../stack/lambda/layer'

export default class BasicFunction extends lambda.Function {
  constructor(scope: Construct, identifier: string) {
    super(scope, identifier, {
      code: lambda.Code.fromAsset('src/lambda'),
      handler: 'newrelic-lambda-wrapper.handler',
      functionName: 'SqsMessageHandler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      layers: [ getNRLambdaLayer(scope) ],
      environment: {
        NEW_RELIC_APP_NAME: 'slo-collector',
        NEW_RELIC_ACCOUNT_ID: '4294528',
        NEW_RELIC_LICENSE_KEY: '0a1454e9c1a9dbd5c93b5b958dda94e35f66NRAL',
        NEW_RELIC_LAMBDA_HANDLER: 'slo-event-processor.default'
      },
      timeout: Duration.seconds(30),
      tracing: lambda.Tracing.ACTIVE
    })
  }
}