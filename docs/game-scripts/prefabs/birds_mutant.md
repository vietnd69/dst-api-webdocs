---
id: birds_mutant
title: Birds Mutant
description: Creates and configures mutant bird prefabs (runner and spitter variants) with combat, projectile, and behavioral components for DST's lunar moonstorm event.
tags: [combat, ai, boss, projectile, lunar]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 10858cf7
system_scope: entity
---

# Birds Mutant

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`birds_mutant.lua` defines two prefabs—`bird_mutant` (runner) and `bird_mutant_spitter` (spitter)—which are hostile lunar creatures summoned during the Moonstorm event. It sets up shared and variant-specific behavior using core components including `combat`, `entitytracker`, `eater`, `locomotor`, `health`, `sleeper`, `sanityaura`, and `lootdropper`. The spitter variant adds a custom `LaunchProjectile` method to fire bile projectiles. Prefab creation is split into `commonPreMain` (core entity setup) and `commonPostMain` (component registration), both called by `runnerfn` and `spitterfn`.

## Usage example
```lua
-- Creating a runner mutant bird
local runner = Prefab("bird_mutant", "prefabs/birds_mutant")
local entity = runner()

-- Creating a spitter mutant bird with projectile support
local spitter = Prefab("bird_mutant_spitter", "prefabs/birds_mutant")
local spitter_entity = spitter()

-- Launch a projectile from spitter (master only)
if TheWorld.ismastersim then
    spitter_entity.LaunchProjectile(spitter_entity, target_pos)
end
```

## Dependencies & tags
**Components used:** `combat`, `complexprojectile`, `eater`, `entitytracker`, `health`, `inventoryitem`, `locomotor`, `lootdropper`, `sanityaura`, `sleeper`, `inspectable`, `timer`, `knownlocations`, `occupier`

**Tags added/checked:**  
`bird_mutant`, `NOBLOCK`, `soulless`, `hostile`, `monster`, `scarytoprey`, `canbetrapped`, `bird`, `lunar_aligned`, `bird_mutant_spitter` (spitter only)  
Also adds/_removes `inspectable` and `scarytoprey` dynamically on combat events.

## Properties
No public properties are defined in the constructor. Component behavior is configured via calls to component methods.

## Main functions
### `commonPreMain(inst)`
*   **Description:** Initializes core entity infrastructure (transform, animstate, physics, sound emitter, dynamic shadow, tags, animation). Called before component setup in both prefabs.
*   **Parameters:** `inst` (Entity) - the entity being constructed.
*   **Returns:** `inst` (Entity).
*   **Error states:** None. Sets up foundational entity state.

### `commonPostMain(inst)`
*   **Description:** Adds and configures all gameplay components (combat, eater, sleeper, sanityaura, locomotor, health, entitytracker, inventoryitem, lootdropper, knownlocations), sets the stategraph, assigns brain, and enables hauntable/feedable behavior.
*   **Parameters:** `inst` (Entity) - the entity being constructed.
*   **Returns:** `inst` (Entity).
*   **Error states:** None. Requires `commonPreMain` to have been called first.

### `LaunchProjectile(inst, targetpos)`
*   **Description:** Spawns a `bilesplat` projectile and launches it toward `targetpos` using `complexprojectile`. Speed is scaled linearly with distance. Used exclusively by `bird_mutant_spitter`.
*   **Parameters:**  
    `inst` (Entity) - the spitter instance launching the projectile.  
    `targetpos` (Vector3) - world position of the projectile target.  
*   **Returns:** Nothing.
*   **Error states:** Projectile is placed at launcher's position and accelerated based on `TUNING.FIRE_DETECTOR_RANGE`.

### `Retarget(inst)`
*   **Description:** Finds a new combat target within aggro range if near the swarm target or if swarm target is absent. Uses `FindEntity` with tags and `IsValidTarget`.
*   **Parameters:** `inst` (Entity) - the mutant bird instance.
*   **Returns:** Entity or `nil`.
*   **Error states:** Returns `nil` if no valid target found or swarm target is too far.

### `IsValidTarget(guy, inst)`
*   **Description:** Determines if a given entity `guy` is a valid combat target for `inst`. Accepts players or player-led followers if `combat:CanTarget` passes.
*   **Parameters:**  
    `guy` (Entity) - candidate target.  
    `inst` (Entity) - the mutant bird instance.  
*   **Returns:** `boolean`.
*   **Error states:** Returns `false` if `guy` is `nil`, lacks combat capability, or is not a player/owned follower.

### `KeepTargetFn(inst, target)`
*   **Description:** Decides whether to retain the current combat target based on proximity and validity. Used as the `keepfn` for combat retargeting.
*   **Parameters:**  
    `inst` (Entity) - the mutant bird instance.  
    `target` (Entity) - current target.  
*   **Returns:** `boolean`.
*   **Error states:** Returns `false` if target is out of return distance or invalid.

## Events & listeners
- **Listens to:**  
  `newcombattarget` → `OnNewCombatTarget` (adds `inspectable` and `scarytoprey` tags)  
  `droppedtarget` → `OnNoCombatTarget` (removes `inspectable`, restarts combat cooldown)  
  `losttarget` → `OnNoCombatTarget`  
  `ontrapped` → `OnTrapped` (restores trapped build if applicable)
- **Pushes:** None.