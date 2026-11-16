import { useCallback } from 'react';

// Tracks the pointer inside a glass card and exposes it as CSS variables.
// The CSS does the painting, so there is no React state update per frame.
export default function useSpotlight() {
	const onPointerMove = useCallback((event) => {
		const card = event.currentTarget;
		const rect = card.getBoundingClientRect();
		card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
		card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
	}, []);

	return { onPointerMove };
}
