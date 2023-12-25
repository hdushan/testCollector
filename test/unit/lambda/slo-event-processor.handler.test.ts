import handler from '../../../src/lambda/slo-event-processor'
import valid_slo_event from './fixtures/aws_slo_valid_event.json'
import invalid_slo_event_empty_mandatory_fields from './fixtures/aws_slo_invalid_empty_fields.json'
import invalid_slo_event_bad_env from './fixtures/aws_slo_invalid_environment.json'
import invalid_slo_event_bad_state from './fixtures/aws_slo_invalid_event_state.json'
import nr from 'newrelic'

describe('SLOEventProcessot', () => {
    beforeEach(() => {
        process.env.NEW_RELIC_APP_NAME = 'TEST'
        nr.recordCustomEvent = jest.fn()
    })

    describe('valid slo event', () => {
        it('should send the event to New Relic', async () => {
            const recordsFromSQS = {
                Records: [valid_slo_event]
            }
            await handler(recordsFromSQS)
            expect(nr.recordCustomEvent).toHaveBeenCalledWith(
                'Analytics', 
                JSON.parse(valid_slo_event.body).detail
            )
        })
    })

    describe('invalid slo event', () => {
        describe('empty mandatory fields', () => {
            it('should raise an Error', () => {
                const recordsFromSQS = {
                    Records: [invalid_slo_event_empty_mandatory_fields]
                }
                expect(async () => {
                    await handler(recordsFromSQS)
                }).rejects.toThrow('SLO event failed validation:\nslo_name is empty')
                expect(nr.recordCustomEvent).not.toHaveBeenCalled()
            })
        })

        describe('invalid slo event type', () => {
            it('should raise an Error', () => {
                const recordsFromSQS = {
                    Records: [invalid_slo_event_bad_state]
                }
                expect(async () => {
                    await handler(recordsFromSQS)
                }).rejects.toThrow('SLO event failed validation:\nevent_state has illegal value Junk. Allowed values are begin, success or failure')
                expect(nr.recordCustomEvent).not.toHaveBeenCalled()
            })
        })

        describe('invalid environment', () => {
            it('should raise an Error', () => {
                const recordsFromSQS = {
                    Records: [invalid_slo_event_bad_env]
                }
                expect(async () => {
                    await handler(recordsFromSQS)
                }).rejects.toThrow('SLO event failed validation:\nenv has illegal value Junk. Allowed values are dev, qa, preprod or production')
                expect(nr.recordCustomEvent).not.toHaveBeenCalled()
            })
        })
    })
})