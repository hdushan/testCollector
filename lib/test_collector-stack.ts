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

    const collectorSqsQueue = new sqs.Queue(this, 'CollectorSqsQueue', {
      queueName: 'CollectorSqsQueue',
    });

    const rule = new events.Rule(this, 'SLORule', { 
      ruleName: 'SLORule',
      description: 'Rule matching SLO events',
      eventBus: sloEventBus ,
      eventPattern: {      
        source: ['SLO Generator'],
        "detail": {
          "slo_name": [ { "prefix": "slo" } ],
          "slo_id": [ { "anything-but": [ "", null ] } ],
          "event_name": [ { "anything-but": [ "", null ] } ],
          "event_state": [ { "anything-but": [ "", null ] } ],
          "event_type": [ { "anything-but": [ "", null ] } ],
          "env": [[ { "exists": true  } ]
        }
      }
    });
    rule.addTarget(new targets.SqsQueue(collectorSqsQueue));

    const lambdaFunction = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'slo-event-handler.handler',
      functionName: 'SqsMessageHandler',
      runtime: lambda.Runtime.NODEJS_20_X,
    });

    const eventSource = new lambdaEventSources.SqsEventSource(collectorSqsQueue);

    lambdaFunction.addEventSource(eventSource);

    // rule.addTarget(new targets.LambdaFunction(lambdaFn));

  }
}

// const app = new cdk.App();
// new CollectorStack(app, 'CollectorStack');
// app.synth();