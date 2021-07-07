<script>
export default {
	inject: ["httpMsg"],
	data() {
		return {
			user: {
				email: "",
				password: "",
			},
		};
	},
	methods: {
		async signIn() {
			const url = `${process.env.VUE_APP_APIURL}/admin/signin`;
			const { email, password } = this.user;
			const obj = { username: email, password };
			try {
				const results = await this.axios.post(url, obj);
				const { expired, success, token, message } = results.data;
				if (!success) throw new Error(message);
				document.cookie = `token=${token};expires=${new Date(expired)}`;
				this.httpMsg(true, "登入成功");
				this.$router.push("/admin/products");
			} catch (err) {
				this.httpMsg(false, "登入");
			}
		},
	},
};
</script>

<template>
	<div class="container mt-5">
		<form class="row justify-content-center" @submit.prevent="signIn">
			<div class="col-md-6">
				<h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
				<div class="mb-2">
					<label for="inputEmail" class="sr-only"
						>Email address</label
					>
					<input
						type="email"
						id="inputEmail"
						class="form-control"
						placeholder="Email address"
						required
						autofocus
						v-model.trim="user.email"
					/>
				</div>
				<div class="mb-2">
					<label for="inputPassword" class="sr-only">Password</label>
					<input
						type="password"
						id="inputPassword"
						class="form-control"
						placeholder="Password"
						required
						v-model.trim="user.password"
					/>
				</div>

				<div class="text-end mt-4">
					<button
						class="btn btn-lg btn-primary btn-block"
						type="submit"
					>
						登入
					</button>
				</div>
			</div>
		</form>
	</div>
</template>
