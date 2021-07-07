<script>
import Modal from "bootstrap/js/dist/modal.js";

export default {
	emits: ["updateCoupon", "createCoupon"],
	props: {
		coupon: {
			temp: Object,
		},
	},
	inject: ["httpMsg"],
	data() {
		return {
			modal: "",
			couponInfo: {},
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
		createCoupon() {
			const { is_enabled, due_date } = this.couponInfo;
			const coupon = {
				...this.couponInfo,
				due_date: Math.floor(new Date(due_date).getTime() / 1000),
				is_enabled: is_enabled ? is_enabled : 0,
			};
			this.$emit("createCoupon", coupon);
		},
		updateCoupon() {
			this.$emit("updateCoupon", this.couponInfo);
		},
	},
	watch: {
		coupon: {
			handler(coupon) {
				const { due_date } = coupon.temp;
				if (due_date) {
					const date = new Date(due_date * 1000)
						.toISOString()
						.split("T")[0];
					this.couponInfo = { ...coupon.temp, due_date: date };
				} else {
					this.couponInfo = {};
				}
			},
			deep: true,
		},
	},
};
</script>

<template>
	<div
		class="modal fade"
		id="couponModal"
		tabindex="-1"
		role="dialog"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true"
		ref="modal"
	>
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel">
						<span v-if="coupon.mode === 'new'">新增優惠卷</span>
						<span v-else>編輯優惠卷</span>
					</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
					></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label for="title">標題</label>
						<input
							type="text"
							class="form-control"
							id="title"
							placeholder="請輸入標題"
							v-model.trim="couponInfo.title"
						/>
					</div>
					<div class="mb-3">
						<label for="coupon_code">優惠碼</label>
						<input
							type="text"
							class="form-control"
							id="coupon_code"
							placeholder="請輸入優惠碼"
							v-model.trim="couponInfo.code"
						/>
					</div>
					<div class="mb-3">
						<label for="due_date">到期日</label>
						<input
							type="date"
							class="form-control"
							id="due_date"
							v-model="couponInfo.due_date"
						/>
					</div>
					<div class="mb-3">
						<label for="price">折扣百分比</label>
						<input
							type="number"
							class="form-control"
							id="price"
							min="0"
							placeholder="請輸入折扣百分比"
							v-model.number="couponInfo.percent"
						/>
					</div>
					<div class="mb-3">
						<div class="form-check">
							<input
								class="form-check-input"
								type="checkbox"
								id="is_enabled"
								:true-value="1"
								:false-value="0"
								v-model="couponInfo.is_enabled"
							/>
							<label class="form-check-label" for="is_enabled">
								是否啟用
							</label>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-bs-dismiss="modal"
					>
						Close
					</button>
					<button
						type="button"
						class="btn btn-primary"
						v-if="coupon.mode === 'new'"
						@click.prevent="createCoupon"
					>
						新增優惠券
					</button>
					<button
						type="button"
						class="btn btn-primary"
						v-else
						@click.prevent="updateCoupon"
					>
						更新優惠券
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
