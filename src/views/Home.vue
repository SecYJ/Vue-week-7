<template>
	<div id="nav">
		<router-link to="/">首页</router-link> |
		<router-link to="/products">前台產品列表</router-link> |
		<router-link to="/cart">前台購物車列表</router-link> |
		<router-link to="/admin/products">後台購物車列表</router-link> |
	</div>
	<router-view></router-view>
</template>
