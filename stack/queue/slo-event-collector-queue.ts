import { aws_sqs as sqs, Duration, Stack, CfnOutput } from 'aws-cdk-lib'
import { IQueue } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'

export default class SloEventCollectorQueue extends sqs.Queue {
  constructor(scope: Construct, dlq: IQueue) {
    super(scope, 'SloEventCollectorQueue', {
      queueName: `${Stack.of(scope).stackName}-SloEventCollectorQueue`,
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 2,
      },
    })

    const stack = Stack.of(this)

    new CfnOutput(this, 'SloEventCollectorQueueUrl', {
      exportName: `${stack.stackName}-SloEventCollectorQueueUrl`,
      value: this.queueUrl,
    })

    new CfnOutput(this, 'SloEventCollectorQueueUrlArn', {
      exportName: `${stack.stackName}-SloEventCollectorQueueUrlArn`,
      value: this.queueArn,
    })
  }
}
