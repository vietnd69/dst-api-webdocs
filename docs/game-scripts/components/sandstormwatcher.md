---
id: sandstormwatcher
title: Sandstormwatcher
description: Manages movement speed penalties during sandstorms based on vision state, mounting, and storm intensity.
tags: [environment, movement, weather]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 95ba3afa
system_scope: environment
---

# Sandstormwatcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sandstormwatcher` dynamically modifies an entity's walking speed during sandstorms. It integrates with the `stormwatcher`, `playervision`, `rider`, and `locomotor` components to apply or remove a speed multiplier (`sandstormspeedmult`) when a sandstorm is active and conditions permit. Speed reduction is skipped when the entity has `gogglevision`, `ghostvision`, or is mounted, or when storm intensity falls below a threshold.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sandstormwatcher")
inst.components.sandstormwatcher:SetSandstormSpeedMultiplier(0.7)
inst.components.sandstormwatcher:ToggleSandstorms(true)
```

## Dependencies & tags
**Components used:** `stormwatcher`, `playervision`, `rider`, `locomotor`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `false` | Whether sandstorm speed adjustments are currently active. |
| `sandstormspeedmult` | number | `TUNING.SANDSTORM_SPEED_MOD` | Speed multiplier applied during sandstorms (clamped between `0` and `1`). |

## Main functions
### `ToggleSandstorms(active)`
*   **Description:** Enables or disables sandstorm speed management. When `sandstormspeedmult < 1`, listeners are added/removed to handle dynamic updates (e.g., goggle/ghost vision toggles, mount state changes).
*   **Parameters:** `active` (boolean) — whether sandstorms should be considered active.
*   **Returns:** Nothing.

### `SetSandstormSpeedMultiplier(mult)`
*   **Description:** Sets the speed multiplier used during sandstorms. Validates and clamps `mult` to `[0, 1]`. Automatically manages listener registration if the multiplier changes across the `1` threshold.
*   **Parameters:** `mult` (number) — desired speed multiplier.
*   **Returns:** Nothing.

### `UpdateSandstormLevel()`
*   **Description:** Queries the current sandstorm level from `stormwatcher`, updates walk speed, and pushes a `sandstormlevel` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateSandstormWalkSpeed()`
*   **Description:** Recalculates and applies the current sandstorm speed multiplier based on the storm level and entity state (vision, mounting).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetSandstormLevel()`
*   **Description:** Fetches the current sandstorm level from the `stormwatcher` component.
*   **Parameters:** None.
*   **Returns:** (number or `nil`) — storm level if `stormwatcher` is present, otherwise `nil`.

### `UpdateSandstormWalkSpeed_Internal(level)`
*   **Description:** Internal helper that applies or removes the sandstorm speed multiplier using `locomotor`, based on storm level and entity conditions.
*   **Parameters:** `level` (number or `nil`) — current sandstorm level.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"ms_stormchanged"` — triggered by `TheWorld` to toggle sandstorm handling when storm type is `STORM_TYPES.SANDSTORM`.  
  - `"gogglevision"`, `"ghostvision"`, `"mounted"`, `"dismounted"` — triggers speed recalculation via `UpdateSandstormWalkSpeed`.  
- **Pushes:**  
  - `"sandstormlevel"` — fired with `{ level = level }` when storm level changes via `UpdateSandstormLevel()`.
