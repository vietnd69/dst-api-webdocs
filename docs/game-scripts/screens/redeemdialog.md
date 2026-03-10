---
id: redeemdialog
title: Redeemdialog
description: Displays a UI dialog for entering and submitting product redemption codes, handling validation, server submission, and displaying results.
tags: [ui, code, redemption]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: aa98fa17
system_scope: ui
---

# Redeemdialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`RedeemDialog` is a UI screen that presents an interface for users to enter product redemption codes (e.g., for bonuses or promotional items). It manages multiple text entry fields (5 groups of 4 characters by default, with console-specific adjustments), validates input against allowed characters, normalizes common substitutions (e.g., `i`→`1`, `o`→`0`), constructs the full code, and submits it to the server via `TheItems:RedeemCode`. It also displays appropriate success/failure feedback and transitions to a `ThankYouPopup` on success.

## Usage example
```lua
local RedeemDialog = require "screens/redeemdialog"
local dialog = RedeemDialog()
TheFrontEnd:PushScreen(dialog)
```

## Dependencies & tags
**Components used:** None (screen-only; no entity component usage)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `letterbox` | Widget | — | Foreground letterbox frame (from template). |
| `root` | Widget | — | Root container widget for screen layout. |
| `bg` | Widget | — | Background container (bright menu background). |
| `kit_puppet` | KitcoonPuppet | — | Animated puppet display in the dialog. |
| `dialog` | Widget | — | Main dialog container (curly window template). |
| `proot` | Widget | — | Parent widget for content area (positioned below dialog title). |
| `title` | Text | — | Title text element (same as `dialog.title`). |
| `text` | Text | — | Body text element for server responses or error messages. |
| `fineprint` | Text | — | Legal/boilerplate text (centered, wrapped). |
| `entrybox` | Widget | — | Container for individual text entry fields. |
| `redeem_in_progress` | boolean | `false` | Flag indicating a server request is pending. |
| `firsttime` | boolean | `true` | Tracks whether the screen is being shown for the first time (for focus logic). |
| `buttons` | table | — | Table of button definitions (only on non-console builds). |
| `submit_btn` | Widget | — | Submit button widget reference. |

## Main functions
### `MakeTextEntryBox(parent)`
* **Description:** Constructs and configures the text entry fields (5 groups of 4 characters by default). Sets up character filtering, visual focus states, text normalization, and keyboard navigation between fields. Handles console-specific differences (single text field, hyphen inclusion).
* **Parameters:** `parent` (Widget) — The parent widget to attach the entrybox container to.
* **Returns:** Nothing.
* **Error states:** None identified.

### `OnBecomeActive()`
* **Description:** Activates the screen, sets focus to the first entry field, enables editing, and activates the `kit_puppet` animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Deactivates the screen, disables the `kit_puppet` animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `DisplayResult(success, status, item_type, currency, currency_amt, category, message)`
* **Description:** Processes the server's response to a code redemption attempt. On success, clears inputs, hides title, and pushes a `ThankYouPopup`. On failure, displays localized error message in the body text.
* **Parameters:**
  * `success` (boolean) — Whether the request succeeded.
  * `status` (string) — Server status code (e.g., `"ACCEPTED"`, `"INVALID_CODE"`, `"ALREADY_REDEEMED"`, `"FAILED_TO_CONTACT"`).
  * `item_type` (string) — Type of item (if applicable).
  * `currency` (string) — Currency name (if applicable).
  * `currency_amt` (number) — Currency amount (if applicable).
  * `category` (string) — Gift category (e.g., `"early_access"`).
  * `message` (string) — Server-provided message.
* **Returns:** Nothing.

### `DoSubmitCode()`
* **Description:** Triggers submission of the first entry box’s contents, which in turn constructs the full code and invokes the server redeem endpoint.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Closes the dialog by fading the front end back to the previous screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRawKey(key, down)`
* **Description:** Handles raw keyboard input, including paste events. Supports pasting full-length codes (e.g., from clipboard) and splitting them across entry boxes.
* **Parameters:**
  * `key` (string/enum) — The raw key identifier.
  * `down` (boolean) — Whether the key was pressed (`true`) or released (`false`).
* **Returns:** `true` if the key event was handled, otherwise `false`.

### `OnControl(control, down)`
* **Description:** Handles control events (e.g., menu/cancel buttons). Triggers cancel callback if appropriate; on console, closes the screen.
* **Parameters:**
  * `control` (enum) — The control identifier.
  * `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if handled, otherwise `false`.

### `GetHelpText()`
* **Description:** Returns localized help text describing available controls (e.g., "ESC to close").
* **Parameters:** None.
* **Returns:** `string` — Concatenated help strings for display.

## Events & listeners
- **Listens to:** None (no events registered via `inst:ListenForEvent`).
- **Pushes:** None (no events fired via `inst:PushEvent`).