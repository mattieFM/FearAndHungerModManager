class PriorityQueue {
	constructor() {
		this.values = [];
	}

	enqueue(node, priority) {
		var flag = false;
		for (let i = 0; i < this.values.length; i++) {
			if (this.values[i].priority < priority) {
				this.values.splice(i, 0, { node, priority });
				flag = true;
				break;
			}
		}
		if (!flag) {
			this.values.push({ node, priority });
		}
	}

	clearLowPrioEvents(lowerThan = 0) {
		const indexsToRemove = [];
		for (let index = 0; index < this.values.length; index++) {
			const element = this.values[index];
			if (element.priority < lowerThan) {
				indexsToRemove.push(index);
			}
		}
		indexsToRemove.forEach((i) => {
			this.values.splice(i, 1);
		});
	}

	dequeue() {
		return this.values.shift();
	}

	size() {
		return this.values.length;
	}
}
