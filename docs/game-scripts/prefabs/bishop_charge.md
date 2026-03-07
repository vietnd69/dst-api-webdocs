---
id: bishop_charge
title: Bishop Charge
description: Implements the projectile and area-of-effect explosion logic for the Bishop chesspiece's attack, handling both outdated and current attack variants in DST's clockwork arenas.
tags: [combat, fx, ai, boss, projectile]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d803d87f
system_scope: combat
---

# Bishop Charge

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bishop_charge` defines three prefabs used to simulate the Bishop chesspiece's attack in DST's Clockwork Arena: two deprecated projectile/hit variants (`bishop_charge`, `bishop_charge_hit`) and one current area-of-effect variant (`bishop_charge2_fx`). The current variant (`bishop_charge2_fx`) uses an entity-based AoE explosion with dynamic target detection, light effects, and electric damage application. It relies on the `combat`, `updatelooper`, and `projectile` components for behavior, and integrates with `clockwork_common` for AoE target acquisition.

## Usage example
```lua
-- Create the current Bishop attack effect entity
local inst = SpawnPrefab("bishop_charge2_fx")
-- Assign the entity responsible for this attack
if inst.SetupCaster then
    inst:SetupCaster(bishop_entity)
end
```

## Dependencies & tags
**Components used:** `combat`, `updatelooper`, `network`, `soundemitter`, `light`, `animator`, `transform`, `physics`
**Tags:** Adds `projectile` (deprecated), `FX`, `NOCLICK`, `notarget`; checks `electricdamageimmune`.

## Properties
No public properties are initialized in the constructor. Runtime state is stored on the instance (e.g., `inst.caster`, `inst.targets`, `inst.fadet`, `inst.fadeflicker`).

## Main functions
### `SetupCaster(inst, caster)`
*   **Description:** Assigns the attacking entity as `caster`, sets the prefab override for death announcements, plays the explosion sound once, and triggers an immediate AoE check if attacks have already occurred (e.g., if reattached).
*   **Parameters:**  
    `inst` (Entity) – The `bishop_charge2_fx` instance.  
    `caster` (Entity) – The entity performing the attack (typically a Bishop chesspiece).
*   **Returns:** Nothing.

### `OnUpdate(inst, dt)`
*   **Description:** Periodic function called via `updatelooper` that applies electric AoE damage to nearby entities within radius `RADIUS`, plays sound once, animates light fade/flicker using `easing.inQuad`, and ensures targets are only hit once. Ignores hit range checks on the `combat` component while active.
*   **Parameters:**  
    `inst` (Entity) – The `bishop_charge2_fx` instance.  
    `dt` (number) – Delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `caster` is invalid or not attached (falls back to `inst.components.combat`).

### `DisableHits(inst)`
*   **Description:** Removes the `OnUpdate` callback from `updatelooper`, disables the entity's light, and clears the `targets` table to stop further damage application.
*   **Parameters:** `inst` (Entity) – The `bishop_charge2_fx` instance.
*   **Returns:** Nothing.

### `KeepTargetFn(inst)`
*   **Description:** Used by the `combat` component; always returns `false` to prevent the Bishop attack from maintaining target lock.
*   **Parameters:** `inst` (Entity) – The entity (unused).
*   **Returns:** `false`.

## Events & listeners
- **Listens to:** `animover` (on deprecated `bishop_charge` and FX entities) – triggers delayed removal.
- **Pushes:** `electrocute` (via `PushEventImmediate`) to each affected target with `{ attacker = combat.inst, stimuli = "electric", numforks = 0 }`.
