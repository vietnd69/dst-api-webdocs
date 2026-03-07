---
id: wortox_soul_in_fx
title: Wortox Soul In Fx
description: A client-side FX entity that applies and animates a glowing tint effect on the target entity when Wortox's soul enters it.
tags: [fx, visual, wortox]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4c2d650c
system_scope: fx
---

# Wortox Soul In Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wortox_soul_in_fx` is a non-persistent FX prefab that visually signals the moment Wortox's soul transitions into a target entity. It applies a dynamic glowing tint effect (via highlight colour manipulation) over the target during a short animation sequence. This prefab runs only on clients (`TheWorld.ismastersim == false`) and is responsible for local visual feedback, not game state logic.

The component interacts with the `highlight` and `updatelooper` components to modify the target's rendering and schedule per-frame updates. It does not modify gameplay logic and is tightly coupled to Wortox's soul-related animation events.

## Usage example
```lua
-- This prefab is typically spawned and configured via Setup() when the soul enters a target:
local soul_fx = SpawnPrefab("wortox_soul_in_fx")
soul_fx.components.wortox_soul_in_fx and soul_fx.components.wortox_soul_in_fx.Setup and
    soul_fx.components.wortox_soul_in_fx:Setup(target_entity)
```

Note: The `Setup` function is attached directly to the instance (`inst.Setup = Setup`) and called externally.

## Dependencies & tags
**Components used:** `updatelooper`, `highlight` (optional, checked via `nil` guard), `animstate`, `transform`, `network`, `soundemitter` (on target)
**Tags:** Adds `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_target` | `net_entity` | `nil` (set at runtime) | Networked reference to the target entity receiving the tint effect. |
| `_tinttarget` | `Entity?` | `nil` | Cached reference to the current target for tinting; set during `OnTargetDirty`. |

## Main functions
### `Setup(inst, target)`
*   **Description:** Configures the FX entity to track and tint a specific target. Called externally on the master instance when the soul enters the target.
*   **Parameters:**  
    `target` (`Entity`) – The entity to apply the glowing tint effect to.
*   **Returns:** Nothing.
*   **Error states:** Does nothing on dedicated servers (`TheNet:IsDedicated()`). Plays a sound on the target if `SoundEmitter` exists.

### `OnTargetDirty(inst)`
*   **Description:** Triggered via the `targetdirty` event when `_target` is set. Initializes and starts the tint animation loop via `updatelooper`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Only proceeds if target is valid and not already assigned to `_tinttarget`; adds `updatelooper` component if missing.

### `OnUpdateTargetTint(inst)`
*   **Description:** Called every frame via `updatelooper` to progressively animate the target's highlight/mult colours during soul entry. Stops when animation completes or target becomes invalid.
*   **Parameters:** None (dt parameter is commented out and unused).
*   **Returns:** Nothing.
*   **Error states:** Removes itself from `updatelooper` and clears `_tinttarget`/`OnRemoveEntity` when the target is invalid or animation frame index `>= 10`.

### `PushColour(inst, addval, multval)`
*   **Description:** Applies highlight and mult colour overrides to `AnimState` if no `highlight` component exists; otherwise resets mult colour override.
*   **Parameters:**  
    `addval` (`number`) – Scale factor for highlight colour (RGB).  
    `multval` (`number`) – Scale factor for mult colour (RGB).
*   **Returns:** Nothing.

### `PopColour(inst)`
*   **Description:** Resets highlight and mult colour overrides to defaults (clears tinting).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup function called on entity removal to ensure target tint is reset.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `targetdirty` – triggers `OnTargetDirty`.  
- **Pushes:** None directly, but relies on `animover` event (`inst:ListenForEvent("animover", inst.Remove)`) for self-destruction.
- **Custom events:** Uses `inst._target:set(target)` to trigger the `targetdirty` event via the `net_entity` binding.
- **Entity removal:** Hooks `inst.OnRemoveEntity` to `OnRemoveEntity` when target is set, ensuring cleanup even if removed mid-animation.
