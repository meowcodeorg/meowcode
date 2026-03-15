// npx vitest run __tests__/delegation-events.spec.ts

import { MeowCodeEventName, meowCodeEventsSchema, taskEventSchema } from "@meow-code/types"

describe("delegation event schemas", () => {
	test("meowCodeEventsSchema validates tuples", () => {
		expect(() => (meowCodeEventsSchema.shape as any)[MeowCodeEventName.TaskDelegated].parse(["p", "c"])).not.toThrow()
		expect(() =>
			(meowCodeEventsSchema.shape as any)[MeowCodeEventName.TaskDelegationCompleted].parse(["p", "c", "s"]),
		).not.toThrow()
		expect(() =>
			(meowCodeEventsSchema.shape as any)[MeowCodeEventName.TaskDelegationResumed].parse(["p", "c"]),
		).not.toThrow()

		// invalid shapes
		expect(() => (meowCodeEventsSchema.shape as any)[MeowCodeEventName.TaskDelegated].parse(["p"])).toThrow()
		expect(() =>
			(meowCodeEventsSchema.shape as any)[MeowCodeEventName.TaskDelegationCompleted].parse(["p", "c"]),
		).toThrow()
		expect(() => (meowCodeEventsSchema.shape as any)[MeowCodeEventName.TaskDelegationResumed].parse(["p"])).toThrow()
	})

	test("taskEventSchema discriminated union includes delegation events", () => {
		expect(() =>
			taskEventSchema.parse({
				eventName: MeowCodeEventName.TaskDelegated,
				payload: ["p", "c"],
				taskId: 1,
			}),
		).not.toThrow()

		expect(() =>
			taskEventSchema.parse({
				eventName: MeowCodeEventName.TaskDelegationCompleted,
				payload: ["p", "c", "s"],
				taskId: 1,
			}),
		).not.toThrow()

		expect(() =>
			taskEventSchema.parse({
				eventName: MeowCodeEventName.TaskDelegationResumed,
				payload: ["p", "c"],
				taskId: 1,
			}),
		).not.toThrow()
	})
})
