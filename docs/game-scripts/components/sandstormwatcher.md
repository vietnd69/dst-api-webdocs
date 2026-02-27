---
id: sandstormwatcher
title: Sandstormwatcher
description: Monitors sandstorm activity in the world and adjusts the player’s walk speed accordingly based on sandstorm intensity and vision modifiers.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 95ba3afa
---

# Sandstormwatcher

## Overview  
This component tracks sandstorm conditions in the world and dynamically modifies the player’s locomotion speed when sandstorms are active. It listens for storm changes globally (via `TheWorld`) and applies a speed multiplier based on sandstorm intensity—unless vision-affecting states like Goggle Vision, Ghost Vision, or riding are active, in which case the speed penalty is removed.

## Dependencies & Tags  
**Component dependencies:**  
- `inst.components.stormwatcher` — used to query current sandstorm level (`GetStormLevel(STORM_TYPES.SANDSTORM)`).  
- `inst.components.locomotor` — applies or removes the external speed multiplier `"sandstorm"`.  
- `inst.components.playervision` — checked for Goggle Vision or Ghost Vision state.  
- `inst.components.rider` — checked to determine if the player is currently mounted.  

**World dependency:**  
- Requires `TheWorld.components.sandstorms` to be non-nil to register storm change listeners.

## Properties  
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to (typically the player). |
| `enabled` | `boolean` | `false` | Whether sandstorm speed modification is currently active. |
| `sandstormspeedmult` | `number` | `TUNING.SANDSTORM_SPEED_MOD` | Speed multiplier applied during sandstorms (clamped to [0, 1]). |

## Main Functions  
### `ToggleSandstorms(active)`
* **Description:** Enables or disables sandstorm-based speed penalty logic based on whether a sandstorm is active. Also triggers level updates when activated.  
* **Parameters:**  
  - `active` (boolean, default `false`): Whether sandstorm conditions should be considered active.

### `SetSandstormSpeedMultiplier(mult)`
* **Description:** Updates the sandstorm speed multiplier used for locomotion. Automatically manages listener setup/teardown based on the new multiplier value and active state.  
* **Parameters:**  
  - `mult` (number, clamped to [0, 1]): The new speed multiplier to apply during sandstorms.

### `UpdateSandstormLevel()`
* **Description:** Refreshes the current sandstorm level, updates the locomotor with the appropriate speed multiplier, and broadcasts a `"sandstormlevel"` event to the entity.  
* **Parameters:** None.

### `UpdateSandstormWalkSpeed()`
* **Description:** Invokes `UpdateSandstormWalkSpeed_Internal` using the latest sandstorm level from `GetSandstormLevel()`. Used as an event callback (e.g., on vision changes).  
* **Parameters:** None.

### `UpdateSandstormWalkSpeed_Internal(level)`
* **Description:** Applies or removes the `"sandstorm"` speed multiplier via the `locomotor` component based on storm level and context (e.g., goggles, ghosts, or riding negate the penalty).  
* **Parameters:**  
  - `level` (number or `nil`): Current sandstorm level. If `nil`, no multiplier is applied.

### `GetSandstormLevel()`
* **Description:** Returns the current sandstorm level from `stormwatcher`, or `nil` if `stormwatcher` is missing.  
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners and speed multiplier when the component is removed. Only cleans up if the component was enabled *and* a speed multiplier was configured.  
* **Parameters:** None.

## Events & Listeners  
- **Listens for `"ms_stormchanged"`** from `TheWorld` — triggers `ToggleSandstorms` when a sandstorm starts or stops.  
- **Listens for `"gogglevision"`, `"ghostvision"`, `"mounted"`, `"dismounted"`** — triggers `UpdateSandstormWalkSpeed` to adjust speed in response to vision/mount state changes.  
- **Pushes `"sandstormlevel"`** on entity — broadcasts the current sandstorm level (e.g., for UI updates).