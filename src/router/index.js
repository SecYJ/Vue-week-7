import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
		children: [
			{
				path: "",
				component: () => import("@/views/Main.vue"),
			},
			{
				path: "products",
				component: () => import("@/views/Products.vue"),
			},
			{
				path: "cart",
				component: () => import("@/views/Cart.vue"),
			},
			{
				path: "checkout/:id",
				component: () => import("@/views/Checkout.vue"),
			},
		],
	},
	{
		path: "/admin",
		component: () => import("@/views/backstage/Admin.vue"),
		children: [
			{
				path: "products",
				component: () => import("@/views/backstage/Products.vue"),
			},
			{
				path: "order",
				component: () => import("@/views/backstage/Order.vue"),
			},
			{
				path: "coupons",
				component: () => import("@/views/backstage/Coupons.vue"),
			},
		],
	},
	{
		path: "/login",
		component: () => import("@/views/Login.vue"),
	},
	{
		path: "/:pathMatch(.*)*",
		component: () => import("@/views/NotFound.vue"),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
