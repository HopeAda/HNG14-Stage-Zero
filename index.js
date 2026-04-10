const checkbox = document.querySelector("input.check");
const title = document.querySelector(".title");
const priorityBadge = document.querySelector(".priority");
const description = document.querySelector(".desc");
const timeCont = document.querySelector(".time time");
const remainingTime = document.querySelector(".time_remaining span");
const statusBadge = document.querySelector(".status");
const editButton = document.querySelector(".edit");
const deleteButton = document.querySelector(".delete");

let taskInfo = {
	title: "Complete Stage 0 Task",
	desc: "Code a modern todo / task card component with semantic html tags, screen reader accessible elements and time remaining indicator",
	priority: "high",
	status: "pending",
	"due-date": new Date(Date.now() + 300000), //5 minutes from current time
	complete: false,
};

function buildComponent() {
	checkbox.checked = taskInfo.complete;
	title.textContent = taskInfo.title;
	description.textContent = taskInfo.desc;
	statusBadge.textContent = taskInfo.status;
	statusBadge.className = `status badge ${taskInfo.status == "in progress" ? "progress" : taskInfo.status.toLowerCase()}`;
	priorityBadge.textContent = taskInfo.priority;
	priorityBadge.className = `priority badge ${taskInfo.priority}`;
	timeCont.setAttribute("datetime", taskInfo["due-date"].toISOString());
	timeCont.textContent = taskInfo["due-date"].toLocaleDateString("en-US", {
		day: "numeric",
		year: "numeric",
		month: "long",
		hour: "2-digit",
		minute: "2-digit",
	});
}

buildComponent();

// Toggle checkbox
checkbox.addEventListener("change", (event) => {
	taskInfo.complete = checkbox.checked;

	if (taskInfo.complete) {
		taskInfo.status = "Done";
		clearInterval(timer);
		checkRemaining();
	} else {
		taskInfo.status = "in progress";
		timer = setInterval(checkRemaining, 60000);
		checkRemaining();
	}
	buildComponent();
});

title.addEventListener("click", () => {
	checkbox.click();
});

statusBadge.addEventListener("click", () => {
	if (taskInfo.status == "pending") {
		taskInfo.status = "in progress";
		buildComponent();
	}
});

function updateTimerMsg(timeRemaining) {
	let msg, amount, unit;
	let units = ["day", "hour", "minute"];

	for (let i = 0; i < timeRemaining.length - 1; i++) {
		if (timeRemaining[i] != 0) {
			amount = timeRemaining[i];
			unit = units[i];
			break;
		}
		amount = 0;
	}

	if (amount == 0) {
		msg = "Due now!";
	} else if (!timeRemaining[3]) {
		msg = `Overdue by ${amount} ${unit}${amount == 1 ? "" : "s"}`;
	} else {
		msg =
			amount == 1 && unit == "day"
				? "Due Tomorrow"
				: `Due in ${amount} ${unit}${amount == 1 ? "" : "s"}`;
	}

	if (!timeRemaining[3]) {
		remainingTime.style.color =
			amount == 0 ? "var(--text-secondary)" : "#d91b24";
	} else {
		remainingTime.style.color = "var(--text-secondary)";
	}

	remainingTime.textContent = msg;
}

function checkRemaining() {
	if (taskInfo.complete) {
		remainingTime.parentElement.style.display = "none";
		return;
	} else {
		remainingTime.parentElement.style.display = "flex";
	}

	let diff = taskInfo["due-date"] - Date.now();
	let timeDiff = Math.abs(diff);
	let oneDay = 1000 * 24 * 60 * 60;
	let days = Math.floor(timeDiff / oneDay);
	let hours = Math.floor((timeDiff % oneDay) / (1000 * 60 * 60));
	let minutes = Math.floor((timeDiff % (oneDay / 24)) / (1000 * 60));

	let timeLeft = [days, hours, minutes, diff > 0];

	updateTimerMsg(timeLeft);
}
checkRemaining();

let timer = setInterval(checkRemaining, 60000);

editButton.addEventListener("click", () => {
	alert("Edit Button Clicked!");
});

deleteButton.addEventListener("click", () => {
	alert("Delete Button Clicked!");
});
