import { aws_events as events } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export type EventProps = {
    eventBus: events.IEventBus
    targets: events.IRuleTarget[]
}

export default class SloCollectorEventRule extends events.Rule {
    constructor(scope: Construct, props: EventProps) {
        super(scope, 'SloCollectorEventRule', {
          description: 'Rule matching SLO events',
          eventBus: props.eventBus,
          ruleName: 'order-orchestrator-events',
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
          },
          targets: props.targets,
        })
    }
}