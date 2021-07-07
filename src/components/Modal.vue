<script>
import Modal from "bootstrap/js/dist/modal.js";

export default {
	emits: ["addToCart"],
	props: {
		product: {
			type: Object,
		},
	},
	data() {
		return {
			modal: "",
			modalCartQty: 1,
		};
	},
	methods: {
		openModal() {
			this.modalCartQty = 1;
			this.modal.show();
		},
		closeModal() {
			this.modal.hide();
		},
		modalAddToCart(product) {
			this.$emit("addToCart", { ...product, qty: this.modalCartQty });
			this.closeModal();
		},
	},
	mounted() {
		this.modal = new Modal(this.$refs.modal, {
			backdrop: "static",
		});
	},
	watch: {},
};
</script>

<template>
	<div
		class="modal fade"
		id="productModal"
		tabindex="-1"
		role="dialog"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true"
		ref="modal"
	>
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content border-0">
				<div class="modal-header bg-dark text-white">
					<h5 class="modal-title" id="exampleModalLabel">
						<span>{{ product.title }}</span>
					</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
						@click.prevent="modalClose"
					></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-sm-6">
							<img class="img-fluid" :src="product.imageUrl" />
						</div>
						<div class="col-sm-6">
							<span class="badge bg-primary rounded-pill">{{
								product.category
							}}</span>
							<p>商品描述：{{ product.description }}</p>
							<p>商品內容：{{ product.content }}</p>
							<div class="h5"></div>
							<del class="h6"
								>原價 {{ product.origin_price }} 元</del
							>
							<div class="h5">
								現在只要 {{ product.price }} 元
							</div>
							<div>
								<div class="input-group">
									<input
										type="number"
										class="form-control"
										min="1"
										v-model.number="modalCartQty"
									/>
									<button
										type="button"
										class="btn btn-primary"
										@click.prevent="modalAddToCart(product)"
									>
										加入購物車
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
