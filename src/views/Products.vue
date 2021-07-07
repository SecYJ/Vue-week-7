<script>
import Modal from "@/components/Modal.vue";

export default {
	components: {
		Modal,
	},
	inject: ["httpMsg"],
	data() {
		return {
			products: [],
			tempProduct: {},
		};
	},
	methods: {
		async getProducts(page = 1) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/products?page=${page}`;
			try {
				const results = await this.axios.get(url);
				loader.hide();
				if (!results.data.success) {
					throw new Error(results.data.message);
				}
				this.products = results.data.products;
			} catch (err) {
				alert(err.message);
			}
		},
		async checkMoreDetails({ id }) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/product/${id}`;
			try {
				const results = await this.axios.get(url);
				loader.hide();
				if (!results.data.success) {
					throw new Error(results.data.message);
				}
				this.tempProduct = results.data.product;
				this.$refs.modal.openModal();
			} catch (err) {
				alert(err.message);
			}
		},
		async addToCart({ id, qty }) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/cart`;
			const data = { product_id: id, qty };
			try {
				const results = await this.axios.post(url, { data });
				const { message, success } = results.data;
				loader.hide();
				if (!success) throw new Error(message);
				this.httpMsg(true, message);
			} catch (err) {
				this.httpMsg(false, "加入购物车");
			}
		},
	},
	created() {
		this.getProducts();
	},
};
</script>

<template>
	<div>
		<h1>This is 產品列表頁面</h1>
		<table class="table align-middle">
			<thead>
				<tr>
					<th>圖片</th>
					<th>商品名稱</th>
					<th>價格</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="product in products" :key="product.id">
					<td style="width: 200px">
						<div
							style="
								height: 100px;
								background-size: cover;
								background-position: center;
							"
							:style="{
								backgroundImage: product.imageUrl
									? `url(${product.imageUrl})`
									: '',
							}"
						></div>
					</td>

					<td>{{ product.title }}</td>
					<td>
						<div class="h6"></div>
						<del class="h5">
							原價 {{ product.origin_price }} 元
						</del>
						<div class="h5">現在只要 {{ product.price }} 元</div>
					</td>
					<td>
						<div class="btn-group btn-group-sm">
							<button
								type="button"
								class="btn btn-outline-secondary"
								@click.prevent="checkMoreDetails(product)"
							>
								<i class="fas fa-spinner fa-pulse"></i>
								查看更多
							</button>
							<button
								type="button"
								class="btn btn-outline-danger"
								@click.prevent="
									addToCart({ ...product, qty: 1 })
								"
							>
								<i class="fas fa-spinner fa-pulse"></i>
								加到購物車
							</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>

		<Modal
			ref="modal"
			:product="tempProduct"
			@add-to-cart="addToCart"
		></Modal>
	</div>
</template>
