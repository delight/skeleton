// Modal Store Queue

import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import type { ModalSettings } from './types.js';

const MODAL_STORE_KEY = 'modalStore';

/**
 * Retrieves the `modalStore`.
 *
 * This can *ONLY* be called from the **top level** of components!
 *
 * @example
 * ```svelte
 * <script>
 * 	import { getmodalStore } from "@skeletonlabs/skeleton";
 *
 * 	const modalStore = getModalStore();
 *
 * 	modalStore.trigger({ type: "alert", title: "Welcome!" });
 * </script>
 * ```
 */
export function getModalStore(): ModalStore {
	const modalStore = getContext<ModalStore | undefined>(MODAL_STORE_KEY);

	if (!modalStore)
		throw new Error(
			'modalStore is not initialized. Please ensure that `initializeStores()` is invoked in the root layout file of this app!'
		);

	return modalStore;
}

/**
 * Initializes the `modalStore`.
 */
export function initializeModalStore(): ModalStore {
	const modalStore = modalService();

	return setContext(MODAL_STORE_KEY, modalStore);
}

export type ModalStore = ReturnType<typeof modalService>;
function modalService() {
	const { subscribe, set, update } = writable<ModalSettings[]>([]);
	return {
		subscribe,
		set,
		update,
		/** Append to end of queue. */
		trigger: (modal: ModalSettings) =>
			update((mStore) => {
				mStore.push(modal);
				return mStore;
			}),
		/**  Remove first item in queue. */
		close: () =>
			update((mStore) => {
				if (mStore.length > 0) mStore.shift();
				return mStore;
			}),
		/** Remove all items from queue. */
		clear: () => set([])
	};
}
