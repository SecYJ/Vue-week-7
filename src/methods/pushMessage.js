import emitter from "@/methods/emitter.js";

const message = (success, title = "更新") => {
	if (success) {
		emitter.emit("pushMsg", {
			title,
			style: "success",
		});
	} else {
		emitter.emit("pushMsg", {
			title: ` ${title}结果失败`,
			style: "danger",
			content: `${title}失败`,
		});
	}
};

export default message;
