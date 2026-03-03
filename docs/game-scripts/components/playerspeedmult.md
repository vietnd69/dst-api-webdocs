---
id: playerspeedmult
title: Playerspeedmult
description: Manages non-stacking speed multipliers for players by overriding the locomotor's runspeed, supporting both server-authoritative and client-predicted multipliers with optional hard caps.
tags: [locomotion, player, network, speed]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 95888f78
system_scope: locomotion
---
# Playerspeedmult

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerSpeedMult` is a specialized component that applies non-stacking speed multipliers to a player entity by directly modifying `locomotor.runspeed` (or `locomotor.predictrunspeed` on clients). It supports multiple modifier categories—server-authoritative (`_mults`, `_cappedmults`) and client-predicted (`_predictedmults`, `_cappedpredictedmults`)—to ensure correct interpolation and syncing across clients. Multipliers are applied multiplicatively, and an optional global cap (`multcap`) can be enforced. The component relies on `SourceModifierList` to manage individual modifier contributions and integrates with `locomotor` to update movement speed in real time.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playerspeedmult")
inst:AddComponent("locomotor")

-- Apply a server-authoritative speed boost (non-stacking)
inst.components.playerspeedmult:SetSpeedMult("my_mod", 1.5)

-- Apply a client-predicted speed modifier (e.g., temporary status)
inst.components.playerspeedmult:SetPredictedSpeedMult("status_effect", 1.2)

-- Apply a global speed cap of 12.0
inst.components.playerspeedmult:SetSpeedMultCap(12.0)

-- Remove modifiers
inst.components.playerspeedmult:RemoveSpeedMult("my_mod")
```

## Dependencies & tags
**Components used:** `locomotor`, `player_classified` (via `self.classified`), `SourceModifierList`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `TheSim` entity instance | — | Owner entity of this component. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Whether this instance is running in the master simulation (server). |
| `multcap` | number or `nil` | `nil` | Optional global speed multiplier cap. If set, effective multipliers exceeding this value are scaled down proportionally. |
| `_mults` | `SourceModifierList` | — | Server-authoritative uncapped multipliers (server-only). |
| `_cappedmults` | `SourceModifierList` | — | Server-authoritative capped multipliers (server-only). |
| `_predictedmults` | `SourceModifierList` | — | Client-predicted uncapped multipliers (used on both server and clients). |
| `_cappedpredictedmults` | `SourceModifierList` | — | Client-predicted capped multipliers (used on both server and clients). |
| `classified` | `player_classified` | `nil` | Network replica of player-classified data (client/server sync), accessed via `self.inst.replica.player_classified`. |

## Main functions
### `SetSpeedMult(source, m)`
*   **Description:** Adds or updates a server-authoritative uncapped speed multiplier. Only effective on the master simulation. Triggers a `locomotor.runspeed` recalculation.
*   **Parameters:**  
    `source` — identifier for the modifier (entity or string); used for deduplication.  
    `m` (number) — multiplier value (e.g., `1.5` for +50% speed).
*   **Returns:** Nothing.
*   **Error states:** Only callable on master simulation (`ismastersim == true`).

### `RemoveSpeedMult(source)`
*   **Description:** Removes a previously set server-authoritative uncapped multiplier.
*   **Parameters:**  
    `source` — identifier for the modifier to remove.
*   **Returns:** Nothing.
*   **Error states:** Only callable on master simulation.

### `SetCappedSpeedMult(source, m)`
*   **Description:** Adds or updates a server-authoritative *capped* speed multiplier. This multiplier is applied only when it contributes to exceeding the global cap (`multcap`), and scaling is applied conservatively during recalculation.
*   **Parameters:**  
    `source` — identifier for the modifier.  
    `m` (number) — multiplier value.
*   **Returns:** Nothing.
*   **Error states:** Only callable on master simulation.

### `RemoveCappedSpeedMult(source)`
*   **Description:** Removes a previously set server-authoritative capped multiplier.
*   **Parameters:** `source` — identifier for the modifier to remove.
*   **Returns:** Nothing.
*   **Error states:** Only callable on master simulation.

### `SetPredictedSpeedMult(source, m)`
*   **Description:** Sets or updates a client-predicted uncapped multiplier. Used on both server and clients to support smooth interpolation (e.g., for status effects or abilities with client-side prediction). Does not require master simulation.
*   **Parameters:**  
    `source` — identifier for the modifier.  
    `m` (number) — multiplier value.
*   **Returns:** Nothing.

### `RemovePredictedSpeedMult(source)`
*   **Description:** Removes a client-predicted uncapped multiplier.
*   **Parameters:** `source` — identifier for the modifier to remove.
*   **Returns:** Nothing.

### `SetCappedPredictedSpeedMult(source, m)`
*   **Description:** Sets or updates a client-predicted *capped* multiplier. Behaves similarly to `SetCappedSpeedMult` but applies to predicted multipliers.
*   **Parameters:**  
    `source` — identifier for the modifier.  
    `m` (number) — multiplier value.
*   **Returns:** Nothing.

### `RemoveCappedPredictedSpeedMult(source)`
*   **Description:** Removes a client-predicted capped multiplier.
*   **Parameters:** `source` — identifier for the modifier to remove.
*   **Returns:** Nothing.

### `SetSpeedMultCap(cap)`
*   **Description:** Sets or clears the global speed multiplier cap. Must be `nil` or `>= 0`. Setting a cap triggers recalculation to enforce the limit.
*   **Parameters:** `cap` (number or `nil`) — maximum effective multiplier; if exceeded, the total multiplier is scaled down proportionally.
*   **Returns:** Nothing.

### `ApplyRunSpeed_Internal()`
*   **Description:** Recalculates and updates `locomotor.runspeed` (server) or `locomotor.predictrunspeed` (client) using all active multipliers. Called automatically via dirty callbacks or manually when needed (e.g., after modifier changes). Implements cap enforcement logic via proportional scaling.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string summarizing the current effective multipliers, cap, and base speed for debugging purposes.
*   **Parameters:** None.
*   **Returns:**  
    `string` — e.g., `"server=1.50, predicted=1.20, cappedserver=1.00, cappedpredicted=1.00, cap=12.00, basespeed=6.00"`.

### `TryRecacheBaseSpeed_Internal()`
*   **Description:** Reads `locomotor.runspeed` and stores it in `classified.psm_basespeed` if *no* multipliers are active. Used to prevent overwriting dynamic speed changes when legacy mods modify `locomotor.runspeed` directly. Only runs on the master simulation.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Only callable on master simulation.

### `SetClassified(classified)`
*   **Description:** (Server-only) Explicitly sets the `player_classified` replica. Required for server-side sync and netvar updates.
*   **Parameters:** `classified` (`player_classified`) — network replica to use.
*   **Returns:** Nothing.
*   **Error states:** Only callable on master simulation; asserts if called client-side.

### `AttachClassified(classified)`
*   **Description:** Attaches a `player_classified` instance and listens for its removal to auto-detach. Used during entity initialization or when a classified replica is assigned dynamically.
*   **Parameters:** `classified` (`player_classified`) — instance to attach.
*   **Returns:** Nothing.

### `DetachClassified()`
*   **Description:** Removes the attached `player_classified` instance and stops listening for removal events.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up all modifier lists and cancels pending tasks on removal. Ensures no leftover state or leaked listeners.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` on `classified` — triggers `DetachClassified()` to clean up when the classified replica is removed.
