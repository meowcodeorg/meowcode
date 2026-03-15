// npx vitest run src/__tests__/index.test.ts

import { generatePackageJson } from "../index.js"

describe("generatePackageJson", () => {
	it("should be a test", () => {
		const generatedPackageJson = generatePackageJson({
			packageJson: {
				name: "meow-code",
				displayName: "%extension.displayName%",
				description: "%extension.description%",
				publisher: "MeowCodeOrg",
				version: "3.17.2",
				icon: "assets/icons/icon.png",
				contributes: {
					viewsContainers: {
						activitybar: [
							{
								id: "meow-code-ActivityBar",
								title: "%views.activitybar.title%",
								icon: "assets/icons/icon.svg",
							},
						],
					},
					views: {
						"meow-code-ActivityBar": [
							{
								type: "webview",
								id: "meow-code.SidebarProvider",
								name: "",
							},
						],
					},
					commands: [
						{
							command: "meow-code.plusButtonClicked",
							title: "%command.newTask.title%",
							icon: "$(edit)",
						},
						{
							command: "meow-code.openInNewTab",
							title: "%command.openInNewTab.title%",
							category: "%configuration.title%",
						},
					],
					menus: {
						"editor/context": [
							{
								submenu: "meow-code.contextMenu",
								group: "navigation",
							},
						],
						"meow-code.contextMenu": [
							{
								command: "meow-code.addToContext",
								group: "1_actions@1",
							},
						],
						"editor/title": [
							{
								command: "meow-code.plusButtonClicked",
								group: "navigation@1",
								when: "activeWebviewPanelId == meow-code.TabPanelProvider",
							},
							{
								command: "meow-code.settingsButtonClicked",
								group: "navigation@6",
								when: "activeWebviewPanelId == meow-code.TabPanelProvider",
							},
							{
								command: "meow-code.accountButtonClicked",
								group: "navigation@6",
								when: "activeWebviewPanelId == meow-code.TabPanelProvider",
							},
						],
					},
					submenus: [
						{
							id: "meow-code.contextMenu",
							label: "%views.contextMenu.label%",
						},
						{
							id: "meow-code.terminalMenu",
							label: "%views.terminalMenu.label%",
						},
					],
					configuration: {
						title: "%configuration.title%",
						properties: {
							"meow-code.allowedCommands": {
								type: "array",
								items: {
									type: "string",
								},
								default: ["npm test", "npm install", "tsc", "git log", "git diff", "git show"],
								description: "%commands.allowedCommands.description%",
							},
							"meow-code.customStoragePath": {
								type: "string",
								default: "",
								description: "%settings.customStoragePath.description%",
							},
						},
					},
				},
				scripts: {
					lint: "eslint **/*.ts",
				},
			},
			overrideJson: {
				name: "meow-code-nightly",
				displayName: "MeowCode Nightly",
				publisher: "MeowCodeOrg",
				version: "0.0.1",
				icon: "assets/icons/icon-nightly.png",
				scripts: {},
			},
			substitution: ["meow-code", "meow-code-nightly"],
		})

		expect(generatedPackageJson).toStrictEqual({
			name: "meow-code-nightly",
			displayName: "MeowCode Nightly",
			description: "%extension.description%",
			publisher: "MeowCodeOrg",
			version: "0.0.1",
			icon: "assets/icons/icon-nightly.png",
			contributes: {
				viewsContainers: {
					activitybar: [
						{
							id: "meow-code-nightly-ActivityBar",
							title: "%views.activitybar.title%",
							icon: "assets/icons/icon.svg",
						},
					],
				},
				views: {
					"meow-code-nightly-ActivityBar": [
						{
							type: "webview",
							id: "meow-code-nightly.SidebarProvider",
							name: "",
						},
					],
				},
				commands: [
					{
						command: "meow-code-nightly.plusButtonClicked",
						title: "%command.newTask.title%",
						icon: "$(edit)",
					},
					{
						command: "meow-code-nightly.openInNewTab",
						title: "%command.openInNewTab.title%",
						category: "%configuration.title%",
					},
				],
				menus: {
					"editor/context": [
						{
							submenu: "meow-code-nightly.contextMenu",
							group: "navigation",
						},
					],
					"meow-code-nightly.contextMenu": [
						{
							command: "meow-code-nightly.addToContext",
							group: "1_actions@1",
						},
					],
					"editor/title": [
						{
							command: "meow-code-nightly.plusButtonClicked",
							group: "navigation@1",
							when: "activeWebviewPanelId == meow-code-nightly.TabPanelProvider",
						},
						{
							command: "meow-code-nightly.settingsButtonClicked",
							group: "navigation@6",
							when: "activeWebviewPanelId == meow-code-nightly.TabPanelProvider",
						},
						{
							command: "meow-code-nightly.accountButtonClicked",
							group: "navigation@6",
							when: "activeWebviewPanelId == meow-code-nightly.TabPanelProvider",
						},
					],
				},
				submenus: [
					{
						id: "meow-code-nightly.contextMenu",
						label: "%views.contextMenu.label%",
					},
					{
						id: "meow-code-nightly.terminalMenu",
						label: "%views.terminalMenu.label%",
					},
				],
				configuration: {
					title: "%configuration.title%",
					properties: {
						"meow-code-nightly.allowedCommands": {
							type: "array",
							items: {
								type: "string",
							},
							default: ["npm test", "npm install", "tsc", "git log", "git diff", "git show"],
							description: "%commands.allowedCommands.description%",
						},
						"meow-code-nightly.customStoragePath": {
							type: "string",
							default: "",
							description: "%settings.customStoragePath.description%",
						},
					},
				},
			},
			scripts: {},
		})
	})
})
