import events = require('aws-cdk-lib/aws-events');
import targets = require('aws-cdk-lib/aws-events-targets');
import lambda = require('aws-cdk-lib/aws-lambda');
import lambdaEventSources = require('aws-cdk-lib/aws-lambda-event-sources');
import sqs = require('aws-cdk-lib/aws-sqs');
import cdk = require('aws-cdk-lib');

export class CollectorStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const sloEventBus = new events.EventBus(this, 'SLOEventBus', {
      eventBusName: 'SLOEventBus'
    })

    const deadLetterQueue = new sqs.Queue(this, 'CollectorDLQ', {
      queueName: 'CollectorDLQ',
    });

    const collectorSqsQueue = new sqs.Queue(this, 'CollectorSqsQueue', {
      queueName: 'CollectorSqsQueue',
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 2,
      },
    });

    const rule = new events.Rule(this, 'SLORule', { 
      ruleName: 'SLORule',
      description: 'Rule matching SLO events',
      eventBus: sloEventBus ,
      eventPattern: {      
        source: ['SLO Generator'],
        "detail": {
          "slo_name": [ {"exists": true} ],
          "slo_id": [ {"exists": true} ],
          "event_name": [ {"exists": true} ],
          "event_type": [ {"exists": true} ],
          "event_state": [ {"exists": true} ],
          "env": [ {"exists": true} ]
        }
      }
    });
    rule.addTarget(new targets.SqsQueue(collectorSqsQueue));

    const newRelicLambdaLayer = lambda.LayerVersion.fromLayerVersionArn(
      this, 
      'NewRelicLambdaLayer', 
      'arn:aws:lambda:ap-southeast-2:451483290750:layer:NewRelicNodeJS20XARM64:3'
    )

    const lambdaFunction = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'newrelic-lambda-wrapper.handler',
      functionName: 'SqsMessageHandler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      layers: [ newRelicLambdaLayer ],
      environment: {
        NEW_RELIC_APP_NAME: 'slo-collector',
        NEW_RELIC_ACCOUNT_ID: '4294528',
        NEW_RELIC_LICENSE_KEY: '0a1454e9c1a9dbd5c93b5b958dda94e35f66NRAL',
        NEW_RELIC_LAMBDA_HANDLER: 'slo-event-handler.handler'
      },
      timeout: cdk.Duration.seconds(30),
      tracing: lambda.Tracing.ACTIVE
    });

    const eventSource = new lambdaEventSources.SqsEventSource(collectorSqsQueue);

    lambdaFunction.addEventSource(eventSource);
  }
}

// const app = new cdk.App();
// new CollectorStack(app, 'CollectorStack');
// app.synth();