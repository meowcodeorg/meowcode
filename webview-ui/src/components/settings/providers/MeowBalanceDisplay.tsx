import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"

import { useMeowCreditBalance } from "@/components/ui/hooks/useMeowCreditBalance"
import { useExtensionState } from "@src/context/ExtensionStateContext"

export const MeowBalanceDisplay = () => {
	const { data: balance } = useMeowCreditBalance()
	const { cloudApiUrl } = useExtensionState()

	if (balance === null || balance === undefined) {
		return null
	}

	const formattedBalance = balance.toFixed(2)
	const billingUrl = cloudApiUrl ? `${cloudApiUrl.replace(/\/$/, "")}/billing` : "https://app.TODOURL/billing"

	return (
		<VSCodeLink href={billingUrl} className="text-vscode-foreground hover:underline whitespace-nowrap">
			${formattedBalance}
		</VSCodeLink>
	)
}
