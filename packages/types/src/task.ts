import { z } from "zod"

import { MeowCodeEventName } from "./events.js"
import type { MeowCodeSettings } from "./global-settings.js"
import type { MeowCodeMessage, QueuedMessage, TokenUsage } from "./message.js"
import type { ToolUsage, ToolName } from "./tool.js"
import type { StaticAppProperties, GitProperties, TelemetryProperties } from "./telemetry.js"
import type { TodoItem } from "./todo.js"

/**
 * TaskProviderLike
 */

export interface TaskProviderLike {
	// Tasks
	getCurrentTask(): TaskLike | undefined
	getRecentTasks(): string[]
	createTask(
		text?: string,
		images?: string[],
		parentTask?: TaskLike,
		options?: CreateTaskOptions,
		configuration?: MeowCodeSettings,
	): Promise<TaskLike>
	cancelTask(): Promise<void>
	clearTask(): Promise<void>
	resumeTask(taskId: string): void

	// Modes
	getModes(): Promise<{ slug: string; name: string }[]>
	getMode(): Promise<string>
	setMode(mode: string): Promise<void>

	// Provider Profiles
	getProviderProfiles(): Promise<{ name: string; provider?: string }[]>
	getProviderProfile(): Promise<string>
	setProviderProfile(providerProfile: string): Promise<void>

	// Telemetry
	readonly appProperties: StaticAppProperties
	readonly gitProperties: GitProperties | undefined
	getTelemetryProperties(): Promise<TelemetryProperties>
	readonly cwd: string

	// Event Emitter
	on<K extends keyof TaskProviderEvents>(
		event: K,
		listener: (...args: TaskProviderEvents[K]) => void | Promise<void>,
	): this

	off<K extends keyof TaskProviderEvents>(
		event: K,
		listener: (...args: TaskProviderEvents[K]) => void | Promise<void>,
	): this

	// @TODO: Find a better way to do this.
	postStateToWebview(): Promise<void>
}

export type TaskProviderEvents = {
	[MeowCodeEventName.TaskCreated]: [task: TaskLike]
	[MeowCodeEventName.TaskStarted]: [taskId: string]
	[MeowCodeEventName.TaskCompleted]: [taskId: string, tokenUsage: TokenUsage, toolUsage: ToolUsage]
	[MeowCodeEventName.TaskAborted]: [taskId: string]
	[MeowCodeEventName.TaskFocused]: [taskId: string]
	[MeowCodeEventName.TaskUnfocused]: [taskId: string]
	[MeowCodeEventName.TaskActive]: [taskId: string]
	[MeowCodeEventName.TaskInteractive]: [taskId: string]
	[MeowCodeEventName.TaskResumable]: [taskId: string]
	[MeowCodeEventName.TaskIdle]: [taskId: string]

	[MeowCodeEventName.TaskPaused]: [taskId: string]
	[MeowCodeEventName.TaskUnpaused]: [taskId: string]
	[MeowCodeEventName.TaskSpawned]: [taskId: string]
	[MeowCodeEventName.TaskDelegated]: [parentTaskId: string, childTaskId: string]
	[MeowCodeEventName.TaskDelegationCompleted]: [parentTaskId: string, childTaskId: string, summary: string]
	[MeowCodeEventName.TaskDelegationResumed]: [parentTaskId: string, childTaskId: string]

	[MeowCodeEventName.TaskUserMessage]: [taskId: string]

	[MeowCodeEventName.TaskTokenUsageUpdated]: [taskId: string, tokenUsage: TokenUsage, toolUsage: ToolUsage]

	[MeowCodeEventName.ModeChanged]: [mode: string]
	[MeowCodeEventName.ProviderProfileChanged]: [config: { name: string; provider?: string }]
}

/**
 * TaskLike
 */

export interface CreateTaskOptions {
	taskId?: string
	enableCheckpoints?: boolean
	consecutiveMistakeLimit?: number
	experiments?: Record<string, boolean>
	initialTodos?: TodoItem[]
	/** Initial status for the task's history item (e.g., "active" for child tasks) */
	initialStatus?: "active" | "delegated" | "completed"
	/** Whether to start the task loop immediately (default: true).
	 *  When false, the caller must invoke `task.start()` manually. */
	startTask?: boolean
}

export enum TaskStatus {
	Running = "running",
	Interactive = "interactive",
	Resumable = "resumable",
	Idle = "idle",
	None = "none",
}

export const taskMetadataSchema = z.object({
	task: z.string().optional(),
	images: z.array(z.string()).optional(),
})

export type TaskMetadata = z.infer<typeof taskMetadataSchema>

export interface TaskLike {
	readonly taskId: string
	readonly rootTaskId?: string
	readonly parentTaskId?: string
	readonly childTaskId?: string
	readonly metadata: TaskMetadata
	readonly taskStatus: TaskStatus
	readonly taskAsk: MeowCodeMessage | undefined
	readonly queuedMessages: QueuedMessage[]
	readonly tokenUsage: TokenUsage | undefined

	on<K extends keyof TaskEvents>(event: K, listener: (...args: TaskEvents[K]) => void | Promise<void>): this
	off<K extends keyof TaskEvents>(event: K, listener: (...args: TaskEvents[K]) => void | Promise<void>): this

	approveAsk(options?: { text?: string; images?: string[] }): void
	denyAsk(options?: { text?: string; images?: string[] }): void
	submitUserMessage(text: string, images?: string[], mode?: string, providerProfile?: string): Promise<void>
	abortTask(): void
}

export type TaskEvents = {
	// Task Lifecycle
	[MeowCodeEventName.TaskStarted]: []
	[MeowCodeEventName.TaskCompleted]: [taskId: string, tokenUsage: TokenUsage, toolUsage: ToolUsage]
	[MeowCodeEventName.TaskAborted]: []
	[MeowCodeEventName.TaskFocused]: []
	[MeowCodeEventName.TaskUnfocused]: []
	[MeowCodeEventName.TaskActive]: [taskId: string]
	[MeowCodeEventName.TaskInteractive]: [taskId: string]
	[MeowCodeEventName.TaskResumable]: [taskId: string]
	[MeowCodeEventName.TaskIdle]: [taskId: string]

	// Subtask Lifecycle
	[MeowCodeEventName.TaskPaused]: [taskId: string]
	[MeowCodeEventName.TaskUnpaused]: [taskId: string]
	[MeowCodeEventName.TaskSpawned]: [taskId: string]

	// Task Execution
	[MeowCodeEventName.Message]: [{ action: "created" | "updated"; message: MeowCodeMessage }]
	[MeowCodeEventName.TaskModeSwitched]: [taskId: string, mode: string]
	[MeowCodeEventName.TaskAskResponded]: []
	[MeowCodeEventName.TaskUserMessage]: [taskId: string]
	[MeowCodeEventName.QueuedMessagesUpdated]: [taskId: string, messages: QueuedMessage[]]

	// Task Analytics
	[MeowCodeEventName.TaskToolFailed]: [taskId: string, tool: ToolName, error: string]
	[MeowCodeEventName.TaskTokenUsageUpdated]: [taskId: string, tokenUsage: TokenUsage, toolUsage: ToolUsage]
}
