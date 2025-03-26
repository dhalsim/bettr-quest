import * as t from 'io-ts'
import { pipe } from 'fp-ts/function'
import { fold } from 'fp-ts/Either'
import { PathReporter } from 'io-ts/PathReporter'

// Define the codecs for each type
const QuestLocationStateCodec = t.type({
  type: t.literal('quest'),
  questTitle: t.string,
  questDescription: t.string,
  questId: t.string,
  questRewardAmount: t.number,
  questLockedAmount: t.number
})

const ProofLocationStateCodec = t.type({
  type: t.union([t.literal('proof-verify'), t.literal('proof-contest')]),
  proofTitle: t.string,
  proofDescription: t.string,
  questTitle: t.string,
  questDescription: t.string,
  questRewardAmount: t.number,
  questLockedAmount: t.number,
  proofId: t.string,
  questId: t.string
})

// Define the union type codec
export const LocationStateCodec = t.union([QuestLocationStateCodec, ProofLocationStateCodec])

export type QuestLocationState = t.TypeOf<typeof QuestLocationStateCodec>
export type ProofLocationState = t.TypeOf<typeof ProofLocationStateCodec>

// Type inference
export type LocationState = t.TypeOf<typeof LocationStateCodec>

// Helper function to decode and handle errors
export function decodeLocationState(input: unknown): LocationState {
  const result = LocationStateCodec.decode(input)
  
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

// Type guard function
export function isLocationState(input: unknown): input is LocationState {
  return LocationStateCodec.is(input)
} 