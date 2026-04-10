# HNG Stage 0 — Todo Card Component

A clean, accessible, and responsive todo task card built with semantic HTML, vanilla CSS, and vanilla JavaScript. Built as part of the HNG Frontend internship Stage 0 task.

---

## Live Demo

> https://hng-14-stage-zero.vercel.app/

---

## Features

- Fully semantic HTML structure using `<article>`, `<time>`, `<ul>`, and `<button>`
- Live countdown timer that updates every 60 seconds
- Checkbox toggle that marks the task as complete, strikes through the title, and updates the status badge
- Priority badge with three levels — Low, Medium, and High — each with a distinct colour
- Status badge with three states — Pending, In Progress, and Done
- Tag/category chips
- Edit and Delete action buttons with keyboard focus support
- Fully accessible — screen reader labels, visible focus rings, and ARIA attributes where needed
- Responsive layout from 320px to 1200px

---

## File Structure

```
├── index.html       # Markup and component structure
├── styles.css       # All styling and CSS variables
└── index.js         # Component logic and interactivity
```

---

## How It Works

### HTML (`index.html`)

The card is built as an `<article>` element — the correct semantic choice for a self-contained piece of content. Inside it:

- A visually hidden `<label>` is linked to the checkbox via `for`/`id`, giving screen readers a proper accessible name without showing visible text
- The task title uses `<h2>` for correct heading hierarchy
- The due date uses a `<time>` element with a `datetime="2026-04-16"` attribute so browsers, search engines, and assistive technology can read the date in a machine-readable format, while the visible text stays human-friendly
- Tags are marked up as a `<ul role="list">` of `<li>` elements
- Action buttons are real `<button>` elements with `aria-label` attributes so icon-only buttons have accessible names

Every interactive element has a `data-testid` attribute for automated testing.

### CSS (`styles.css`)

All colours are defined as CSS custom properties in `:root`, organised into groups:

```css
/* backgrounds */   --bg-base, --bg-page, --bg-card, --bg-elevated, --bg-hover
/* text */          --text-primary, --text-secondary, --muted
/* borders */       --border, --border-hover, --accent
/* priority */      --priority-{low|med|high}-{bg|text}
/* status */        --status-{pending|progress|done}-{bg|text}
```

Priority and status colours are applied via CSS classes (`.low`, `.med`, `.high`, `.pending`, `.progress`, `.done`) which JavaScript adds and removes dynamically. This keeps styling concerns in CSS and logic concerns in JS.

Focus styles use `:focus-visible` so keyboard users get a clear outline while mouse users are not affected.

Responsive layout is handled with three breakpoints — full width on mobile, 90% width from 500px, and a capped `max-width: 500px` centred on desktop from 768px.

### JavaScript (`index.js`)

All task data is stored in a single `taskInfo` object:

```js
let taskInfo = {
	title: "Complete Stage 0 Task",
	desc: "...",
	priority: "high",
	status: "pending",
	"due-date": new Date(Date.now() + 300000),
	complete: false,
};
```

This is the single source of truth — the DOM always reflects `taskInfo`, never the other way around.

#### `buildComponent()`

Reads from `taskInfo` and updates all DOM elements — title, description, status badge, priority badge, due date, and checkbox state. Called once on page load and again whenever `taskInfo` changes.

#### `checkRemaining()`

Calculates the time remaining until the due date. It uses the modulo operator to break `diff` into true components:

```js
let days = Math.floor(timeDiff / oneDay);
let hours = Math.floor((timeDiff % oneDay) / (1000 * 60 * 60));
let minutes = Math.floor((timeDiff % (oneDay / 24)) / (1000 * 60));
```

This ensures hours never exceed 23 and minutes never exceed 59 — they are real components of the remaining time, not the total duration converted to each unit.

The result is passed as `[days, hours, minutes, isUpcoming]` to `updateTimerMsg()`.

`checkRemaining` runs immediately on load, then on an interval every 60 seconds. The interval is cleared when the task is marked complete and restarted if it is unchecked.

#### `updateTimerMsg(timeRemaining)`

Takes the time array and produces the appropriate message:

| Condition           | Message                           |
| ------------------- | --------------------------------- |
| All values are zero | `Due now!`                        |
| Overdue             | `Overdue by X days/hours/minutes` |
| 1 day remaining     | `Due Tomorrow`                    |
| Future              | `Due in X days/hours/minutes`     |

Overdue tasks also change the time remaining text colour to red.

#### Checkbox toggle

When the checkbox changes, `taskInfo.complete` is set to `checkbox.checked` (reading directly from the input as the source of truth). If complete, the status is set to `"Done"` and the timer is cleared. If unchecked, the status returns to `"In Progress"` and the timer restarts. `buildComponent()` and `checkRemaining()` are called to sync the UI.

The task title also responds to click events and triggers the checkbox, making the entire title a clickable toggle target.

---

## Accessibility

| Feature             | Implementation                                                 |
| ------------------- | -------------------------------------------------------------- |
| Checkbox label      | Visually hidden `<label>` linked via `for`/`id`                |
| Icon buttons        | `aria-label` on each `<button>`                                |
| Focus styles        | `:focus-visible` outline using `--accent` colour               |
| Live region         | `data-testid="test-todo-time-remaining"` span updates in place |
| Semantic structure  | `<article>`, `<h2>`, `<time>`, `<ul role="list">`, `<button>`  |
| Keyboard navigation | Tab → checkbox → edit button → delete button                   |

---

## Colour Palette

The project uses a dark mode palette designed for WCAG AA contrast compliance.

| Token                    | Value     | Usage                        |
| ------------------------ | --------- | ---------------------------- |
| `--bg-page`              | `#111111` | Page background              |
| `--bg-base`              | `#0a0a0a` | Card background              |
| `--accent`               | `#7f77dd` | Focus rings, icons, checkbox |
| `--priority-high-text`   | `#f87171` | High priority label          |
| `--priority-med-text`    | `#fbbf24` | Medium priority label        |
| `--priority-low-text`    | `#4ade80` | Low priority label           |
| `--status-progress-text` | `#afa9ec` | In Progress badge            |
| `--status-done-text`     | `#5dcaa5` | Done badge                   |

---

## Testing

All interactive elements include `data-testid` attributes for automated test runners:

| Element        | `data-testid`               |
| -------------- | --------------------------- |
| Card root      | `test-todo-card`            |
| Title          | `test-todo-title`           |
| Description    | `test-todo-description`     |
| Priority badge | `test-todo-priority`        |
| Due date       | `test-todo-due-date`        |
| Time remaining | `test-todo-time-remaining`  |
| Status badge   | `test-todo-status`          |
| Checkbox       | `test-todo-complete-toggle` |
| Tags list      | `test-todo-tags`            |
| Work tag       | `test-todo-tag-work`        |
| Urgent tag     | `test-todo-tag-urgent`      |
| Edit button    | `test-todo-edit-button`     |
| Delete button  | `test-todo-delete-button`   |

---

## Author

> HopeAda
