import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as TestCollector from '../lib/test_collector-stack';

test('One Event Bus created', () => {
    const app = new cdk.App();
    const stack = new TestCollector.CollectorStack(app, 'MyTestStack');
  
    const template = Template.fromStack(stack);
  
    template.resourceCountIs('AWS::Events::EventBus', 1);
});

test('Two SQS Queues Created', () => {
  const app = new cdk.App();
  const stack = new TestCollector.CollectorStack(app, 'MyTestStack');

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::SQS::Queue', 2);
});

test('One Lambda function created', () => {
    const app = new cdk.App();
    const stack = new TestCollector.CollectorStack(app, 'MyTestStack');
  
    const template = Template.fromStack(stack);
  
    template.resourceCountIs('AWS::Lambda::Function', 1);
});