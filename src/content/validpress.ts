const isTypingContext = (target: EventTarget | null): boolean => {
	const nodesToCheck = [target, document.activeElement];

	for (const node of nodesToCheck) {
		if (!node || !(node instanceof HTMLElement)) {
			continue;
		}

		const tagName = node.tagName ? node.tagName.toLowerCase() : "";
		if (tagName === "input" || tagName === "textarea" || tagName === "select") {
			return true;
		}

		if (node.isContentEditable || node.closest("[contenteditable='true']")) {
			return true;
		}
	}

	return false;
};

export function isValidPress(event: KeyboardEvent): boolean {
	if (event.defaultPrevented) {
		return false;
	}

	if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) {
		return false;
	}

	if (isTypingContext(event.target)) {
		return false;
	}

	return true;
}
