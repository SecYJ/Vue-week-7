<script>
import Modal from "bootstrap/js/dist/modal.js";

export default {
	emits: ["deleteData"],
	props: {
		details: Object,
		category: {
			required: true,
			type: String,
		},
	},
	data() {
		return {
			modal: "",
			tempData: {},
		};
	},
	mounted() {
		this.modal = new Modal(this.$refs.modal);
	},
	methods: {
		openModal() {
			this.modal.show();
		},
		closeModal() {
			this.modal.hide();
		},
		confirmDelete() {
			this.$emit("deleteData", this.tempData);
		},
	},
	watch: {
		details(val) {
			this.tempData = { ...val };
		},
	},
};
</script>

<template>
	<div
		class="modal fade"
		id="delModal"
		tabindex="-1"
		role="dialog"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true"
		ref="modal"
	>
		<div class="modal-dialog" role="document">
			<div class="border-0 modal-content">
				<div class="text-white modal-header bg-danger">
					<h5 class="modal-title">
						<span>刪除 {{ tempData.title }}</span>
					</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
					></button>
				</div>
				<div class="modal-body">
					是否刪除
					<strong class="text-danger">{{ tempData.title }}</strong>
					(刪除後將無法恢復)。
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-outline-secondary"
						data-bs-dismiss="modal"
					>
						取消
					</button>
					<button
						type="button"
						class="btn btn-danger"
						@click.prevent="confirmDelete"
					>
						確認刪除
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
