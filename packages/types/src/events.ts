import { z } from "zod"

import { meowCodeMessageSchema, queuedMessageSchema, tokenUsageSchema } from "./message.js"
import { modelInfoSchema } from "./model.js"
import { toolNamesSchema, toolUsageSchema } from "./tool.js"

/**
 * MeowCodeEventName
 */

export enum MeowCodeEventName {
	// Task Provider Lifecycle
	TaskCreated = "taskCreated",

	// Task Lifecycle
	TaskStarted = "taskStarted",
	TaskCompleted = "taskCompleted",
	TaskAborted = "taskAborted",
	TaskFocused = "taskFocused",
	TaskUnfocused = "taskUnfocused",
	TaskActive = "taskActive",
	TaskInteractive = "taskInteractive",
	TaskResumable = "taskResumable",
	TaskIdle = "taskIdle",

	// Subtask Lifecycle
	TaskPaused = "taskPaused",
	TaskUnpaused = "taskUnpaused",
	TaskSpawned = "taskSpawned",
	TaskDelegated = "taskDelegated",
	TaskDelegationCompleted = "taskDelegationCompleted",
	TaskDelegationResumed = "taskDelegationResumed",

	// Task Execution
	Message = "message",
	TaskModeSwitched = "taskModeSwitched",
	TaskAskResponded = "taskAskResponded",
	TaskUserMessage = "taskUserMessage",
	QueuedMessagesUpdated = "queuedMessagesUpdated",

	// Task Analytics
	TaskTokenUsageUpdated = "taskTokenUsageUpdated",
	TaskToolFailed = "taskToolFailed",

	// Configuration Changes
	ModeChanged = "modeChanged",
	ProviderProfileChanged = "providerProfileChanged",

	// Query Responses
	CommandsResponse = "commandsResponse",
	ModesResponse = "modesResponse",
	ModelsResponse = "modelsResponse",

	// Evals
	EvalPass = "evalPass",
	EvalFail = "evalFail",
}

/**
 * MeowCodeEvents
 */

export const meowCodeEventsSchema = z.object({
	[MeowCodeEventName.TaskCreated]: z.tuple([z.string()]),

	[MeowCodeEventName.TaskStarted]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskCompleted]: z.tuple([
		z.string(),
		tokenUsageSchema,
		toolUsageSchema,
		z.object({
			isSubtask: z.boolean(),
		}),
	]),
	[MeowCodeEventName.TaskAborted]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskFocused]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskUnfocused]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskActive]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskInteractive]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskResumable]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskIdle]: z.tuple([z.string()]),

	[MeowCodeEventName.TaskPaused]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskUnpaused]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskSpawned]: z.tuple([z.string(), z.string()]),
	[MeowCodeEventName.TaskDelegated]: z.tuple([
		z.string(), // parentTaskId
		z.string(), // childTaskId
	]),
	[MeowCodeEventName.TaskDelegationCompleted]: z.tuple([
		z.string(), // parentTaskId
		z.string(), // childTaskId
		z.string(), // completionResultSummary
	]),
	[MeowCodeEventName.TaskDelegationResumed]: z.tuple([
		z.string(), // parentTaskId
		z.string(), // childTaskId
	]),

	[MeowCodeEventName.Message]: z.tuple([
		z.object({
			taskId: z.string(),
			action: z.union([z.literal("created"), z.literal("updated")]),
			message: meowCodeMessageSchema,
		}),
	]),
	[MeowCodeEventName.TaskModeSwitched]: z.tuple([z.string(), z.string()]),
	[MeowCodeEventName.TaskAskResponded]: z.tuple([z.string()]),
	[MeowCodeEventName.TaskUserMessage]: z.tuple([z.string()]),
	[MeowCodeEventName.QueuedMessagesUpdated]: z.tuple([z.string(), z.array(queuedMessageSchema)]),

	[MeowCodeEventName.TaskToolFailed]: z.tuple([z.string(), toolNamesSchema, z.string()]),
	[MeowCodeEventName.TaskTokenUsageUpdated]: z.tuple([z.string(), tokenUsageSchema, toolUsageSchema]),

	[MeowCodeEventName.ModeChanged]: z.tuple([z.string()]),
	[MeowCodeEventName.ProviderProfileChanged]: z.tuple([z.object({ name: z.string(), provider: z.string() })]),

	[MeowCodeEventName.CommandsResponse]: z.tuple([
		z.array(
			z.object({
				name: z.string(),
				source: z.enum(["global", "project", "built-in"]),
				filePath: z.string().optional(),
				description: z.string().optional(),
				argumentHint: z.string().optional(),
			}),
		),
	]),
	[MeowCodeEventName.ModesResponse]: z.tuple([z.array(z.object({ slug: z.string(), name: z.string() }))]),
	[MeowCodeEventName.ModelsResponse]: z.tuple([z.record(z.string(), modelInfoSchema)]),
})

export type MeowCodeEvents = z.infer<typeof meowCodeEventsSchema>

/**
 * TaskEvent
 */

export const taskEventSchema = z.discriminatedUnion("eventName", [
	// Task Provider Lifecycle
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskCreated),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskCreated],
		taskId: z.number().optional(),
	}),

	// Task Lifecycle
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskStarted),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskStarted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskCompleted),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskCompleted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskAborted),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskAborted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskFocused),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskFocused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskUnfocused),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskUnfocused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskActive),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskActive],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskInteractive),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskInteractive],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskResumable),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskResumable],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskIdle),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskIdle],
		taskId: z.number().optional(),
	}),

	// Subtask Lifecycle
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskPaused),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskPaused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskUnpaused),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskUnpaused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskSpawned),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskSpawned],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskDelegated),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskDelegated],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskDelegationCompleted),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskDelegationCompleted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskDelegationResumed),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskDelegationResumed],
		taskId: z.number().optional(),
	}),

	// Task Execution
	z.object({
		eventName: z.literal(MeowCodeEventName.Message),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.Message],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskModeSwitched),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskModeSwitched],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskAskResponded),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskAskResponded],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.QueuedMessagesUpdated),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.QueuedMessagesUpdated],
		taskId: z.number().optional(),
	}),

	// Task Analytics
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskToolFailed),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskToolFailed],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.TaskTokenUsageUpdated),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.TaskTokenUsageUpdated],
		taskId: z.number().optional(),
	}),

	// Query Responses
	z.object({
		eventName: z.literal(MeowCodeEventName.CommandsResponse),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.CommandsResponse],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.ModesResponse),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.ModesResponse],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.ModelsResponse),
		payload: meowCodeEventsSchema.shape[MeowCodeEventName.ModelsResponse],
		taskId: z.number().optional(),
	}),

	// Evals
	z.object({
		eventName: z.literal(MeowCodeEventName.EvalPass),
		payload: z.undefined(),
		taskId: z.number(),
	}),
	z.object({
		eventName: z.literal(MeowCodeEventName.EvalFail),
		payload: z.undefined(),
		taskId: z.number(),
	}),
])

export type TaskEvent = z.infer<typeof taskEventSchema>
