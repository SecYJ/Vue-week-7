<script>
export default {
	inject: ["emitter"],
	data() {
		return {
			msg: [],
			msgState: {
				title: "",
				style: "",
				content: "",
			},
		};
	},
	methods: {
		toastShow() {
			this.msg.push(this.msgState);
		},
		toastHide(idx) {
			this.msg.splice(idx, 1);
		},
	},
	mounted() {
		this.emitter.on("pushMsg", msg => {
			const { title, style, content } = msg;
			this.msgState.title = title;
			this.msgState.style = style;
			this.msgState.content = content;

			this.toastShow();

			setTimeout(() => this.toastHide(), 5000);
		});
	},
};
</script>

<template>
	<div
		class="toast-container position-absolute pe-3 top-0 end-0"
		style="z-index: 1500"
	>
		<div
			class="toast show"
			role="alert"
			v-for="(item, idx) in msg"
			:key="idx"
		>
			<div class="toast-header">
				<span
					class="p-2 rounded me-2 d-inline-block"
					:class="`bg-${msgState.style}`"
				></span>
				<strong class="me-auto">{{ msgState.title }}</strong>
				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					@click.prevent="toastHide(idx)"
				></button>
			</div>
			<div class="toast-body" v-if="msgState.content">
				{{ msgState.content }}
			</div>
		</div>
	</div>
</template>
