---
id: quagmire_recipebookscreen
title: Quagmire Recipebookscreen
description: Renders the Quagmire festival recipe book UI, overlaying the minimap interface and repurposing map control logic for book navigation.
tags: [ui, festival, recipe, map]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 0eabf73b
system_scope: ui
---

# Quagmire Recipebookscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`QuagmireRecipeBookScreen` is a specialized UI screen that displays the Quagmire festival recipe book. It extends `Screen` and repurposes the map-screen infrastructure — including minimap controls and camera interaction — to host and navigate the `QuagmireBookWidget`. Although it hijacks the map-screen flow, it suppresses standard map functionality (e.g., rotation, zoom, and pause buttons), customizing the HUD layout for recipe browsing during the Quagmire event.

## Usage example
The screen is instantiated and pushed to the front-end when entering the Quagmire recipe book menu. A typical invocation (from within DST code) is:

```lua
local QuagmireRecipeBookScreen = require "screens/quagmire_recipebookscreen"
TheFrontEnd:PushScreen(QuagmireRecipeBookScreen(ThePlayer))
```

## Dependencies & tags
**Components used:** `playercontroller` (via `ThePlayer.components.playercontroller`), `hud` (via `owner.HUD.inst`).
**Tags:** None identified.

## Properties
No public properties are explicitly initialized or exposed.

## Main functions
### `OnControl(control, down)`
* **Description:** Handles input events for screen navigation and map-related controls. Overrides parent `Screen` behavior to support closing on cancel/back and intercepting map control inputs (currently disabled in code, but historically used for rotation/zoom).
* **Parameters:**  
  `control` (number) — Input control identifier (e.g., `CONTROL_CANCEL`, `CONTROL_ROTATE_LEFT`).  
  `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the event was handled and should be consumed; `false` otherwise.
* **Error states:** Returns `false` unconditionally after the commented-out legacy block, ensuring no unintended map control side effects.

### `GetHelpText()`
* **Description:** Constructs and returns the localized help text displayed in the HUD, indicating the back/cancel control.
* **Parameters:** None.
* **Returns:** `string` — Localized help string (e.g., `"B  Back"`).

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active. Calls parent method; minimap visibility toggle is commented out and unused.

### `OnBecomeInactive()`
* **Description:** Called when the screen is no longer active. Calls parent method; minimap visibility toggle is commented out and unused.

## Events & listeners
- **Listens to:**  
  `"refreshhudsize"` — On `owner.HUD.inst`, updates the bottom-right HUD scale container when the HUD size changes.