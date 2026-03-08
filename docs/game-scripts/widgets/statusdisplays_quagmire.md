---
id: statusdisplays_quagmire
title: Statusdisplays Quagmire
description: A UI widget container for managing status-related display elements in the Quagmire scenario.
tags: [ui, status, quagmire]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 87ff5c3c
system_scope: ui
---

# Statusdisplays Quagmire

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`StatusDisplays` is a UI widget class used exclusively in the Quagmire scenario to manage and control the visibility of status-related UI elements. It extends `Widget` and acts as a container for components such as health badges, crafting toggles, and mode-specific UI indicators. While the current implementation provides method stubs with empty bodies, the structure indicates intent to support dynamic toggling of UI states (e.g., ghost mode, crafting UI, status numbers) without modifying core widgets.

## Usage example
```lua
local owner = ThePlayer
local status_widget = StatusDisplays(owner)
status_widget:SetGhostMode(true)
status_widget:ToggleCrafting(true)
status_widget:HideStatusNumbers()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` (set via constructor) | The entity (typically the player) that owns this UI display. |
| `modetask` | `Task` or `nil` | `nil` | Internal task reference for mode transitions (unused in stubs). |
| `isghostmode` | `boolean` | `false` | Tracks whether ghost mode is active (set but not used in stubs). |
| `craft_hide` | `boolean` | `false` | Stores the last crafting hide state (set but not used in stubs). |
| `visiblemode` | `boolean` | `false` | Controls whether the initial `UpdateMode` call should be processed (set but not used in stubs). |

## Main functions
### `SetGhostMode(ghostmode)`
*   **Description:** Sets the ghost mode state for the display. This method is a stub and currently has no effect.
*   **Parameters:** `ghostmode` (boolean) — `true` to enable ghost mode, `false` to disable.
*   **Returns:** Nothing.

### `ToggleCrafting(hide)`
*   **Description:** Toggles the visibility of the crafting UI based on the `hide` flag. This method is a stub and currently has no effect.
*   **Parameters:** `hide` (boolean) — `true` to hide the crafting UI, `false` to show it.
*   **Returns:** Nothing.

### `ShowStatusNumbers()`
*   **Description:** Intended to make status numbers (e.g., health, sanity) visible. This method is a stub and currently has no effect.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HideStatusNumbers()`
*   **Description:** Intended to hide status numbers. This method is a stub and currently has no effect.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetResurrectButton()`
*   **Description:** Returns a reference to the resurrection button widget, if any. This stub always returns `nil`.
*   **Parameters:** None.
*   **Returns:** `nil` — no resurrect button is implemented in the current version.

## Events & listeners
Not applicable.