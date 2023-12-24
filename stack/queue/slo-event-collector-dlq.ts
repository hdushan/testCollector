import { aws_sqs as sqs, Duration, Stack, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export default class SloEventCollectorDLQ extends sqs.Queue {
  constructor(scope: Construct) {
    super(scope, 'SloEventCollectorDLQ', {
      queueName: `${Stack.of(scope).stackName}-SloEventCollectorDLQ`,
      visibilityTimeout: Duration.seconds(18),
    })

    const stack = Stack.of(this)

    new CfnOutput(this, 'SloEventCollectorDLQUrl', {
      exportName: `${stack.stackName}-SloEventCollectorUrl`,
      value: this.queueUrl,
    })

    new CfnOutput(this, 'SloEventCollectorDLQArn', {
      exportName: `${stack.stackName}-SloEventCollectorDLQArn`,
      value: this.queueArn,
    })
  }
}
