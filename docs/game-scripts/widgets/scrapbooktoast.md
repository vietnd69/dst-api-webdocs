---
id: scrapbooktoast
title: ScrapbookToast
description: Manages the visual toast notification for new scrapbook entries, displaying a clickable icon in the HUD when the scrapbook is updated.
tags: [hud, notification, ui]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 45be19d2
system_scope: ui
---

# ScrapbookToast

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ScrapbookToast` is a UI widget component responsible for presenting a dynamic notification when the player's scrapbook receives a new entry. It controls the visibility and behavior of a toast icon (`tab_gift`) that appears in the HUD, plays a sound, and launches the scrapbook screen when clicked. The component integrates with the player HUD, global profile settings, and HUD focus state to conditionally show or hide the notification.

## Usage example
```lua
-- Typically instantiated by the HUD system:
local toast = ScrapbookToast(ThePlayer, ThePlayer.HUD:GetControls())
-- The component listens for "scrapbookupdated" events and updates automatically.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `controls` | table | `nil` | Reference to the parent HUD controls manager, used to show/hide the toast via `ManageToast`. |
| `owner` | entity | `nil` | The entity (player) that owns this toast instance. |
| `tab_gift` | UIAnimButton | `nil` | The interactive button widget representing the toast icon. |
| `hasnewupdate` | boolean | `false` | Flag indicating whether a new scrapbook entry is pending notification. |
| `controller_hide` | boolean | `false` | When `true`, hides the toast due to controller mode. |
| `craft_hide` | boolean | `false` | When `true`, hides the toast while crafting UI is active. |
| `opened` | boolean | `false` | Tracks whether the toast is currently shown. |
| `hud_focus` | boolean | `owner.HUD.focus` | Reflects the HUD focus state (e.g., inventory open). |
| `shownotification` | boolean | `Profile:GetScrapbookHudDisplay()` | Controls whether the toast should be shown based on user profile settings. |

## Main functions
### `UpdateElements()`
* **Description:** Checks internal state (`hasnewupdate`, `controller_hide`, `craft_hide`, `shownotification`) and toggles the toast visibility accordingly. If a new update is pending, it shows the toast, plays the scrapbook dropdown sound, starts the `pre` animation on `tab_gift`, and marks the toast as opened.
* **Parameters:** None.
* **Returns:** Nothing.

### `ToggleHUDFocus(focus)`
* **Description:** Updates the `hud_focus` property to reflect whether the HUD is currently focused (e.g., inventory or menu active). Used to adjust toast behavior based on context.  
* **Parameters:** `focus` (boolean) — whether the HUD has focus.
* **Returns:** Nothing.

### `ToggleController(hide)`
* **Description:** Sets the `controller_hide` flag. When `true`, prevents the toast from showing during controller navigation. Calls `UpdateElements()` to apply the change.  
* **Parameters:** `hide` (boolean) — if `true`, hides the toast for controller input.
* **Returns:** Nothing.

### `ToggleCrafting(hide)`
* **Description:** Sets the `craft_hide` flag. When `true`, suppresses toast visibility during crafting UI activity. Calls `UpdateElements()` to apply the change.  
* **Parameters:** `hide` (boolean) — if `true`, hides the toast while crafting.
* **Returns:** Nothing.

### `CheckControl(control, down)`
* **Description:** Handles direct control input (e.g., keyboard shortcuts) to open the scrapbook. Returns `true` if the control was consumed.  
* **Parameters:**  
  - `control` (number) — the control code (e.g., `CONTROL_INSPECT_SELF`).  
  - `down` (boolean) — whether the control key was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the control matches `CONTROL_INSPECT_SELF` and `down` is `true`; otherwise `nil`.
* **Error states:** Returns `nil` if the toast is not visible (`self.shown` is falsy) or the control does not match.

## Events & listeners
- **Listens to:**  
  - `scrapbookupdated` (on `ThePlayer`) — sets `hasnewupdate = true` and calls `UpdateElements()`.  
  - `continuefrompause` (on `TheWorld`) — refreshes `shownotification` from `Profile:GetScrapbookHudDisplay()` and calls `UpdateElements()`.  
  - `scrapbookopened` (on `ThePlayer`) — sets `hasnewupdate = false`, hides `tab_gift`, and calls `ManageToast(..., true)` if the toast was previously opened.  
  - `animover` (on `tab_gift.inst`) — plays the `idle` animation automatically when the `pre` animation completes.  
- **Pushes:**  
  - `ScrapbookToast` does not fire any custom events.