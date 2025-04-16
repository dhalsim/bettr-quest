import * as t from 'io-ts'
import { pipe } from 'fp-ts/function'
import { fold } from 'fp-ts/Either'
import { PathReporter } from 'io-ts/PathReporter'

export const VerifyProofState = t.type({
  type: t.union([t.literal('proof-accept'), t.literal('proof-reject')]),
  questTitle: t.string,
  questDescription: t.string,
  questId: t.string,
  questRewardAmount: t.number,
  questLockedAmount: t.number,
  proofTitle: t.string,
  proofDescription: t.string,
  proofId: t.string,
})

export type VerifyProofState = t.TypeOf<typeof VerifyProofState>

export const decodeVerifyProofState = (data: unknown): VerifyProofState => {
  const result = VerifyProofState.decode(data)
  
  return pipe(
    result,
    fold(
      (errors) => {
        const errorMessages = PathReporter.report(result)
        throw new Error(`Invalid location state: ${errorMessages.join('\n')}`)
      },
      (validState) => validState
    )
  )
} 