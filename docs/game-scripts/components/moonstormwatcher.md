---
id: moonstormwatcher
title: Moonstormwatcher
description: Manages moonstorm-related speed penalties for entities based on storm intensity and vision state.
tags: [moonstorm, locomotion, weather]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6cb5c8a6
system_scope: locomotion
---

# Moonstormwatcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moonstormwatcher` applies and removes locomotion speed penalties to an entity during a moonstorm event. It dynamically adjusts speed based on the current moonstorm intensity (`moonstormlevel`), the configured speed multiplier (`moonstormspeedmult`), and entity state factors such as goggle or ghost vision, and whether the entity is mounted. The component integrates with `stormwatcher`, `playervision`, `rider`, and `locomotor` to determine whether to apply or remove the speed modifier.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moonstormwatcher")
inst.components.moonstormwatcher:SetMoonstormSpeedMultiplier(0.6)
```

## Dependencies & tags
**Components used:** `locomotor`, `moonstorms`, `playervision`, `rider`, `stormwatcher`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `false` | Whether the moonstorm penalty is currently active. |
| `moonstormlevel` | number | `0` | Current storm level for the moonstorm (not used internally; kept for reference). |
| `moonstormspeedmult` | number | `TUNING.MOONSTORM_SPEED_MOD` | Speed multiplier applied during moonstorms when the penalty is active. Clamped to `[0, 1]`. |
| `delay` | any | `nil` | Reserved field (unused in current implementation). |

## Main functions
### `ToggleMoonstorms(data)`
*   **Description:** Enables or disables the moonstorm speed penalty based on the `data.setting` value and `data.stormtype`. Typically called in response to the `ms_stormchanged` event.
*   **Parameters:**
    *   `data` (table) - Contains `stormtype` (expected to be `STORM_TYPES.MOONSTORM`) and `setting` (boolean indicating activation).
*   **Returns:** Nothing.
*   **Error states:** No effect if `data.stormtype` is not `MOONSTORM`; no-op if `enabled` state already matches the requested setting.

### `SetMoonstormSpeedMultiplier(mult)`
*   **Description:** Sets the speed multiplier applied during moonstorms and updates listeners and locomotor state accordingly.
*   **Parameters:**
    *   `mult` (number) - Speed multiplier to apply. Will be clamped to `[0, 1]`.
*   **Returns:** Nothing.
*   **Error states:** No effect if the new multiplier is equal to the current `moonstormspeedmult`.

### `UpdateMoonstormLevel()`
*   **Description:** Queries the current moonstorm intensity, updates internal state, and pushes a `moonstormlevel` event to notify listeners.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateMoonstormWalkSpeed()`
*   **Description:** Triggers recalculation of the speed multiplier applied to locomotion. This function delegates to `UpdateMoonstormWalkSpeed_Internal`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateMoonstormWalkSpeed_Internal(level)`
*   **Description:** Applies or removes the external speed multiplier via `locomotor` based on storm level and entity state.
*   **Parameters:**
    *   `level` (number or nil) - Current moonstorm level. If `nil`, no penalty is applied.
*   **Returns:** Nothing.
*   **Error states:** If `level >= TUNING.SANDSTORM_FULL_LEVEL` AND the entity lacks goggle/ghost vision and is not mounted, the speed penalty (`moonstormspeedmult`) is applied. Otherwise, it is removed.

### `GetMoonStormLevel()`
*   **Description:** Retrieves the current moonstorm level from `stormwatcher`.
*   **Parameters:** None.
*   **Returns:** `number` or `nil` — returns `0` or higher if the entity has a `stormwatcher` component, otherwise `nil`.

## Events & listeners
- **Listens to:**  
  - `ms_stormchanged` (on `TheWorld`) — triggers `ToggleMoonstorms`.
  - `gogglevision`, `ghostvision`, `mounted`, `dismounted` (on owner entity) — triggers speed update via `UpdateMoonstormWalkSpeed`.
- **Pushes:**  
  - `moonstormlevel` — fired when `UpdateMoonstormLevel` is called, with payload `{ level = <number> }`.
