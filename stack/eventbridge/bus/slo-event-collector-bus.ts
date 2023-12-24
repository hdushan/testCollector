import { aws_events as events, Stack, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export default class SloEventCollectorBus extends events.EventBus {
  constructor(scope: Construct) {
    super(scope, 'SloEventCollectorBus', {
      eventBusName: `${Stack.of(scope).stackName}-SloEventCollectorBus`,
    })

    const stack = Stack.of(this)

    new CfnOutput(this, 'SloEventCollectorBusArn', {
      exportName: `${stack.stackName}-SloEventCollectorBusArn`,
      value: this.eventBusArn,
    })
  }
}