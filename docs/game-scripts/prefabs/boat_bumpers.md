---
id: boat_bumper_kit
title: Boat Bumper Kit
description: Creates and configures deployable bumper prefabs for boats, handling health, repairs, destruction, and interaction with boat ring systems.
tags: [boat, inventory, combat, physics]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a2192e14
system_scope: world
---

# Boat Bumper Kit

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boat_bumpers.lua` is a factory module that defines the structure and behavior of deployable boat bumpers — interactive, destructible structures placed on the perimeter of boats. Each bumper (kelp, shell, yotd, crabking) is represented by three prefabs: the实体 object, a deployable kit item, and a placer component. Bumpers integrate with the `boatring` component to register themselves on boats, react to collisions, be hammered for loot, and transition visually based on health percentage.

## Usage example
```lua
-- The module is not used directly by modders; it is called internally to generate prefabs.
-- Example of consuming one generated bumper prefab:
local bumper = SpawnPrefab("boat_bumper_shell")
if bumper and bumper:IsValid() then
    -- Bumpers are typically placed via the deployable kit and placer logic,
    -- but raw placement requires snapping to a boat edge:
    local boat = GetClosestPlayerBoat()
    if boat and boat.components.boatring then
        SnapToBoatEdge(bumper, boat, bumper:GetPosition())
        boat.components.boatring:AddBumper(bumper)
    end
end
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `savedrotation`, `repairable`, `health`, `burnable` (via helpers), `propagator` (via helpers), `workable`, `hauntable`, `placer` (for kit/placer), `boatring`, `boatringdata`.  
**Tags added:** `boatbumper`, `mustforceattack`, `noauradamage`, `walkableperipheral`, plus type-specific tags (`kelp`, `shell`, `collision_world_safe`, etc.).

## Properties
No public properties are exposed in the constructor. Health and burn parameters are configured via the `data` table passed to `MakeBumperType(data)`.

## Main functions
### `MakeBumperType(data)`
*   **Description:** Factory function that generates three prefabs — a bumper entity, a deployable kit item, and a placer — based on the provided configuration. Handles animations, component initialization, event listeners, and network synchronization.
*   **Parameters:**
    *   `data` (table) — Configuration table with fields:
        *   `name` (string) — Identifier for the bumper type (e.g., `"kelp"`, `"shell"`).
        *   `material` (string) — Repair material used.
        *   `tags` (table) — Additional tags to apply.
        *   `loot` (string?) — Prefab name to drop on hammering, or `nil`.
        *   `maxloots` (number?) — Max number of loot items to drop based on remaining health, or `nil`.
        *   `maxhealth` (number) — Max HP for the bumper.
        *   `flammable` (boolean) — Whether the bumper burns.
        *   `buildsound` (string) — Sound to play on build/repair.
        *   `kitpostinit` (function?) — Optional post-init function for the kit item.
*   **Returns:**
    *   `Prefab` — The bumper entity prefab.
    *   `Prefab` — The deployable kit item prefab.
    *   `Prefab` — The placer prefab.
*   **Error states:** No explicit error handling; failures typically occur during deployment or event callbacks (e.g., if `boat` is `nil`, bumper placement is silently skipped).

### `getanimthreshold(inst, percent)`
*   **Description:** Determines the animation tier index based on health percentage.
*   **Parameters:**
    *   `inst` (Entity?) — The bumper instance (used implicitly to evaluate health).
    *   `percent` (number) — Health percentage in `[0, 1]`.
*   **Returns:** `number` — Tier index (`1` = healthy, `3` = most damaged, or `#ANIM_THRESHOLDS` = destroyed).
*   **Error states:** Returns `3` if `percent < 0`.

### `onhealthchange(inst, old_percent, new_percent)`
*   **Description:** Callback triggered on health change; drives state transitions (damage animations, death).
*   **Parameters:**
    *   `inst` (Entity) — The bumper instance.
    *   `old_percent` (number) — Previous health percentage.
    *   `new_percent` (number) — New health percentage.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `inst` is invalid or in a `dead` state.

### `CanDeployAtBoatEdge(inst, pt, mouseover, deployer, rot)`
*   **Description:** Custom deployment validator ensuring the bumper is placed only on or adjacent to a boat edge.
*   **Parameters:**
    *   `inst` (Entity?) — The bumper entity being deployed (unused in function).
    *   `pt` (Vector3) — Deployment point.
    *   `mouseover` (Entity?) — Optional hovered object.
    *   `deployer` (Entity?) — Deploying entity (unused).
    *   `rot` (number?) — Rotation (unused).
*   **Returns:** `boolean` — `true` if deployment is valid on a boat edge.
*   **Error states:** Returns `false` if no boat is found nearby.

### `CrabkingKit_OnDroppedAsLoot(inst)`
*   **Description:** Custom loot logic for crabking bumper kits — sets stack size to a dedicated constant.
*   **Parameters:**
    *   `inst` (Entity) — The kit entity.
*   **Returns:** Nothing.

### `shell_kit_masterpostinit(inst)`
*   **Description:** Sets the scrapbook icon scale for shell kits.
*   **Parameters:**
    *   `inst` (Entity) — The kit entity.
*   **Returns:** Nothing.

### `crabking_kit_masterpostinit(inst)`
*   **Description:** Attaches custom loot handling for crabking kits and registers the `on_loot_dropped` event.
*   **Parameters:**
    *   `inst` (Entity) — The kit entity.
*   **Returns:** Nothing.

### `setup_boat_placer(inst)`
*   **Description:** Configures the placer component to snap bumpers to boat edges and set correct animation properties.
*   **Parameters:**
    *   `inst` (Entity) — The placer entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — handles bumper placement on a boat and plays build sound.
- **Listens to:** `boatcollision` — triggers hit animation if bumper is not `busy`.
- **Listens to:** `death` — removes bumper from boat's bumper list.
- **Listens to:** `on_loot_dropped` (crabking kits only) — enforces stack size.
- **Pushes:** None directly. Fire-and-forget effects use `SpawnPrefab`.
