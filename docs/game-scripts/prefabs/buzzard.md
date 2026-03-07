---
id: buzzard
title: Buzzard
description: Defines two prefabs—the standard buzzard and its mutated gestalt variant—each with behavior, stats, and gameplay mechanics specific to Don't Starve Together.
tags: [combat, ai, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1946d3f5
system_scope: entity
---

# Buzzard

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `buzzard` prefab script defines two related entities: the base `buzzard` (a common scavenger creature) and `mutatedbuzzard_gestalt` (a rare, aggressive gestalt variant with planar damage and flamethrower-like mechanics). It configures components for health, combat, locomotion, eating, loot dropping, and state behavior, including custom tag assignments and event handling. The script also sets up loot tables and sound mappings, and establishes shared target logic for the mutated variant to coordinate with other gestalt units.

## Usage example
```lua
-- Creating a standard buzzard
local buzzard = Prefab("buzzard", fn, assets, prefabs)
local inst = CreateEntity()
inst:AddTag("buzzard")
inst:AddComponent("health")
inst.components.health:SetMaxHealth(TUNING.BUZZARD_HEALTH)
inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(TUNING.BUZZARD_DAMAGE)
-- ... additional setup via fn()

-- Creating a mutated buzzard gestalt
local mutated = Prefab("mutatedbuzzard_gestalt", mutated_fn, mutated_assets, mutated_prefabs)
-- Mutated variant automatically registers with world component mutatedbuzzardmanager
```

## Dependencies & tags
**Components used:**  
`health`, `combat`, `eater`, `sleeper`, `lootdropper`, `inspectable`, `knownlocations`, `drownable`, `locomotor`, `hauntable`, `planardamage`, `planarentity`, `timer`, `migrationmanager` (accessed via `TheWorld.components.migrationmanager`), `mutatedbuzzardmanager` (accessed via `TheWorld.components.mutatedbuzzardmanager`)

**Tags added:**  
- Standard: `buzzard`, `animal`, `scarytoprey`  
- Mutated (in addition to above): `lunar_aligned`, `gestaltmutant`, `hostile`, `mutantdominant`, `soulless`

**Tags checked:**  
- `buzzard` (used in `KeepTargetFn`, `Mutated_KeepTargetFn`, `Mutated_IsValidAlly`, `Mutated_AddSharedTargetRef`)  
- `INLIMBO` (used in `Mutated_RetargetFn` target exclusion)

## Properties
No public properties are exposed on the entity instance beyond those of its attached components. The script initializes global data structures (`BUZZARD_SHARED_TARGETS`, `FX_SIZES`, `FX_HEIGHTS`) and function references (`SetOwnCorpse`, `LoseCorpseOwnership`, etc.) but does not define public fields on the instantiated entity.

## Main functions
### `KeepTargetFn(inst, target)`
*   **Description:** Predicate function used by the `combat` component to determine if the buzzard should maintain its current target. Ensures the target is still valid and within a dynamic range based on attack range and target size, or a fixed 7.5 units if the target is not another buzzard.
*   **Parameters:**  
    `inst` (Entity) — the buzzard instance.  
    `target` (Entity) — the potential target to retain.  
*   **Returns:** `true` if the buzzard should keep targeting this entity, `false` otherwise.
*   **Error states:** None documented.

### `OnAttacked(inst, data)`
*   **Description:** Event handler triggered when the buzzard is attacked; sets the attacker as the new combat target.
*   **Parameters:**  
    `inst` (Entity) — the buzzard instance.  
    `data` (table) — event data containing at least `{ attacker = Entity }`.  
*   **Returns:** Nothing.

### `OnPreLoad(inst, data)`
*   **Description:** Callback invoked before loading the entity; ensures the buzzard's vertical position (`Y`) is clamped to `0` to prevent floating or underground placement issues.
*   **Parameters:**  
    `inst` (Entity) — the buzzard instance.  
    `data` (table) — pre-load metadata.  
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Handler for when the entity enters sleep mode—clears the current combat target.
*   **Parameters:** `inst` (Entity) — the buzzard instance.  
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Haunt behavior for the `hauntable` component—triggers a `GOHOME` action and sets the haunt value to medium.
*   **Parameters:** `inst` (Entity) — the buzzard instance.  
*   **Returns:** `true` indicating successful haunt.
*   **Error states:** None documented.

### `Mutated_RetargetFn(inst)`
*   **Description:** Function used to find new combat targets for the mutated buzzard within a specified radius, respecting tags.
*   **Parameters:** `inst` (Entity) — the mutated buzzard instance.  
*   **Returns:** Entity (or `nil`) — the first entity found matching must tags (`_combat`) and not containing forbidden tags (`INLIMBO`, `buzzard`).
*   **Error states:** May return `nil` if no valid targets exist.

### `Mutated_KeepTargetFn(inst, target)`
*   **Description:** Mutated-specific target retention logic; checks validity and proximity within 10 units.
*   **Parameters:**  
    `inst` (Entity) — the mutated buzzard instance.  
    `target` (Entity) — the target to retain.  
*   **Returns:** `true` if valid and within range; otherwise `false`.
*   **Error states:** None documented.

### `Mutated_CanSuggestTargetFn(inst, target)`
*   **Description:** Predicate for whether a target can be suggested to the mutated buzzard, based on how many allies are already sharing it.
*   **Parameters:**  
    `inst` (Entity) — the mutated buzzard instance.  
    `target` (Entity) — the candidate target.  
*   **Returns:** `true` if the number of allies targeting this entity is below `TUNING.MUTATEDBUZZARD_MAX_TARGET_COUNT`; otherwise `false`.
*   **Error states:** None documented.

### `Mutated_SetFlameThrowerOnCd(inst)`
*   **Description:** Starts or restarts the flamethrower cooldown timer.
*   **Parameters:** `inst` (Entity) — the mutated buzzard instance.  
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `Mutated_GetStatus(inst)`
*   **Description:** Returns a string status for UI display—currently only checks if the entity is eating a corpse.
*   **Parameters:** `inst` (Entity) — the mutated buzzard instance.  
*   **Returns:** `"EATING_CORPSE"` if in the corresponding state; otherwise `nil`.

### `Mutated_OnNewCombatTarget(inst, data)`
*   **Description:** Handles new combat target assignment, including sharing the target with nearby gestalt allies and managing shared target references.
*   **Parameters:**  
    `inst` (Entity) — the mutated buzzard instance.  
    `data` (table) — event data containing `{ oldtarget = Entity?, target = Entity? }`.  
*   **Returns:** Nothing.
*   **Error states:** Assumes `data.target` and `data.oldtarget` are correctly populated.

### `Mutated_OnRemoveEntity(inst)`
*   **Description:** Cleanup handler when the entity is removed—clears shared target references, flame/ember pools, and corpse ownership.
*   **Parameters:** `inst` (Entity) — the mutated buzzard instance.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"attacked"` — triggers `OnAttacked` or `Mutated_OnAttacked` to set attacker as new target.  
  - `"death"` — triggers `Mutated_OnDeath` to clean up visual and combat state.  
  - `"newcombattarget"` — triggers `Mutated_OnNewCombatTarget` for target-sharing logic.  
  - `"droppedtarget"` — triggers `Mutated_OnDroppedTarget` to remove shared target reference.  

- **Pushes:**  
  - None identified in this file.
