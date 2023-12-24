import { aws_lambda as lambda } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export const getNRLambdaLayer = (scope: Construct): lambda.ILayerVersion => {
    return lambda.LayerVersion.fromLayerVersionArn(
        scope,
        'NewRelicLambdaLayer',
        'arn:aws:lambda:ap-southeast-2:451483290750:layer:NewRelicNodeJS20XARM64:3'
    )
}