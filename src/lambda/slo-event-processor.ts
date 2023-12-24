import { validateSLOEvent } from '../lib/slo-event-validator'
import nr from 'newrelic'

exports.handler = async (event: { Records: any[]; }) => {
    event.Records.forEach((record: any) => {
      const sloEventDetails = JSON.parse(record.body).detail
      const errors = validateSLOEvent(sloEventDetails)
      if (errors.length > 0) {
        const errorMessage = errors.join('\n')
        console.log('Errors: %j', errorMessage)
        throw new Error(`SLO event failed validation:\n${errorMessage}`);
      } 

      console.log('NR Account Id : %j', process.env.NEW_RELIC_ACCOUNT_ID)
      console.log('NR License Key: %j', process.env.NEW_RELIC_LICENSE_KEY)
      const nrResponse = nr.recordCustomEvent('Analytics', sloEventDetails)
      console.log('NR response   : %j', nrResponse)
    })
  }