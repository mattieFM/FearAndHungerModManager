/**
 * Binary max-heap priority queue.
 * Higher priority items are dequeued first.
 * O(log n) enqueue/dequeue, O(n) clearLowPrioEvents.
 * Maintains a backward-compatible `.values` getter for queue length checks.
 */
class PriorityQueue {
	constructor() {
		/** @type {Array.<{node: *, priority: number}>} */
		this._heap = [];
	}

	/** Backward-compatible accessor — existing code checks .values.length */
	get values() {
		return this._heap;
	}

	enqueue(node, priority) {
		this._heap.push({ node, priority });
		this._bubbleUp(this._heap.length - 1);
	}

	dequeue() {
		const heap = this._heap;
		if (heap.length === 0) return undefined;
		const top = heap[0];
		const last = heap.pop();
		if (heap.length > 0) {
			heap[0] = last;
			this._sinkDown(0);
		}
		return top;
	}

	clearLowPrioEvents(lowerThan = 0) {
		// Filter then rebuild heap in O(n)
		this._heap = this._heap.filter((item) => item.priority >= lowerThan);
		this._buildHeap();
	}

	size() {
		return this._heap.length;
	}

	// --- Heap internals ---

	_bubbleUp(idx) {
		const heap = this._heap;
		while (idx > 0) {
			const parent = (idx - 1) >> 1;
			if (heap[idx].priority > heap[parent].priority) {
				[heap[idx], heap[parent]] = [heap[parent], heap[idx]];
				idx = parent;
			} else {
				break;
			}
		}
	}

	_sinkDown(idx) {
		const heap = this._heap;
		const len = heap.length;
		for (;;) { // eslint-disable-line no-constant-condition
			let largest = idx;
			const left = 2 * idx + 1;
			const right = 2 * idx + 2;
			if (left < len && heap[left].priority > heap[largest].priority) largest = left;
			if (right < len && heap[right].priority > heap[largest].priority) largest = right;
			if (largest !== idx) {
				[heap[idx], heap[largest]] = [heap[largest], heap[idx]];
				idx = largest;
			} else {
				break;
			}
		}
	}

	_buildHeap() {
		for (let i = (this._heap.length >> 1) - 1; i >= 0; i--) {
			this._sinkDown(i);
		}
	}
}
