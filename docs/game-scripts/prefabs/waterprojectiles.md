---
id: waterprojectiles
title: Waterprojectiles
description: Defines prefabs and behaviors for water-based projectiles (snowballs, water balloons, ink splats, bile splats, and water streaks), each implementing custom collision handling, projectile physics, and fire suppression or status effects via the wateryprotection and complexprojectile components.
tags: [combat, physics, fx, equipment, fire]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e4225011
system_scope: physics
---

# Waterprojectiles

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines five water-based projectile prefabs: `snowball`, `waterballoon`, `inksplat`, `bilesplat`, and `waterstreak_projectile`. Each prefab is constructed using a shared `common_fn` factory and customized with specific properties (e.g., projectile physics, on-hit behavior, and `wateryprotection` settings). The projectiles leverage the `complexprojectile` component for movement and impact logic, and the `wateryprotection` component to apply area-of-effect fire suppression or status changes (e.g., cooling, wetting, ink application). The `waterballoon` is also equipped as an inventory item with reticule targeting, equippable state, and water-source functionality.

## Usage example
```lua
-- Create a waterballoon and equip it
local balloon = SpawnPrefab("waterballoon")
balloon.components.equippable:Equip(player)
balloon.components.weapon:SetDamage(5)
balloon.components.complexprojectile:SetHorizontalSpeed(20)

-- Or spawn a snowball directly
local snowball = SpawnPrefab("snowball")
snowball.components.complexprojectile:SetGravity(-30)
```

## Dependencies & tags
**Components used:** `complexprojectile`, `wateryprotection`, `combat`, `inkable`, `weapon`, `reticule`, `equippable`, `stackable`, `watersource`, `inventoryitem`, `inspectable`, `locomotor`, `physics`, `animstate`, `soundemitter`, `network`, `transform`, `inventoryfloatable`, `hauntablelaunch`

**Tags added/checked:**
- Adds: `projectile`, `complexprojectile`, `NOCLICK` (most), `weapon` (waterballoon), `watersource` (waterballoon)
- Checks: `INLIMBO`, `playerghost`, `player`, `debuffed`, `water` (indirectly via `IsOnOcean()`)

## Properties
No public properties are initialized directly in this file. All state is configured via component calls (e.g., `SetHorizontalSpeed`, `extinguishheatpercent`) and event handlers.

## Main functions
### `common_fn(bank, build, anim, tag, isinventoryitem)`
*   **Description:** Shared constructor for all waterprojectiles. Sets up core entities, physics, animation, and tags; adds `locomotor`, `wateryprotection`, and `complexprojectile` components; skips server-side work on clients.
*   **Parameters:**
    - `bank` (string): Animation bank name.
    - `build` (string): Build/asset name for AnimState.
    - `anim` (string or table): Animation name(s) to play.
    - `tag` (string? or nil): Optional tag to apply (e.g., `"NOCLICK"`, `"weapon"`).
    - `isinventoryitem` (boolean): If true, adds inventory physics (`MakeInventoryPhysics`); otherwise adds physics for freeflight projectiles.
*   **Returns:** `inst` (Entity) — the constructed entity.
*   **Error states:** Returns early on clients (`TheWorld.ismastersim == false`) without adding server-only components.

### `OnHitSnow(inst, attacker, target)`
*   **Description:** On-hit handler for snowballs. Spawns splash FX and spreads coldness/wetness suppression in a radius using `wateryprotection:SpreadProtection`.
*   **Parameters:**
    - `inst` (Entity): The projectile being destroyed.
    - `attacker` (Entity): The projectile's shooter.
    - `target` (Entity or nil): Hit target, unused here.
*   **Returns:** Nothing.
*   **Error states:** None; unaffected entities (e.g., `INLIMBO`, ghosts) are ignored.

### `OnHitWater(inst, attacker, target)`
*   **Description:** On-hit handler for water balloons. Spawns splash FX, spreads wetness/cooling via `wateryprotection:SpreadProtection`, and extinguishes fires in area.
*   **Parameters:** Same as `OnHitSnow`.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnHitInk(inst, attacker, target)`
*   **Description:** On-hit handler for ink splats. Spawns splash FX and applies `Ink()` to any entity with an `inkable` component.
*   **Parameters:** Same as `OnHitSnow`.
*   **Returns:** Nothing.
*   **Error states:** Only entities with `components.inkable` are affected.

### `OnHitBile(inst, attacker, target)`
*   **Description:** On-hit handler for bile splats. Spawns bile FX, places puddles depending on terrain (water/land), and deals splash damage to nearby entities.
*   **Parameters:** Same as `OnHitSnow`.
*   **Returns:** Nothing.
*   **Error states:** Entities without `combat` or with tags `INLIMBO`/`playerghost` are skipped.

### `OnHitWaterstreak(inst, attacker, target)`
*   **Description:** On-hit handler for water streaks (e.g., from Old Water Container). Spawns burst FX, conditionally spawns ocean splash if blocked, and spreads water protection over a wider radius.
*   **Parameters:** Same as `OnHitSnow`.
*   **Returns:** Nothing.
*   **Error states:** Uses `TUNING.WATERSTREAK_AOE_DIST` for spread radius.

### `onequip(inst, owner)` and `onunequip(inst, owner)`
*   **Description:** Equip/unequip callbacks for `waterballoon`. Manages visual arm state (`ARM_carry` vs `ARM_normal`) and overrides the `swap_object` symbol.
*   **Parameters:**
    - `inst`: The waterballoon.
    - `owner`: The player equipping it.
*   **Returns:** Nothing.

### `onthrown(inst)`
*   **Description:** Launch callback for `waterballoon`. Reconfigures physics and collision masks on launch, adds `NOCLICK`, sets `persists = false`, and switches animation.
*   **Parameters:**
    - `inst`: The projectile entity.
*   **Returns:** Nothing.

### `onuseaswatersource(inst)`
*   **Description:** Called when `watersource` component uses the item. Consumes the item (stack or single) to refill a target.
*   **Parameters:**
    - `inst`: The waterballoon.
*   **Returns:** Nothing.

### `ReticuleTargetFn()`
*   **Description:** Returns a valid ground target position for `waterballoon` reticule targeting within an 8-unit radius, avoiding blocked terrain.
*   **Parameters:** None.
*   **Returns:** `pos` (Vector3) — target position on ground.
*   **Error states:** Falls back to `Vector3()` if no valid point found.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this file).
- **Pushes:** None (no `inst:PushEvent` calls in this file).
