<script>
import CouponModal from "@/components/CouponModal.vue";
import DelModal from "@/components/DeleteModal.vue";

export default {
	components: {
		CouponModal,
		DelModal,
	},
	inject: ["httpMsg"],
	created() {
		this.getCouponList();
	},
	data() {
		return {
			couponList: [],
			pages: [],
			coupon: {
				temp: {},
			},
		};
	},
	methods: {
		async getCouponList(page = 1) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/admin/coupons?page=${page}`;

			try {
				const results = await this.axios.get(url);
				const { pagination, coupons, success } = results.data;
				if (!success) throw new Error(results.data.message);
				loader.hide();
				this.couponList = coupons;
				this.pages = pagination;
			} catch (err) {
				alert(err.message);
			}
		},
		openCouponModal(mode, couponDetails) {
			this.coupon.mode = mode;
			if (mode === "new") this.coupon.temp = {};
			if (mode === "edit") this.coupon.temp = { ...couponDetails };

			this.$refs.couponModal.openModal();
		},
		openDelModal(couponDetails) {
			this.coupon.temp = { ...couponDetails };
			this.$refs.delModal.openModal();
		},
		async deleteCoupon({ id }) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/admin/coupon/${id}`;
			try {
				const results = await this.axios.delete(url);
				this.$refs.delModal.closeModal();
				loader.hide();
				const { message, success } = results.data;
				if (!success) throw new Error(message);
				this.getCouponList();
				this.httpMsg(true, message);
			} catch (err) {
				this.httpMsg(false, "删除优惠券");
			}
		},
		async createCoupon(coupon) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/admin/coupon`;

			try {
				const results = await this.axios.post(url, { data: coupon });
				loader.hide();
				const { message, success } = results.data;
				if (!success) throw new Error(message);
				this.$refs.couponModal.closeModal();
				this.getCouponList();
				this.httpMsg(true, message);
			} catch (err) {
				this.httpMsg(false, err.message);
			}
		},
		async updateCoupon(coupon) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/admin/coupon/${coupon.id}`;
			const couponData = {
				title: coupon.title,
				is_enabled: coupon.is_enabled,
				percent: coupon.percent,
				due_date: Math.floor(
					new Date(coupon.due_date).getTime() / 1000
				),
				code: coupon.code,
			};

			try {
				const results = await this.axios.put(url, { data: couponData });
				loader.hide();
				const { message, success } = results.data;
				if (!success) throw new Error(message);
				this.$refs.couponModal.closeModal();
				this.getCouponList();
				this.httpMsg(true, message);
			} catch (err) {
				this.httpMsg(false, err.message);
			}
		},
	},
};
</script>

<template>
	<div class="mt-4 text-end">
		<button
			type="button"
			class="btn btn-primary"
			@click.prevent="openCouponModal('new')"
		>
			建立新的優惠券
		</button>
	</div>
	<table class="table mt-4">
		<thead>
			<tr>
				<th>名稱</th>
				<th>折扣百分比</th>
				<th>到期日</th>
				<th>是否啟用</th>
				<th>編輯</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="coupon in couponList" :key="coupon.id">
				<td>{{ coupon.title }}</td>
				<td>{{ `${coupon.percent}%` }}</td>
				<td>{{ $filters.dateFormat(coupon.due_date) }}</td>
				<td>
					<span class="text-success" v-if="coupon.is_enabled"
						>啟用</span
					>
					<span class="text-muted" v-else>未啟用</span>
				</td>
				<td>
					<div class="btn-group">
						<button
							type="button"
							class="btn btn-outline-primary btn-sm"
							@click.prevent="openCouponModal('edit', coupon)"
						>
							編輯
						</button>
						<button
							type="button"
							class="btn btn-outline-danger btn-sm"
							@click.prevent="openDelModal(coupon)"
						>
							刪除
						</button>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	<coupon-modal
		ref="couponModal"
		:coupon="coupon"
		@create-coupon="createCoupon"
		@update-coupon="updateCoupon"
	></coupon-modal>
	<del-modal
		ref="delModal"
		:details="coupon.temp"
		category="coupon"
		@delete-data="deleteCoupon"
	></del-modal>
</template>
