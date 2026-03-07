---
id: inspectaclesbox
title: Inspectaclesbox
description: A loot-container entity that displays holographic projections and dispenses items based on the viewing player's recipe knowledge and repair status.
tags: [loot, hologram, craft, repair, classified]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d21fb056
system_scope: inventory
---

# Inspectaclesbox

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `inspectaclesbox` is a consumable loot container prefab that manifests as a holographic projection visible only to players wearing inspectacles (or equivalents). It does not persist across saves and is used exclusively for controlled, player-specific loot delivery. It uses the `CLASSIFIED` tag to restrict visibility and leverages the `playervision` and `lootdropper` components to customize loot based on recipe knowledge. The box remains non-interactive (`NOCLICK`, `NOBLOCK`) until repaired, then initiates an animation sequence to fling loot.

## Usage example
```lua
-- Example usage in a prefab constructor:
local box = Prefab("inspectaclesbox", fn1, assets1, prefabs1)
local ent = SpawnPrefab("inspectaclesbox")
ent:SetViewingOwner(player)
ent:SetRepaired()
ent.DoLootPinata(ent)
```

## Dependencies & tags
**Components used:** `activatable`, `lootdropper`, `projectedeffects`, `playervision`, `inventory`, `equippable`, `useableitem`, `inspectable`, `network`, `animstate`, `transform`, `soundemitter`

**Tags:** Adds `NOBLOCK`, `CLASSIFIED`, `ignorewalkableplatforms`; temporarily adds `FX`, `NOCLICK` to client-side projection during decay.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_inspectaclesowner` | Entity or self | `inst` | The entity whose recipe knowledge and vision state controls loot bias and projection visibility. |
| `_repaired` | boolean | `false` | Whether the box has been repaired; triggers direct open sequence instead of repair animation. |
| `_isprojected` | net_bool | `false` | Server-side flag controlling whether the hologram is visible. |
| `_animstate` | net_tinybyte | — | Current animation state index; drives client-side projection behavior. |
| `_ANIMBUILD` | string | `"inspectaclesbox"` | Animation bank/build name (varies by variant). |
| `_inspectaclesloots` | array of Entities | `nil` | Loot items generated and held temporarily during distribution. |
| `_inspectacleslootsindex` | number | `1` | Index for current loot being flung. |
| `_inspectacleslootscount` | number | — | Total number of loot items. |
| `_chuffsnd` | net_event | — | Client-side sound event fired on each item fling. |

## Main functions
### `SetViewingOwner(owner)`
* **Description:** Sets the entity whose vision and recipe knowledge controls the box’s visibility and loot bias. Listens to that entity’s `inspectaclesvision` event to toggle projection on/off.
* **Parameters:** `owner` (Entity or `nil`) — if `nil`, defaults to self; if provided, must have `playervision` and optionally `builder` components for loot biasing.
* **Returns:** Nothing.
* **Error states:** Silently deactivates projection if `owner` has no HUD.

### `SetRepaired()`
* **Description:** Marks the box as repaired and sets its animation to the fixed state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Side effect:** Subsequent `DoLootPinata` skips the repair animation.

### `DoLootPinata()`
* **Description:** Generates loot, pre-spawns items at the box location, removes them from the scene, and initiates the open-and-fling sequence. Also removes the `activatable` component to prevent reactivation.
* **Parameters:** None (method attached to `inst`).
* **Returns:** Nothing.
* **Side effects:** Sets `_inspectaclesloots`, `_inspectacleslootscount`, and `_inspectacleslootsindex`; starts a periodic task (`DoLootPinata_DoFling`) that flings items every 0.25 seconds.

### `ToggleProjection(enabled)`
* **Description:** Toggles the projection visibility and manages client-side animation. May not be disabled once the loot sequence has started (i.e., past broken/fixed idle).
* **Parameters:** `enabled` (boolean) — whether to show/hide the projection.
* **Returns:** Nothing.

### `SetAnimState(state, delay, cb)`
* **Description:** Sets the animation state for the client-side projection and triggers immediate client update. Used to control playback sequence during repair/open/decay.
* **Parameters:**
  - `state` (string) — one of `"idle_broken_loop"`, `"idle_fixed_loop"`, `"repair"`, `"open_pre"`, `"open_loop"`, `"open_pst"`, `"closed"`.
  - `delay` (number) — optional delay in seconds (FRAMES-based constants used internally).
  - `cb` (function) — optional callback executed after delay.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `inspectaclesvision` (on `_inspectaclesowner`) — triggers `ToggleProjection(inst, data.enabled)`.
  - `isprojecteddirty` (client) — triggers `OnIsProjected_Client`.
  - `animstatedirty` (client) — triggers `OnAnimState_Client`.
  - `inspectaclesbox._chuffsndevent` (client) — triggers `OnChuffSnd_Client`.
- **Pushes:** None directly, but relies on net events (`_chuffsnd`) and dirty flags for sync (`isprojecteddirty`, `animstatedirty`).