---
id: cannonballs
title: Cannonballs
description: Handles the physics-based flight, target detection, and splash damage of cannonball projectiles in DST, including interaction with terrain, entities, and destructible objects.
tags: [combat, projectile, physics, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 07ce40df
system_scope: physics
---

# Cannonballs

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cannonballs.lua` defines two prefabs: `cannonball_rock` (the flying projectile) and `cannonball_rock_item` (the inventory ammo item). The projectile component implements physics-based flight using `complexprojectile`, performs mid-air target detection and impact resolution, and triggers splash damage via `combat:DoAreaAttack`. It interacts with terrain (ocean/ground), boats (causing leaks), destructible objects (`workable`), ocean entities (`oceanfishable`, `kelp`), and floating items (`inventoryitem`). It uses `groundshadowhandler` for visual feedback on landing.

## Usage example
```lua
-- Spawning a projectile cannonball from a cannon
local projectile = SpawnPrefab("cannonball_rock")
if projectile ~= nil then
    projectile.Transform:SetPosition(x, y, z)
    projectile.components.complexprojectile:SetHorizontalSpeed(speed_xz)
    projectile.components.complexprojectile:SetGravity(gravity)
    projectile.components.complexprojectile:SetOnHit(OnHit) -- already set in default fn
    projectile.components.complexprojectile.attacker = shooter
end

-- Creating cannonball inventory ammo
local ammo = SpawnPrefab("cannonball_rock_item")
ammo.components.stackable:SetStackSize(5)
ammo.components.inventoryitem:SetSinks(true)
```

## Dependencies & tags
**Components used:** `complexprojectile`, `combat`, `groundshadowhandler`, `inventoryitem`, `stackable`, `locomotor`, `health`, `workable`, `pickable`, `oceanfishable`, `dockmanager` (via `TheWorld`), `inspectable`.

**Tags added:** `projectile`, `complexprojectile`, `NOCLICK`, `boatcannon_ammo`, `_combat`, `_health`, `blocker`, `oceanfishable`, `kelp`, `_inventoryitem`, `wave`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` | Set on the projectile prefab to prevent saving it to disk. |
| `shooter` | entity | `nil` | Reference to the entity that launched the projectile; used to determine same-boat targeting rules. |
| `projectileprefab` | string | `"cannonball_rock"` | Set on the *item* version to link back to the projectile prefab. |
| `scrapbook_weapondamage` | number | `TUNING.CANNONBALL_DAMAGE` | Damage value displayed in scrapbook. |
| `scrapbook_areadamage` | number | `TUNING.CANNONBALL_DAMAGE * TUNING.CANNONBALL_SPLASH_DAMAGE_PERCENT` | Area damage value displayed in scrapbook. |

## Main functions
### `launch_away(inst, position, use_variant_angle)`
*   **Description:** Launches the cannonball (or any entity passed as `inst`) away from a given impact `position` with randomized direction and physics. Called on impact for debris/loot.
*   **Parameters:**
    *   `inst` (entity) — Entity to launch; must have `Transform` and optionally `Physics` and `inventoryitem`.
    *   `position` (function returning Vector3 or Vector3) — Origin point of the launch (impact center).
    *   `use_variant_angle` (boolean) — If true, adds angular variance (±10°) to launch direction.
*   **Returns:** Nothing.
*   **Error states:** No effect if `inst.Physics` is `nil`.

### `OnHit(inst, attacker, target)`
*   **Description:** Triggered on projectile impact. Handles splash damage, boat leaks, and launching affected entities (fish, kelp, items) away.
*   **Parameters:**
    *   `inst` (entity) — The cannonball projectile.
    *   `attacker` (entity or `nil`) — The entity that fired the projectile.
    *   `target` (entity or `nil`) — The specific entity directly hit (if any).
*   **Returns:** Nothing.
*   **Error states:** Performs no action if `TheWorld.components.dockmanager` is `nil` (e.g., in some test scenarios).

### `OnUpdateProjectile(inst)`
*   **Description:** Runs during projectile flight to detect and damage colliding entities. Checks target cooldown via `lastwasattackedtime` to avoid pass-through spam.
*   **Parameters:**
    *   `inst` (entity) — The cannonball projectile.
*   **Returns:** Nothing.
*   **Error states:** Skips collisions with bumpers and the attacker. Only damages walls/structures if they are on a *different* boat (or not on any boat).

### `common_fn(bank, build, anim, tag, isinventoryitem)`
*   **Description:** Shared constructor for both cannonball prefabs; sets up transform, animation, physics/projectile components, combat stats, and tags.
*   **Parameters:**
    *   `bank` (string) — Anim bank name (e.g., `"cannonball_rock"`).
    *   `build` (string) — Anim build name.
    *   `anim` (string or table of strings) — Animation(s) to play.
    *   `tag` (string or `nil`) — Tag to add to the entity (e.g., `"NOCLICK"`).
    *   `isinventoryitem` (boolean) — If true, uses `MakeInventoryPhysics` and omits physics collision; otherwise sets up full physics.
*   **Returns:** The initialized entity instance (`inst`).
*   **Error states:** Does not add `complexprojectile`/`combat`/`groundshadowhandler` components on the client (non-mastersim).

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent`.
- **Pushes:** `onareaattackother`, `healthdelta`, `stacksizechange`, `on_landed`, `on_no_longer_landed`.
- **Pushed on other entities:** `spawnnewboatleak`, `healthdelta` (via `target.components.health`), `workable` destruction events (via `workable:Destroy`).