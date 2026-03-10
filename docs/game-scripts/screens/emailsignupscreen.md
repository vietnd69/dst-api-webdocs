---
id: emailsignupscreen
title: Emailsignupscreen
description: Handles the email subscription sign-up UI flow, including email and birthdate input validation, and server submission via HTTP POST.
tags: [ui, network, form]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 7eeb7637
system_scope: ui
---

# Emailsignupscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`EmailSignupScreen` is a UI screen component that presents a form for users to subscribe to an email newsletter. It collects an email address and a birthdate (day, month, year), validates them, and submits the data to a server endpoint via `TheSim:QueryServer`. It manages a popup dialog during submission and displays success or failure messages afterward using the Redux UI system.

## Usage example
```lua
local EmailSignupScreen = require "screens/emailsignupscreen"
TheFrontEnd:PushScreen(EmailSignupScreen())
```

## Dependencies & tags
**Components used:** `nil` (uses widgets and global services only: `TheInput`, `TheFrontEnd`, `TheSim`, `STRINGS`, `GAME_SERVER`, `json`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxYear` | number | Current year | Maximum allowed year for birthdate (set to current year). |
| `minYear` | number | `maxYear - 130` | Minimum allowed year for birthdate (130 years ago). |
| `submitscreen` | widget? | `nil` | Reference to the currently active submission-progress popup dialog. |
| `email_edit` | widget? | `nil` | Reference to the email input field widget. |
| `monthSpinner`, `daySpinner`, `yearSpinner` | widget? | `nil` | References to the month, day, and year spinner widgets. |
| `bday_message`, `bday_label`, `email_edit_widg`, `dialog`, `root`, `top_root`, `black` | widget? | `nil` | UI widget references used to build the layout. |

## Main functions
### `OnControl(control, down)`
*   **Description:** Handles input control events (e.g., cancel button). Overrides base screen behavior to intercept `CONTROL_CANCEL` and force input routing to the email edit field when editing.
*   **Parameters:**  
    - `control` (number) — The control constant (e.g., `CONTROL_CANCEL`).  
    - `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
*   **Returns:** `boolean` — `true` if the event was handled, `false` otherwise.

### `Accept()`
*   **Description:** Triggers the save/submit process by calling `Save()`. Waits for asynchronous server response.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `Save()`
*   **Description:** Validates email and birthdate inputs, displays a submission-progress popup, and sends a POST request to the email subscription endpoint.  
*   **Parameters:** None.  
*   **Returns:** `boolean` — `true` if validation passed and submission started; `false` if validation failed.  
*   **Error states:** If email or birthdate is invalid, displays an error popup and returns `false`.

### `OnPostComplete(result, isSuccessful, resultCode)`
*   **Description:** Callback for the server query response. Closes the submission popup and displays a success or failure dialog based on `resultCode`.
*   **Parameters:**  
    - `result` (any) — Raw server response data.  
    - `isSuccessful` (boolean) — Whether the HTTP request completed without network error.  
    - `resultCode` (number) — HTTP status code (e.g., `200`).  
*   **Returns:** Nothing.

### `OnSubmitCancel()`
*   **Description:** Handles user cancellation of the submission popup. Closes the popup and clears `submitscreen`.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `IsValidEmail(email)`
*   **Description:** Validates email format using a simple regex pattern. Allows any `@`-domain structure.
*   **Parameters:**  
    - `email` (string) — The email string to validate.  
*   **Returns:** `boolean` — `true` if format matches pattern, `false` otherwise.

### `IsValidBirthdate(day, month, year)`
*   **Description:** Validates the selected birthdate components (day, month, year).
*   **Parameters:**  
    - `day` (number) — Selected day (1–31).  
    - `month` (number) — Selected month (1–12).  
    - `year` (number) — Selected year (must be ≥ `minYear` and ≤ `maxYear - MIN_AGE`, where `MIN_AGE = 3`).  
*   **Returns:** `boolean` — `true` if valid, `false` otherwise.

### `Close()`
*   **Description:** Closes the screen and re-enables debug toggle input.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `DoInit()`
*   **Description:** Initializes the UI layout, spinners, labels, and widgets. Sets up focus traversal, default values (current date), and validation constraints.
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `nil` (screen does not fire custom events; relies on dialog callbacks).  
- **Listens to:** `nil` (no explicit event listeners via `inst:ListenForEvent`).