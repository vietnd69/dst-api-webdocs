---
id: eyeofterrorbrain
title: Eyeofterrorbrain
description: Controls the AI behavior of the Eye of Terror boss, coordinating special attacks, leashing, facing, and spawning mini-eyes via behavior trees.
tags: [ai, boss, combat, locomotion, spawning]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: e9f9b931
system_scope: brain
---

# Eyeofterrorbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`EyeOfTerrorBrain` is the AI behavior tree implementation for the Eye of Terror boss entity. It orchestrates complex combat behaviors such as ranged chomp and charge attacks, spawning and focusing mini-eyes, and maintaining positional constraints (leashing) using the `leash` and `faceentity` behaviors. The brain is initialized once per instance and constructs a hierarchical behavior tree (`BT`) in `OnStart`, leveraging the `behaviours/faceentity` and `behaviours/leash` modules.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrainClass(EyeOfTerrorBrain)
inst:DoTaskInTime(0, function()
    inst.components.brain:OnInitializationComplete()
    inst.components.brain:OnStart()
end)
```

## Dependencies & tags
**Components used:** `combat`, `commander`, `knownlocations`, `timer`  
**Tags:** None identified (behavior tree actions fire events, but no tags are directly added/removed by this brain).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_leash_pos` | `Vector3` or `nil` | `nil` | Cached leash position; reset on entering special-move logic. |
| `_special_move` | `string` or `nil` | `nil` | Name of the current special move action selected by `ShouldUseSpecialMove`. |

## Main functions
### `ShouldUseSpecialMove()`
*   **Description:** Determines and prioritizes the next special action (spawn mini-eyes, focus mini-eyes on target, charge, or chomp) based on current game state and timers. Sets `_special_move` and returns `true` if a move is available; otherwise returns `false`.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a special move should be executed; `false` otherwise.
*   **Error states:** Returns `false` if none of the attempt functions (`TrySpawnMiniEyes`, `TryFocusMiniEyesOnTarget`, etc.) return a valid move string or action token.

### `GetLeashPosition()`
*   **Description:** Calculates or retrieves the current leash target position, ensuring the boss maintains a fixed distance (7 units) from the combat target while avoiding jitter (caches position for 3 seconds via timer).
*   **Parameters:** None.
*   **Returns:** `Vector3` — the calculated leash position.
*   **Error states:** If no combat target exists, returns the boss’s current position.

### `OnStart()`
*   **Description:** Builds and assigns the behavior tree root node (`self.bt`) with logic for special moves, leashing, facing the target, and wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None; assumes `combat`, `commander`, `knownlocations`, and `timer` components are present.

### `OnInitializationComplete()`
*   **Description:** Records the entity’s current position (flattened to y=0) as `"spawnpoint"` in the `knownlocations` component, ensuring consistent spawn alignment.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None; uses safe y-flattening and the `dont_overwrite=true` flag.

### `TrySpawnMiniEyes(inst)`
*   **Description:** Helper function to check if spawning mini-eyes is valid — only when cooldown timer `"spawneyes_cd"` does not exist *and* current soldier count is below the desired threshold.
*   **Parameters:** `inst` (`Entity`) — the Eye of Terror entity.
*   **Returns:** `"spawnminieyes"` if valid; `nil` or `false` otherwise.

### `TryChompAttack(inst)`
*   **Description:** Checks if a chomp attack is possible — only when transformed and the target is within chomp range (`TUNING.EYEOFTERROR_ATTACK_RANGE`).
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** `"chomp"` if within range; `false` otherwise.

### `TryChargeAttack(inst)`
*   **Description:** Checks if a charge attack is possible — cooldown `"charge_cd"` must be expired, target must exist, and distance must be between minimum and maximum thresholds.
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** `"charge"` if conditions met; `false` otherwise.

### `TryFocusMiniEyesOnTarget(inst)`
*   **Description:** Determines if mini-eyes should be focused on the current target — requires cooldown `"focustarget_cd"` to be expired, a target present, and minimum soldier count (`TUNING.EYEOFTERROR_MINGUARDS_PERSPAWN`) met.
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** `"focustarget"` if conditions met; `false` otherwise.

## Events & listeners
- **Pushes:** `spawnminieyes`, `focustarget`, `charge`, `chomp` — fired when `ShouldUseSpecialMove()` selects and executes a special move via `self.inst:PushEvent(self._special_move)`.
- **Listens to:** None identified — this brain does not register external event listeners; behavior is driven by the behavior tree state and timer checks.
