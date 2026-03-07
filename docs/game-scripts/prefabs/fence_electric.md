---
id: fence_electric
title: Fence Electric
description: Provides electrically conductive wall functionality with connection handling, damage mitigation, and deployment logic for fence structures.
tags: [combat, environment, electric, wall]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e6472cd9
system_scope: environment
---

# Fence Electric

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `fence_electric` prefab implements an electric fence wall in DST, providing pathfinding obstruction, electric shock resistance, and link-based power propagation. It uses the `electricconnector` component to link with adjacent fences and deploy fields, and integrates with `workable`, `combat`, `health`, `lootdropper`, and `deployable` components to handlehammering, damage, destruction, and item placement. It also manages pathfinding obstacle state for AI.

## Usage example
```lua
-- Instance creation for the fence wall itself
local wall = SpawnPrefab("fence_electric")
wall.Transform:SetPosition(x, 0, z)

-- Instance creation for the deployable item
local item = SpawnPrefab("fence_electric_item")
item.Transform:SetPosition(x, 0, z)
item.components.deployable:DoDeploy(pt, player, rot)
```

## Dependencies & tags
**Components used:** `combat`, `deployable`, `electricconnector`, `health`, `inspectable`, `lootdropper`, `placer`, `stackable`, `workable`

**Tags added:** `wall`, `fence`, `fence_electric`, `noauradamage`, `electric_connector`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_ispathfinding` | net_bool | `false` | Tracks whether this entity is registered as a pathfinding obstacle. |
| `_pfpos` | Vector3 or `nil` | `nil` | Stores world position used for pathfinding registration/removal. |
| `scrapbook_anim` | string | `"idle"` | Animation used when rendered in the scrapbook. |
| `scrapbook_build` | string | `"fence_electric"` | Build asset used in the scrapbook. |
| `scrapbook_bank` | string | `"fence_electric"` | Animation bank used in the scrapbook. |
| `scrapbook_facing` | number | `FACING_DOWN` | Facing direction used in the scrapbook. |
| `scrapbook_overridedata` | table | `SCRAPBOOK_OVERRIDESYMBOLDATA` | Override data for scrapbook symbol rendering. |
| `scrapbook_hide` | table | `SCRAPBOOK_HIDEDATA` | Symbols to hide in scrapbook view. |

## Main functions
### `InitializePathFinding(inst)`
*   **Description:** Registers event listeners and initializes the entity’s pathfinding obstacle status based on current `_ispathfinding` state.
*   **Parameters:** `inst` (Entity) — the fence instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnRemove(inst)`
*   **Description:** Ensures the entity is removed from pathfinding obstacles and triggers `OnIsPathFindingDirty` on destruction.
*   **Parameters:** `inst` (Entity) — the fence instance.
*   **Returns:** Nothing.

### `KeepTargetFn()`
*   **Description:** Used by `combat` component to prevent the fence from maintaining aggressive targeting.
*   **Parameters:** None.
*   **Returns:** `false`.

### `OnHammered(inst)`
*   **Description:** Handles fence destruction: drops loot, disconnects electric links, and spawns collapse FX before removing the instance.
*   **Parameters:** `inst` (Entity) — the fence instance.
*   **Returns:** Nothing.

### `OnWorked(inst)`
*   **Description:** Triggers the `hit` state animation when the fence is being worked on (hammered).
*   **Parameters:** `inst` (Entity) — the fence instance.
*   **Returns:** Nothing.

### `OnHit(inst, data)`
*   **Description:** Handles incoming attack events: triggers workable attacks if unlinked or immune; may electrocute attacker if connected, non-immune, and using non-projectile weapons.
*   **Parameters:** `inst` (Entity) — the fence instance; `data` (table) — attack event data including `attacker`, `damage`, `stimuli`, `weapon`.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `data` is `nil`, `attacker` is missing, or `damage <= 0`.

### `OnElectricallyLinked(inst)`
*   **Description:** Called when the fence is linked to another electric connector: lights up symbols and overrides light appearance.
*   **Parameters:** `inst` (Entity) — the fence instance.
*   **Returns:** Nothing.

### `OnElectricallyUnlinked(inst)`
*   **Description:** Called when the fence loses all electric links: hides light symbols and reverts light appearance.
*   **Parameters:** `inst` (Entity) — the fence instance.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Provides inspectable status: returns `"LINKED"` if electric connections exist.
*   **Parameters:** `inst` (Entity) — the fence instance.
*   **Returns:** `"LINKED"` or `nil`.

### `OnDeployFence(inst, pt, deployer, rot)`
*   **Description:** Handles fence deployment from the item: spawns a wall at the target point, teleports it, and plays placement sound/anim.
*   **Parameters:** `inst` (Entity) — the fence item; `pt` (Vector3) — target placement point; `deployer` (Entity) — deploying entity; `rot` (number) — rotation (unused).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — calls `OnHit` to handle electric shock logic.
- **Pushes:** `onispathfindingdirty` — used internally to update pathfinding registration; fired via `inst:PushEvent("onispathfindingdirty")` in `InitializePathFinding` and `OnIsPathFindingDirty`.
