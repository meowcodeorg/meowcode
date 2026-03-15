/**
 * Worktree Module
 *
 * VSCode-specific handlers for git worktree management.
 * Bridges webview messages to the platform-agnostic core services.
 */

export {
	handleListWorktrees,
	handleCreateWorktree,
	handleDeleteWorktree,
	handleSwitchWorktree,
	handleGetAvailableBranches,
	handleGetWorktreeDefaults,
	handleGetWorktreeIncludeStatus,
	handleCheckBranchWorktreeInclude,
	handleCreateWorktreeInclude,
	handleCheckoutBranch,
} from "./handlers"

// Re-export types from @meow-code/types for convenience
export type { WorktreeListResponse, WorktreeDefaultsResponse } from "@meow-code/types"
