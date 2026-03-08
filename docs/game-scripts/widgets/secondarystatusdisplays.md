---
id: secondarystatusdisplays
title: Secondarystatusdisplays
description: Manages a secondary UI display panel for player upgrades and inventory, aligned for split-screen multiplayer use.
tags: [ui, multiplayer, upgrade]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 47c64b29
system_scope: ui
---

# Secondarystatusdisplays

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SecondaryStatusDisplays` is a UI widget that provides a mirrored or offset version of the primary status display, specifically designed for split-screen multiplayer support. It hosts the upgrade modules UI (`UpgradeModulesDisplay`) and an optional side inventory panel, aligning elements to the opposite side of the screen depending on whether the owner is `Player1` (column1 = `50`) or another player (column1 = `-50`). It reacts to player mode changes (`ghostmode`) and upgrade module state updates via event listeners.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("secondarystatusdisplays")
-- Assuming 'owner' is a player entity with the "upgrademoduleowner" tag:
inst.components.secondarystatusdisplays.owner = owner
inst.components.secondarystatusdisplays:SetGhostMode(false)
```

## Dependencies & tags
**Components used:** None directly (relies on external widgets and `UpgradeModulesDisplay`).
**Tags:** Checks `owner:HasTag("upgrademoduleowner")`; listens to owner for `upgrademodulesdirty`, `upgrademoduleowner_popallmodules`, and `energylevelupdate` events.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity this widget belongs to; must be provided at or shortly after construction. |
| `column1` | number | `50` or `-50` | Horizontal offset in screen space, determined at construction based on `IsGameInstance(Instances.Player1)`. |
| `isghostmode` | boolean | `true` (initially) | Tracks whether the owner is currently in ghost mode (affects visibility of child widgets). |
| `side_inv` | widget | `nil` initially | Child widget container for side inventory UI. |
| `upgrademodulesdisplay` | UpgradeModulesDisplay | `nil` initially | Child widget managing upgrade module display when the owner supports modules. |

## Main functions
### `SetGhostMode(ghostmode)`
*   **Description:** Toggles visibility of the side inventory and upgrade modules display based on ghost mode state. Defers actual UI updates to avoid race conditions during mode transitions.
*   **Parameters:** `ghostmode` (boolean) – `true` to hide modules/inventory (e.g., during spectating), `false` to show them.
*   **Returns:** Nothing.
*   **Error states:** No-op if the current `isghostmode` value already matches `ghostmode`.

### `AddModuleOwnerDisplay()`
*   **Description:** Instantiates and attaches the `UpgradeModulesDisplay` child widget if the owner has the `upgrademoduleowner` tag and none exists yet.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if `upgrademodulesdisplay` already exists.

### `ModulesDirty(data)`
*   **Description:** Delegates the `upgrademodulesdirty` event to the `UpgradeModulesDisplay` to refresh module UI.
*   **Parameters:** `data` (table) – Module data payload, passed through to the underlying display.
*   **Returns:** Nothing.

### `PopAllUpgradeModules()`
*   **Description:** Delegates the request to pop all installed upgrade modules to the `UpgradeModulesDisplay`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetUpgradeModuleEnergyLevel(new_level, old_level)`
*   **Description:** Updates the energy level display in the `UpgradeModulesDisplay`.
*   **Parameters:** `new_level` (number) – current energy level; `old_level` (number) – previous energy level.
*   **Returns:** Nothing.

### `UpgradeModulesEnergyLevelDelta(data)`
*   **Description:** Extracts `new_level` and `old_level` from an energy update event payload and calls `SetUpgradeModuleEnergyLevel`.
*   **Parameters:** `data` (table or `nil`) – May contain `data.new_level` and `data.old_level`; defaults to `0` for missing fields.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `energylevelupdate` (on owner) – triggers `UpgradeModulesEnergyLevelDelta`.  
  `upgrademodulesdirty` (on owner) – triggers `ModulesDirty`.  
  `upgrademoduleowner_popallmodules` (on owner) – triggers `PopAllUpgradeModules`.  
- **Pushes:** None.