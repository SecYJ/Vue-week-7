<script>
export default {
	inject: ["httpMsg"],
	data() {
		return {
			cartList: [],
			totalPrice: 0,
			finalTotalPrice: 0,
			form: {
				user: {
					email: "",
					name: "",
					tel: "",
					address: "",
				},
				message: "",
			},
			code: "",
		};
	},
	methods: {
		async getCartList() {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/cart`;
			try {
				const results = await this.axios.get(url);
				loader.hide();
				const { total, final_total, carts } = results.data.data;
				if (!results.data.success) {
					throw new Error(results.data.message);
				}
				this.cartList = carts;
				this.totalPrice = total;
				this.finalTotalPrice = final_total;
			} catch (err) {
				alert(err.message);
			}
		},
		async removeSelectedCartItem(item) {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/cart/${item.id}`;
			try {
				const results = await this.axios.delete(url);
				loader.hide();
				const { success, message } = results.data;
				if (!success) throw new Error(message);
				this.getCartList();
				this.httpMsg(true, message);
			} catch (err) {
				this.httpMsg(false, "删除");
			}
		},
		async submitForm() {
			let loader = this.$loading.show();
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/order`;
			try {
				const results = await this.axios.post(url, { data: this.form });
				const { success, message } = results.data;
				if (!success) throw new Error(message);
				loader.hide();
				this.httpMsg(true, message);
				this.getCartList();
				this.$refs.form.resetForm();
				this.form.message = "";
				this.code = "";
				this.$router.push(`/checkout/${results.data.orderId}`);
			} catch (err) {
				this.httpMsg(false, err.message);
			}
		},
		async useCouponCode() {
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/coupon`;
			const coupon = { data: { code: this.code } };
			try {
				const results = await this.axios.post(url, coupon);
				const { success, message } = results.data;
				if (!success) throw new Error(message);
				this.httpMsg(true, message);
				this.getCartList();
			} catch (err) {
				this.httpMsg(false, err.message);
			}
		},
		async updateCartItem({ qty, product_id, id }) {
			const url = `${process.env.VUE_APP_APIURL}/api/${process.env.VUE_APP_APIPATH}/cart/${id}`;
			const cart = { product_id, qty };

			try {
				const results = await this.axios.put(url, { data: cart });
				const { message, success } = results.data;
				if (!success) throw new Error(message);
				this.getCartList();
				this.httpMsg(true, message);
			} catch (err) {
				this.httpMsg(false, err.message);
			}
		},
	},
	created() {
		this.getCartList();
	},
};
</script>

<template>
	<div v-if="!cartList.length">
		<h1>购物车为空</h1>
		<router-link to="/products" class="text-decoration-none"
			>点击这里前往购物吧 ^_^</router-link
		>
	</div>
	<div class="about" v-else>
		<h1>This is 購物車頁面</h1>
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-6">
					<table class="table align-middle">
						<thead>
							<tr>
								<th></th>
								<th>品名</th>
								<th style="width: 110px">數量</th>
								<th>單價</th>
							</tr>
						</thead>
						<tbody>
							<template v-if="cartList.length">
								<tr
									v-for="item in cartList"
									:key="item.product_id"
								>
									<td>
										<button
											type="button"
											class="btn btn-outline-danger btn-sm"
											@click.prevent="
												removeSelectedCartItem(item)
											"
										>
											<i
												class="fas fa-spinner fa-pulse"
											></i>
											移除購物車
										</button>
									</td>
									<td>
										<div
											class="text-success"
											v-if="item.coupon"
										>
											已套用優惠券
										</div>
										{{ item.product.title }}
									</td>
									<td>
										<div class="input-group input-group-sm">
											<input
												type="number"
												min="1"
												v-model.number="item.qty"
												@change="updateCartItem(item)"
											/>
										</div>
									</td>
									<td class="text-end">
										<small class="text-success"
											>折扣價：</small
										>
										{{
											$filters.currency(item.final_total)
										}}
									</td>
								</tr>
							</template>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="3" class="text-end">總計</td>
								<td class="text-end">
									{{ $filters.currency(totalPrice) }}
								</td>
							</tr>
							<tr>
								<td colspan="3" class="text-end text-success">
									折扣價
								</td>
								<td class="text-end text-success">
									{{ $filters.currency(finalTotalPrice) }}
								</td>
							</tr>
						</tfoot>
					</table>
					<div class="input-group mb-3 input-group-sm">
						<input
							type="text"
							class="form-control"
							v-model="code"
							placeholder="請輸入優惠碼"
						/>
						<button
							class="btn btn-outline-secondary"
							type="button"
							@click="useCouponCode"
						>
							套用優惠碼
						</button>
					</div>
				</div>
			</div>
			<div class="my-5 row justify-content-center">
				<Form
					ref="form"
					v-slot="{ errors }"
					class="col-md-6"
					@submit="submitForm"
				>
					<div class="mb-3">
						<label for="email" class="form-label">Email</label>
						<Field
							id="email"
							name="email"
							type="email"
							class="form-control"
							:class="{ 'is-invalid': errors['email'] }"
							placeholder="請輸入 Email"
							rules="required|email"
							v-model.trim="form.user.email"
						></Field>
						<ErrorMessage
							name="email"
							class="invalid-feedback"
						></ErrorMessage>
					</div>

					<div class="mb-3">
						<label for="name" class="form-label">收件人姓名</label>
						<Field
							id="name"
							name="姓名"
							type="text"
							class="form-control"
							placeholder="請輸入姓名"
							rules="required"
							:class="{ 'is-invalid': errors['姓名'] }"
							v-model.trim="form.user.name"
						></Field>
						<ErrorMessage
							name="姓名"
							class="invalid-feedback"
						></ErrorMessage>
					</div>

					<div class="mb-3">
						<label for="tel" class="form-label">收件人電話</label>
						<Field
							id="tel"
							name="電話"
							type="text"
							class="form-control"
							placeholder="請輸入電話"
							rules="required|min:8|max:10"
							:class="{ 'is-invalid': errors['電話'] }"
							v-model.trim="form.user.tel"
						></Field>
						<ErrorMessage
							name="電話"
							class="invalid-feedback"
						></ErrorMessage>
					</div>

					<div class="mb-3">
						<label for="address" class="form-label"
							>收件人地址</label
						>
						<Field
							id="address"
							name="地址"
							type="text"
							class="form-control"
							placeholder="請輸入地址"
							rules="required"
							:class="{ 'is-invalid': errors['地址'] }"
							v-model.trim="form.user.address"
						></Field>
						<ErrorMessage
							name="地址"
							class="invalid-feedback"
						></ErrorMessage>
					</div>

					<div class="mb-3">
						<label for="message" class="form-label">留言</label>
						<textarea
							name=""
							id="message"
							class="form-control"
							cols="30"
							rows="10"
							v-model.trim="form.message"
						></textarea>
					</div>
					<div class="text-end">
						<button type="submit" class="btn btn-danger">
							送出訂單
						</button>
					</div>
				</Form>
			</div>
		</div>
	</div>
</template>
