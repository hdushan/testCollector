export const validateSLOEvent = (sloEvent: any): string[] => {

    console.log('SLO Event: %j', sloEvent)

    const mandatory_slo_attributes = [ 'slo_id', 'slo_name', 'event_name', 'event_type', 'event_state', 'env' ]
    const validationErrors: string[] = []
    mandatory_slo_attributes.forEach((slo_attribute: string) => {
        validateNotEmpty(sloEvent, slo_attribute, validationErrors)
    })

    const eventState = sloEvent.event_state
    const allowedStates = ['begin', 'success', 'failure']
    if (!allowedStates.includes(eventState.toLowerCase())) {
        validationErrors.push(`event_state has illegal value ${eventState}. Allowed values are begin, success or failure`)
    }

    const env = sloEvent.env
    const allowedenvs = ['dev', 'qa', 'preprod', 'production']
    if (!allowedenvs.includes(env.toLowerCase())) {
        validationErrors.push(`env has illegal value ${env}. Allowed values are dev, qa, preprod or production`)
    }

    return validationErrors
}

const validateNotEmpty = (sloEvent: any, attribute: string, errorAccumulator: string[]): void => {
    const eventType = sloEvent[attribute]
    if (eventType == null || eventType.length == 0) {
        errorAccumulator.push(`${attribute} is empty`)
    }
}