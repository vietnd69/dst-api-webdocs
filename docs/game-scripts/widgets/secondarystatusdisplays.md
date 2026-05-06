---
id: secondarystatusdisplays
title: SecondaryStatusDisplays
description: A UI widget that displays secondary status information for players, including upgrade module displays for WX-78 robots.
tags: [ui, widget, hud, wx78]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 0177c431
system_scope: ui
---

# SecondaryStatusDisplays

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`SecondaryStatusDisplays` is a HUD widget that mirrors `StatusDisplays` functionality but is aligned on the opposite side for splitscreen multiplayer. It primarily manages the display of upgrade modules for WX-78 robot characters, showing energy levels and module slots. The widget responds to player mode changes (ghost vs. player) and synchronizes with upgrade module events from the owning player entity.

## Usage example
```lua
local SecondaryStatusDisplays = require "widgets/secondarystatusdisplays"

-- Typically instantiated by the HUD system for a player
local owner = ThePlayer
local statusWidget = SecondaryStatusDisplays(owner)

-- Show or hide status numbers
statusWidget:ShowStatusNumbers()
statusWidget:HideStatusNumbers()

-- Toggle ghost mode (hides inventory and module displays)
statusWidget:SetGhostMode(true)

-- Update module energy levels
statusWidget:SetUpgradeModuleEnergyLevel(5, 3, false)
statusWidget:SetUpgradeModuleMaxEnergyLevel(10, 8)
```

## Dependencies & tags
**External dependencies:**
- `widgets/widget` -- base widget class inheritance
- `widgets/uianim` -- UI animation utilities
- `widgets/upgrademodulesdisplay` -- child widget for displaying upgrade modules

**Components used:**
None identified

**Tags:**
- `upgrademoduleowner` -- checked to determine if module display should be added

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns this HUD widget. |
| `column1` | number | `60` or `-60` | X position offset (60 for Player1, -60 for others). |
| `modetask` | task | `nil` | Scheduled task reference for mode switching. |
| `isghostmode` | boolean | `nil` | Whether the widget is in ghost mode (hides displays). |
| `side_inv` | widget | Widget instance | Child widget for side inventory display. |
| `upgrademodulesdisplay` | widget | `nil` | Child widget for upgrade modules display (WX-78 only). |

## Main functions
### `ShowStatusNumbers()`
* **Description:** Opens the upgrade modules display to show status numbers.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `HideStatusNumbers()`
* **Description:** Closes the upgrade modules display to hide status numbers.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Layout()`
* **Description:** Empty layout function, available for override or future implementation.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `AddModuleOwnerDisplay()`
* **Description:** Creates and adds the upgrade modules display child widget if the owner has the `upgrademoduleowner` tag. Initializes energy level and modules data.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner` is nil when calling `GetEnergyLevel()` or `GetModulesData()`.

### `HideModuleOwnerDisplay()`
* **Description:** Hides the upgrade modules display widget without removing it.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ShowModuleOwnerDisplay()`
* **Description:** Shows the upgrade modules display widget if it exists.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `UpdateModuleOwnerDisplayPosition()`
* **Description:** Adjusts the Y position of the upgrade modules display based on whether it is extended (7 slots vs 6 slots).
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetGhostMode(ghostmode)`
* **Description:** Toggles between ghost mode and player mode. Ghost mode hides side inventory and upgrade modules displays. Schedules a task to call `OnSetGhostMode` or `OnSetPlayerMode` after completion.
* **Parameters:**
  - `ghostmode` -- boolean, true for ghost mode, false for player mode
* **Returns:** None
* **Error states:** None

### `ModulesDirty(data)`
* **Description:** Handles module data changes by updating both this widget's display and the owner's HUD upgrade module widget.
* **Parameters:**
  - `data` -- table containing module data from `owner:GetModulesData()`
* **Returns:** None
* **Error states:** None

### `PopAllUpgradeModules()`
* **Description:** Removes all upgrade modules from the display and synchronizes with the owner's HUD widget.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetUpgradeModuleEnergyLevel(new_level, old_level, skipsound)`
* **Description:** Updates the current energy level display and synchronizes with the owner's HUD widget.
* **Parameters:**
  - `new_level` -- number, the new energy level value
  - `old_level` -- number, the previous energy level value
  - `skipsound` -- boolean, whether to skip the update sound effect
* **Returns:** None
* **Error states:** None

### `SetUpgradeModuleMaxEnergyLevel(new_level, old_level)`
* **Description:** Updates the maximum energy level display, synchronizes with the owner's HUD widget, and recalculates display position.
* **Parameters:**
  - `new_level` -- number, the new maximum energy level
  - `old_level` -- number, the previous maximum energy level
* **Returns:** None
* **Error states:** None

### `UpgradeModulesEnergyLevelDelta(data)`
* **Description:** Handles energy level update events by extracting level data and calling appropriate update functions for max level and current level changes.
* **Parameters:**
  - `data` -- table with fields `new_max_level`, `old_max_level`, `new_level`, `old_level` (all optional, default to 0 if nil)
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `upgrademodulesdirty` -- triggers `ModulesDirty()` when module data changes
- **Listens to:** `upgrademoduleowner_popallmodules` -- triggers `PopAllUpgradeModules()` when all modules are popped
- **Listens to:** `energylevelupdate` -- triggers `UpgradeModulesEnergyLevelDelta()` when energy levels change
- **Pushes:** None identified