<script>
import Pagination from "@/components/Pagination.vue";
import OrderModal from "@/components/OrderModal.vue";
import DeleteModal from "@/components/DeleteModal.vue";

export default {
	components: {
		Pagination,
		OrderModal,
		DeleteModal,
	},
	inject: ["httpMsg"],
	created() {
		this.getOrder();
	},
	data() {
		return {
			orderData: [],
			currentPage: 1,
			orderDetails: {},
			pages: {},
		};
	},
	methods: {
		async getOrder(page = 1) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/admin/orders?page=${page}`;
			try {
				const results = await this.axios.get(url);
				loader.hide();
				const { success, orders, pagination } = results.data;
				if (!success) throw new Error(results.data.message);
				this.orderData = orders;
				this.pages = pagination;
				this.currentPage = page;
			} catch (err) {
				alert(err.message);
			}
		},
		async deleteOrder({ id }) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/admin/order/${id}`;
			try {
				const results = await this.axios.delete(url);
				loader.hide();
				const { message, success } = results.data;
				if (!success) throw new Error(message);
				this.$refs.deleteModal.closeModal();
				this.getOrder(this.currentPage);
				this.httpMsg(true, "删除订单");
			} catch (err) {
				this.httpMsg(false, "删除订单");
			}
		},
		openModal(data) {
			this.orderDetails = { ...data };
			this.$refs.orderModal.openModal();
		},
		openDeleteModal(data) {
			this.orderDetails = { ...data };
			this.$refs.deleteModal.openModal();
		},
		async updatePayment(data) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/admin/order/${data.id}`;
			const order = { ...data };

			try {
				const results = await this.axios.put(url, { data: order });
				loader.hide();
				const { message, success } = results.data;
				if (!success) throw new Error(message);
				this.httpMsg(true, message);
				this.getOrder(this.currentPage);
			} catch (err) {
				this.httpMsg(false, "修改");
			}
		},
	},
};
</script>

<template>
	<table class="table mt-4">
		<thead>
			<tr>
				<th>購買時間</th>
				<th>Email</th>
				<th>購買款項</th>
				<th>應付金額</th>
				<th>是否付款</th>
				<th>編輯</th>
			</tr>
		</thead>
		<tbody>
			<template v-if="orderData.length">
				<tr v-for="order in orderData" :key="order.id">
					<td>{{ $filters.dateFormat(order.create_at) }}</td>
					<!-- <td>{{ order.due_date }}</td> -->
					<td>
						<span>{{ order.user.email }}</span>
					</td>
					<td>
						<ul class="list-unstyled">
							<li v-for="item in order.products" :key="item">
								{{
									`${item.product.title} 數量：${item.qty} ${item.product.unit}`
								}}
							</li>
						</ul>
					</td>
					<td class="text-right">
						{{ Number(order.total.toFixed(2)) }}
					</td>
					<td>
						<div class="form-check form-switch">
							<input
								class="form-check-input"
								type="checkbox"
								:id="order.id"
								v-model="order.is_paid"
								@change="updatePayment(order)"
							/>
							<label class="form-check-label" :for="order.id">
								<span v-if="order.is_paid">已付款</span>
								<span v-else>未付款</span>
							</label>
						</div>
					</td>
					<td>
						<div class="btn-group">
							<button
								class="btn btn-outline-primary btn-sm"
								@click.prevent="openModal(order)"
							>
								檢視
							</button>
							<button
								class="btn btn-outline-danger btn-sm"
								@click.prevent="openDeleteModal(order)"
							>
								刪除
							</button>
						</div>
					</td>
				</tr>
			</template>
		</tbody>
	</table>
	<div class="d-flex justify-content-center">
		<Pagination :pages="pages" @switch-page="getOrder"></Pagination>
	</div>
	<order-modal
		ref="orderModal"
		:details="orderDetails"
		@update-payment-status="updatePayment"
	></order-modal>
	<delete-modal
		ref="deleteModal"
		:details="orderDetails"
		category="order"
		@delete-data="deleteOrder"
	></delete-modal>
</template>
