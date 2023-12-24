import targets = require('aws-cdk-lib/aws-events-targets');
import lambdaEventSources = require('aws-cdk-lib/aws-lambda-event-sources');
import cdk = require('aws-cdk-lib');
import { aws_lambda as lambda} from 'aws-cdk-lib'

import SloEventCollectorBus from '../stack/eventbridge/bus/slo-event-collector-bus'
import SloEventCollectorQueue from '../stack/queue/slo-event-collector-queue'
import SloEventCollectorDLQ from '../stack/queue/slo-event-collector-dlq'
import SloEventCollectorRule from '../stack/eventbridge/rule/slo-event-collector-rule'
import BasicFunction from '../stack/lambda/function'
import { getNRLambdaLayer } from '../stack/lambda/layer'

export class CollectorStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const sloEventCollectorBus = new SloEventCollectorBus(this)
    const sloEventCollectorDLQ = new SloEventCollectorDLQ(this)
    const sloEventCollectorQueue = new SloEventCollectorQueue(this, sloEventCollectorDLQ)

    new SloEventCollectorRule(this, {
      eventBus: sloEventCollectorBus,
      targets: [ new targets.SqsQueue(sloEventCollectorQueue) ]
    })

    const lambdaFunction = new BasicFunction(this, 'Function')

    // const sloEventBus = new events.EventBus(this, 'SLOEventBus', {
    //   eventBusName: 'SLOEventBus'
    // })

    // const deadLetterQueue = new sqs.Queue(this, 'CollectorDLQ', {
    //   queueName: 'CollectorDLQ',
    // });

    // const collectorSqsQueue = new sqs.Queue(this, 'CollectorSqsQueue', {
    //   queueName: 'CollectorSqsQueue',
    //   deadLetterQueue: {
    //     queue: deadLetterQueue,
    //     maxReceiveCount: 2,
    //   },
    // });

    // const rule = new events.Rule(this, 'SLORule', { 
    //   ruleName: 'SLORule',
    //   description: 'Rule matching SLO events',
    //   eventBus: sloEventCollectorBus ,
    //   eventPattern: {      
    //     source: ['SLO Generator'],
    //     "detail": {
    //       "slo_name": [ {"exists": true} ],
    //       "slo_id": [ {"exists": true} ],
    //       "event_name": [ {"exists": true} ],
    //       "event_type": [ {"exists": true} ],
    //       "event_state": [ {"exists": true} ],
    //       "env": [ {"exists": true} ]
    //     }
    //   }
    // });
    // rule.addTarget(new targets.SqsQueue(sloEventCollectorQueue));

    // const newRelicLambdaLayer = lambda.LayerVersion.fromLayerVersionArn(
    //   this, 
    //   'NewRelicLambdaLayer', 
    //   'arn:aws:lambda:ap-southeast-2:451483290750:layer:NewRelicNodeJS20XARM64:3'
    // )

    // const lambdaFunction = new lambda.Function(this, 'Function', {
    //   code: lambda.Code.fromAsset('lib/lambda'),
    //   handler: 'newrelic-lambda-wrapper.handler',
    //   functionName: 'SqsMessageHandler',
    //   runtime: lambda.Runtime.NODEJS_20_X,
    //   architecture: lambda.Architecture.ARM_64,
    //   layers: [ getNRLambdaLayer(this) ],
    //   environment: {
    //     NEW_RELIC_APP_NAME: 'slo-collector',
    //     NEW_RELIC_ACCOUNT_ID: '4294528',
    //     NEW_RELIC_LICENSE_KEY: '0a1454e9c1a9dbd5c93b5b958dda94e35f66NRAL',
    //     NEW_RELIC_LAMBDA_HANDLER: 'slo-event-handler.handler'
    //   },
    //   timeout: cdk.Duration.seconds(30),
    //   tracing: lambda.Tracing.ACTIVE
    // });

    const eventSource = new lambdaEventSources.SqsEventSource(sloEventCollectorQueue);

    lambdaFunction.addEventSource(eventSource);
  }
}