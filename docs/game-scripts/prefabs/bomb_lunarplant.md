---
id: bomb_lunarplant
title: Bomb Lunarplant
description: A ranged explosive weapon that launches a spinning projectile to detonate on impact, dealing planar damage in an area.
tags: [combat, projectile, explosion, equipment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 399be916
system_scope: combat
---

# Bomb Lunarplant

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bomb_lunarplant` is a throwable equipment prefab that functions as a ranged explosive weapon. It uses the `complexprojectile` component to launch a spinning projectile that detonates on impact via the `explosive` component, dealing planar area damage (`planardamage`). The prefab integrates with the `equippable` component for item inventory handling and the `reticule` component for aim assistance (including twin-stick support). It spawns a dedicated FX prefab (`bomb_lunarplant_explode_fx`) upon detonation.

## Usage example
```lua
local inst = SpawnPrefab("bomb_lunarplant")
if inst ~= nil then
    -- Configure damage and range (if needed pre-launch)
    inst.components.planardamage:SetBaseDamage(120)
    inst.components.explosive.explosiverange = 5

    -- Launch with attacker info (nil attacker for world damage)
    inst.components.complexprojectile:Launch(Vector3(0,0,0), nil, true)
end
```

## Dependencies & tags
**Components used:** `complexprojectile`, `equippable`, `explosive`, `planardamage`, `reticule`, `weapon`, `inspectable`, `inventoryitem`, `stackable`, `locomotor`  
**Tags added:** `toughworker`, `explosive`, `projectile`, `complexprojectile`, `weapon`, `FX`, `NOCLICK` (on FX)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ispvp` | boolean | `false` | Indicates if the projectile was launched in PvP context (used to set pvpattacker). |
| `spinticks` | net_smallbyte | `3` | Controls spin animation and visual fading in/out duration (in ticks). |
| `core` | Entity (optional) | `nil` | FX entity (spin core) parented to the main entity; created on client for visual effects. |

## Main functions
### `OnHit(inst, attacker, target)`
*   **Description:** Handler executed when the projectile collides with a target or environment. Initializes/validates `planardamage`, sets explosive properties, triggers detonation, and spawns the explosion FX.
*   **Parameters:**
    *   `inst` (Entity) - The bomb entity itself.
    *   `attacker` (Entity/nil) - The entity that launched the bomb.
    *   `target` (Entity/nil) - The entity or location hit (unused in this implementation).
*   **Returns:** Nothing (the entity is removed during detonation).
*   **Error states:** Does nothing if `planardamage` is missing (it gets added automatically), but fails silently if critical components (`explosive`, `SoundEmitter`) are absent.

### `onthrown(inst, attacker)`
*   **Description:** Called immediately upon projectile launch. Configures physics, tags, animations, and sound, then starts the spin timer.
*   **Parameters:**
    *   `inst` (Entity) - The bomb entity.
    *   `attacker` (Entity/nil) - The launcher (used for PvP context tracking).
*   **Returns:** Nothing.
*   **Error states:** Sets `ispvp` to `true` only if `attacker` is a valid player.

### `CreateSpinCore()`
*   **Description:** Utility function to construct a dedicated FX entity for the spin animation effect.
*   **Parameters:** None.
*   **Returns:** Entity - A non-persistent FX entity with anim, transform, and follower components.
*   **Error states:** Returns a minimal entity even if `TheWorld.ismastersim` is false (it will be non-networked and unable to sleep).

### `UpdateSpin(inst, ticks)`
*   **Description:** Updates visual spin effects (highlight/mult colour, light override) and manages the spin fade-in/fade-out animation over time.
*   **Parameters:**
    *   `inst` (Entity) - The bomb entity.
    *   `ticks` (number) - Increment for `spinticks`; usually `0` or a small positive delta.
*   **Returns:** Nothing.
*   **Error states:** Cancels `spintask` when `spinticks` reaches or exceeds `FX_TICKS` (30).

### `OnSpinTicksDirty(inst)`
*   **Description:** Ensures the spin FX task is active and initializes the spin core FX entity on the client. Triggers immediate spin update.
*   **Parameters:**
    *   `inst` (Entity) - The bomb entity.
*   **Returns:** Nothing.
*   **Error states:** Only creates the `core` FX entity on the client (not on dedicated servers).

### `ReticuleTargetFn()`
*   **Description:** Implements the reticule target acquisition logic, scanning forward arc points to find a valid passable ground position.
*   **Parameters:** None.
*   **Returns:** Vector3 - The recommended ground position for landing.
*   **Error states:** Returns origin `Vector3(0,0,0)` if no valid ground point found within scan arc.

### `fxfn()`
*   **Description:** Constructor for the explosion FX prefab (`bomb_lunarplant_explode_fx`). Sets up animation, bloom, and light overrides, then schedules the explosion sound and self-destruction.
*   **Parameters:** None (used internally by the Prefab system).
*   **Returns:** Entity - The FX entity.

## Events & listeners
- **Listens to:** `spinticksdirty` (client) - Triggers `OnSpinTicksDirty` to sync spin effects across network.
- **Pushes:** None directly, but triggers `bomb_lunarplant_explode_fx` removal via `animover` event.