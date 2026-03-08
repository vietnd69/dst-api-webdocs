---
id: upgrademodulesdisplay
title: UpgradeModulesDisplay
description: Renders and manages the visual display of upgrade modules and energy charge level for the WX-78 character's HUD.
tags: [ui, character, hud, wx78]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 22e3fa32
system_scope: ui
---

# UpgradeModulesDisplay

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`UpgradeModulesDisplay` is a UI widget responsible for visually representing WX-78's installed upgrade modules and current electric charge level. It manages animation states for the battery indicator, slot indicators, and individual module chips, updating them in response to energy changes and module additions/removals. It does not manage state directly but reacts to updates from the owner entity's components (e.g., `wx78`). The widget supports mirroring for the second player instance by conditionally scaling and reversing animations.

## Usage example
```lua
-- Assume `owner` is an entity with the `wx78` component.
-- This widget is typically added and managed by the player's HUD screen.
local display = owner:AddChild(UpgradeModulesDisplay(owner, IsGameInstance(Instances.Player2)))
display:UpdateEnergyLevel(3, 0) -- Set energy to 3/6 units
display:OnModuleAdded(5)          -- Add module with net ID 5
```

## Dependencies & tags
**Components used:** None (this is a widget, not a component; relies on `TheFrontEnd:GetSound()`, `TUNING`, and `Instances` global access)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (typically the player) this display belongs to. |
| `reversed` | boolean | `false` | Whether the display should be mirrored (used for Player2). |
| `energy_level` | number | `TUNING.WX78_MAXELECTRICCHARGE` | Current electric charge level (0 to `TUNING.WX78_MAXELECTRICCHARGE`). |
| `slots_in_use` | number | `0` | Total number of module slots currently occupied across all installed modules. |
| `chip_poolindex` | number | `1` | Index of the next available module slot in `chip_objectpool`. |
| `chip_objectpool` | table of UIAnim | `{}` | Array of 6 UIAnim objects representing module chips; managed as a pool. |
| `battery_frame` | UIAnim | (created in constructor) | Static frame background animation. |
| `energy_backing` | UIAnim | (created in constructor) | Background energy bar (slot 3). |
| `energy_blinking` | UIAnim | (created in constructor) | Blinking yellow indicator of current charge level. |
| `anim` | UIAnim | (created in constructor) | Static green energy bar showing full charge level. |

## Main functions
### `UpdateChipCharges(plugging_in)`
*   **Description:** Updates the power status (on/off) of each installed module chip based on current `energy_level`. Turns chips off when energy drops below their required threshold, turns them on when energy is sufficient. Also plays related sound effects.
*   **Parameters:** `plugging_in` (boolean) — if `true`, skips animation playback during module insertion for smoother sequential updates.
*   **Returns:** Nothing.
*   **Error states:** No-op if no modules are installed (`chip_poolindex <= 1`).

### `UpdateEnergyLevel(new_level, old_level)`
*   **Description:** Updates all energy-related animations to reflect the new charge level, toggles slot indicators, handles the blinking "charging" effect, and plays charging sounds.
*   **Parameters:**  
    *   `new_level` (number) — the current electric charge value (0 to `TUNING.WX78_MAXELECTRICCHARGE`).  
    *   `old_level` (number) — the previous charge value, used to determine charge direction for sound effects.
*   **Returns:** Nothing.

### `OnModuleAdded(moduledefinition_index)`
*   **Description:** Adds a new module to the display using a pre-allocated chip object from the pool. Configures its visual representation, calculates position based on slot usage, and shows it with an insertion animation.
*   **Parameters:** `moduledefinition_index` (number) — network ID of the module definition to display (used with `GetModuleDefinitionFromNetID`).
*   **Returns:** Nothing.
*   **Error states:** No-op if `GetModuleDefinitionFromNetID` returns `nil`.

### `OnModulesDirty(modules_table)`
*   **Description:** Synchronizes the display with a table of installed module indices. Adds new modules or removes the most recent one as needed, then refreshes chip charge states.
*   **Parameters:** `modules_table` (table of numbers) — ordered list of module net IDs (0 means no module in that slot).
*   **Returns:** Nothing.

### `PopOneModule()`
*   **Description:** Removes the most recently added module, triggers a falling animation, and hides it afterward. Updates `slots_in_use` and `chip_poolindex`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PopAllModules()`
*   **Description:** Removes all installed modules sequentially by triggering falling animations for each and resets `slots_in_use` to `0`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (does not register event listeners directly).
- **Pushes:** None (does not fire custom events).