const checkbox = document.querySelector("input.check");
const title = document.querySelector(".title");
const priorityBadge = document.querySelector(".priority");
const description = document.querySelector(".desc");
const timeCont = document.querySelector(".time time");
const remainingTime = document.querySelector(".time_remaining span");
const statusBadge = document.querySelector(".status");
const editButton = document.querySelector(".edit");
const deleteButton = document.querySelector(".delete");

var taskInfo = {
	title: "Complete Stage 0 Task",
	desc: "Code a modern todo / task card component with semantic html tags, screen reader accessible elements and time remaining indicator",
	priority: "high",
	status: "pending",
	"due-date": new Date("2026-04-11T00:00:00"),
	complete: false,
};

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

// Toggle checkbox
checkbox.addEventListener("change", (event) => {
	taskInfo.complete = !taskInfo.complete;
	event.target.checked = taskInfo.complete;

	if (event.target.checked) {
		taskInfo.status = "Done";
	} else {
		taskInfo.status = "in progress";
	}
	statusBadge.textContent = taskInfo.status;
	statusBadge.className = `status badge ${taskInfo.status == "in progress" ? "progress" : taskInfo.status.toLowerCase()}`;

	checkRemaining();
});

statusBadge.addEventListener("click", () => {
	if (statusBadge.textContent == "pending") {
		taskInfo.status = "in progress";
		statusBadge.textContent = taskInfo.status;
		statusBadge.className = `status badge ${taskInfo.status == "in progress" ? "progress" : taskInfo.status.toLowerCase()}`;
	}
});

function checkRemaining() {
	if (taskInfo.complete) {
		remainingTime.parentElement.style.display = "none";
	} else {
		remainingTime.parentElement.style.display = "flex";

		// Calculate remaining time
		var differenceInMs = taskInfo["due-date"] - Date.now();

		if (differenceInMs < 0) {
			var daysremaining = Math.ceil(
				differenceInMs / (1000 * 60 * 60 * 24),
			);
			var hoursRemaining = Math.ceil(differenceInMs / (1000 * 60 * 60));
			var minutesRemaining = Math.ceil(differenceInMs / (1000 * 60));
		} else {
			var daysremaining = Math.floor(
				differenceInMs / (1000 * 60 * 60 * 24),
			);
			var hoursRemaining = Math.floor(differenceInMs / (1000 * 60 * 60));
			var minutesRemaining = Math.floor(differenceInMs / (1000 * 60));
		}

		var timeLeft = [daysremaining, hoursRemaining, minutesRemaining];

		var dueDateMsg;

		if (
			Math.abs(daysremaining) == 0 &&
			Math.abs(hoursRemaining) == 0 &&
			Math.abs(minutesRemaining) == 0
		) {
			dueDateMsg = "Due now!";
		} else {
			for (var i = 0; i < timeLeft.length; i++) {
				var units = ["day", "hour", "minute"];

				if (timeLeft[i] !== 0) {
					if (timeLeft[i] < 0) {
						dueDateMsg = `Overdue by ${Math.abs(timeLeft[i])} ${units[i]}${Math.abs(timeLeft[i]) == 1 ? "" : "s"}`;
						remainingTime.style.color = "#d91b24";
					} else {
						dueDateMsg = `Due in ${timeLeft[i]} ${units[i]}${Math.abs(timeLeft[i]) == 1 ? "" : "s"}`;
						remainingTime.style.color = "var(--text-secondary)";
					}
					break;
				}
			}

			if (dueDateMsg == "Due in 1 day") {
				dueDateMsg = "Due tomorrow";
			}
		}

		remainingTime.textContent = dueDateMsg;
	}
}

checkRemaining();

editButton.addEventListener("click", () => {
	alert("Edit Button Clicked!");
});

deleteButton.addEventListener("click", () => {
	alert("Delete Button Clicked!");
});
