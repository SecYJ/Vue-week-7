<script>
export default {
	inject: ["httpMsg"],
	data() {
		return {
			order: {},
			orderId: "",
		};
	},
	methods: {
		async getOrderData() {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/order/${this.orderId}`;
			try {
				const results = await this.axios.get(url);
				loader.hide();
				if (!results.data.success) {
					throw new Error(results.data.message);
				}
				this.order = results.data.order;
			} catch (err) {
				alert(err.message);
			}
		},
		async makePayment() {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/pay/${this.orderId}`; // pay
			try {
				const results = await this.axios.post(url);
				loader.hide();
				const { message, success } = results.data;
				if (!success) throw new Error(message);
				this.getOrderData();
				this.httpMsg(true, message);
			} catch (err) {
				this.httpMsg(false, err.message);
			}
		},
	},
	created() {
		const { id: orderId } = this.$route.params;
		this.orderId = orderId;
		this.getOrderData();
	},
};
</script>

<template>
	<div class="my-5 row justify-content-center">
		<form class="col-md-6" @submit.prevent="makePayment">
			<table class="table align-middle">
				<thead>
					<th>品名</th>
					<th>數量</th>
					<th>單價</th>
				</thead>
				<tbody>
					<tr v-for="item in order.products" :key="item.id">
						<td>{{ item.product.title }}</td>
						<td>{{ item.qty }}/{{ item.product.unit }}</td>
						<td class="text-end">
							{{ $filters.currency(item.final_total) }}
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="2" class="text-end">總計</td>
						<td class="text-end">
							{{ $filters.currency(order.total) }}
						</td>
					</tr>
				</tfoot>
			</table>

			<table class="table">
				<tbody>
					<tr>
						<th width="100">Email</th>
						<td>{{ order.user?.email }}</td>
					</tr>
					<tr>
						<th>姓名</th>
						<td>{{ order.user?.name }}</td>
					</tr>
					<tr>
						<th>收件人電話</th>
						<td>{{ order.user?.tel }}</td>
					</tr>
					<tr>
						<th>收件人地址</th>
						<td>{{ order.user?.address }}</td>
					</tr>
					<tr>
						<th>付款狀態</th>
						<td>
							<span v-if="!order.is_paid">尚未付款</span>
							<span v-else class="text-success">付款完成</span>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="text-end">
				<button class="btn btn-danger" v-if="!order.is_paid">
					確認付款去
				</button>
			</div>
		</form>
	</div>
</template>
