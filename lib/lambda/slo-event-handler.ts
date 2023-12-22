import { validateSLOEvent} from './slo-event-validator'

exports.handler = async (event: { Records: any[]; }) => {
    event.Records.forEach((record: any) => {
      const sloEventDetails = JSON.parse(record.body)
      console.log('Event: %j', sloEventDetails)
      const errors = validateSLOEvent(sloEventDetails.detail)
      if (errors.length > 0) {
        const errorMessage = errors.join('\n')
        console.log('Errors: %j', errorMessage)
        throw new Error(`SLO event failed validation:\n${errorMessage}`);
      } 
    })
  }