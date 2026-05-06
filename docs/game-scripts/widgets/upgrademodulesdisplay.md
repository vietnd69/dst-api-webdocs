---
id: upgrademodulesdisplay
title: Upgrademodulesdisplay
description: UI widget that displays WX-78's upgrade module slots, energy levels, and circuit chip status.
tags: [ui, widget, wx78]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 926a91d8
system_scope: ui
---

# Upgrademodulesdisplay

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`UpgradeModulesDisplay` is a UI widget that renders WX-78's upgrade module interface, showing energy capacity, current charge level, and installed circuit chips. It extends the base `Widget` class and manages animated UI elements for module bars, chip slots, and cooldown indicators. The widget responds to energy changes, module additions/removals, and ability cooldowns from the `wx78_abilitycooldowns` component.

## Usage example
```lua
local UpgradeModulesDisplay = require "widgets/upgrademodulesdisplay"

-- Create the widget attached to a WX-78 player instance
local owner = ThePlayer
local display = UpgradeModulesDisplay(owner, false)

-- Update energy levels when they change
display:UpdateMaxEnergy(7, 5)
display:UpdateEnergyLevel(6, 5, false)

-- Handle module changes
display:OnModuleAdded(CIRCUIT_BARS.ALPHA, module_def_index)

-- Open/close the expanded view
display:Open()
display:Close()
```

## Dependencies & tags
**External dependencies:**
- `widgets/uianim` -- UIAnim widget for animated elements
- `widgets/widget` -- Widget base class
- `wx78_moduledefs` -- Module definition lookup via GetModuleDefinitionFromNetID

**Components used:**
- `wx78_abilitycooldowns` -- accessed in OnUpdate() to retrieve ability cooldown percentages for chip displays

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The WX-78 character entity that owns this display. |
| `max_energy` | number | `owner:GetMaxEnergy()` | Maximum energy capacity for module slots. |
| `energy_level` | number | `max_energy` | Current energy charge level. |
| `module_bars` | table | `{}` | Array of UIAnim elements for each module bar frame. |
| `chip_objectpools` | table | `{}` | Nested tables containing chip UI objects per bar type. |
| `chip_poolindexes` | table | `{}` | Tracks the next available chip slot index per bar type. |
| `chip_slotsinuse` | table | `{}` | Tracks number of slots currently used per bar type. |
| `focus_box` | Image | `nil` | Invisible focus highlight box that triggers open/close on focus. |
| `open` | boolean | `nil` | Whether the display is in expanded/open state. |
| `is_upgrade_modules_display_hidden` | boolean | `nil` | Whether the display is hidden off-screen. |
| `original_pos` | Vector3 | `nil` | Stored position before hiding for restore. |

## Main functions
### `UpgradeModulesDisplay(owner, reversed)`
* **Description:** Constructor that initializes the upgrade modules display widget. Creates all UI elements for energy bars, module frames, and chip slots. Sets up focus box handlers and starts the update loop.
* **Parameters:**
  - `owner` -- WX-78 character entity that owns this display
  - `reversed` -- boolean for layout direction (currently unused, commented out)
* **Returns:** UpgradeModulesDisplay instance
* **Error states:** Errors if `owner` is nil when `owner:GetMaxEnergy()` is called -- no nil guard present.

### `IsExtended()`
* **Description:** Checks if the display should use extended layout based on energy capacity.
* **Parameters:** None
* **Returns:** `true` if `max_energy >= 7`, `false` otherwise.

### `UpdateSlotCount()`
* **Description:** Updates focus box scale and switches between normal and extended frame animations for battery and module bars.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `UpdateChipCharges(plugging_in)`
* **Description:** Updates chip power state animations based on current energy level. Plays on/off animations and sounds when chips gain or lose power.
* **Parameters:** `plugging_in` -- boolean indicating if modules are being plugged in (affects animation behavior)
* **Returns:** None
* **Error states:** None

