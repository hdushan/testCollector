#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CollectorStack } from '../lib/test_collector-stack';

const app = new cdk.App();
new CollectorStack(app, 'TestCollectorStack');