### `UpdateMaxEnergy(new_level, old_level)`
* **Description:** Updates the maximum energy capacity display. Shows/hides energy slot animations and removes excess modules if new max is lower than current usage.
* **Parameters:**
  - `new_level` -- new maximum energy level
  - `old_level` -- previous maximum energy level
* **Returns:** None
* **Error states:** None

### `UpdateEnergyLevel(new_level, old_level, skipsound)`
* **Description:** Updates the current energy charge level display. Manages slot visibility, flicker animation for charging state, and plays charge up/down sounds.
* **Parameters:**
  - `new_level` -- new current energy level
  - `old_level` -- previous current energy level
  - `skipsound` -- boolean to skip sound playback
* **Returns:** None
* **Error states:** None

### `GetChipXOffset(chiptypeindex)`
* **Description:** Calculates the X position offset for a chip based on its circuit bar type index.
* **Parameters:** `chiptypeindex` -- circuit bar type index from CIRCUIT_BARS
* **Returns:** X offset value (number), or `nil` if chiptypeindex is not found in CIRCUIT_BARS table.
* **Error states:** None

### `OnModuleAdded(bartype, moduledefinition_index)`
* **Description:** Handles adding a new module chip to the display. Creates chip UI, sets animations, positions the chip, and updates slot tracking.
* **Parameters:**
  - `bartype` -- circuit bar type (ALPHA, BETA, GAMMA) or nil to use module_def.type
  - `moduledefinition_index` -- net ID index for module definition lookup
* **Returns:** None
* **Error states:** Returns early if `GetModuleDefinitionFromNetID()` returns nil -- no error thrown.

### `PopModuleAtIndex(bartype, startindex)`
* **Description:** Removes a module at a specific index and shifts remaining modules down. Animates the removed chip falling.
* **Parameters:**
  - `bartype` -- circuit bar type
  - `startindex` -- index of module to remove
* **Returns:** None
* **Error states:** Errors if bartype is not in chip_objectpools or startindex is out of bounds (nil dereference on falling_chip._used_modslots — no guard present in source).

### `OnModulesDirty(modules_data)`
* **Description:** Handles batch module data changes. Detects added, removed, or swapped modules and triggers appropriate animations and sounds.
* **Parameters:** `modules_data` -- table of module data per bar type
* **Returns:** None
* **Error states:** None

### `DropChip(falling_chip)`
* **Description:** Animates a chip falling off the display and hides it after animation completes.
* **Parameters:** `falling_chip` -- chip UI object to drop
* **Returns:** None
* **Error states:** None

### `PopOneModule(bartype)`
* **Description:** Removes the topmost module from the specified bar type.
* **Parameters:** `bartype` -- circuit bar type
* **Returns:** None
* **Error states:** Errors if `self.chip_poolindexes[bartype] - 1` index is invalid -- no bounds check present.

### `PopAllModules(skip_sound)`
* **Description:** Removes all modules from all bar types. Animates each chip falling.
* **Parameters:** `skip_sound` -- boolean to skip removal sound
* **Returns:** None
* **Error states:** None

### `Open()`
* **Description:** Expands the display to show module bars and chips. Plays open animation and sound.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Close()`
* **Description:** Collapses the display to hide module bars and chips. Plays close animation and sound.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `UpdateFocusBox()`
* **Description:** Updates the focus box scale based on open state and whether display is extended.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `PlayUpgradeModuleSound(soundpath, onlyifopen)`
* **Description:** Plays a UI sound for module interactions. Respects hidden state and widget visibility checks.
* **Parameters:**
  - `soundpath` -- sound path string
  - `onlyifopen` -- boolean to only play if display is open
* **Returns:** None
* **Error states:** None

### `HideUpgradeModulesDisplay()`
* **Description:** Hides the display by animating it off-screen. Stores original position for restore.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ShowUpgradeModulesDisplay()`
* **Description:** Shows the display by animating it back to original position.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnUpdate()`
* **Description:** Per-frame update that refreshes ability cooldown indicators on chips. Only runs when display is open and owner has wx78_abilitycooldowns component.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** None identified
- **Pushes:** None identified