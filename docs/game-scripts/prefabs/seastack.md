---
id: seastack
title: Seastack
description: A breakable underwater rock entity that yields rocks when mined, serves as a collision obstacle for boats, and can be upgraded to spawn water plants; supports powder monkey tinting based on proximity to the Monkey Queen.
tags: [environment, physics, mining, upgrade]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c787e348
system_scope: environment
---

# Seastack

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`seastack` is a prefabricated environmental entity representing submerged rock formations in Don't Starve Together. It functions as a mineable resource, a boat collision obstacle, and supports dynamic visual tinting based on proximity to the Monkey Queen. The component is implemented in the `seastack.lua` prefab constructor and relies on several core components: `workable` for mining interactions, `lootdropper` for resource drops, `upgradeable` for conversion to water plants, and `floater` for buoyancy and obstacle physics. It also handles persistent state via save/load callbacks.

## Usage example
```lua
-- Typical usage is handled automatically by the prefab system. For custom spawn:
local stack = SpawnPrefab("seastack")
if stack and stack.Transform then
    stack.Transform:SetPosition(x, y, z)
    stack.components.workable:SetWorkLeft(10)  -- optional override
end
```

## Dependencies & tags
**Components used:** `boatphysics`, `floater`, `lootdropper`, `workable`, `upgradeable`, `inspectable`, `hauntable`
**Tags:** Adds `ignorewalkableplatforms`, `seastack`; checks `burnt` (indirectly, via `lootdropper` behavior). The spawner prefab additionally adds `CLASSIFIED`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackid` | number | `math.random(NUM_STACK_TYPES)` | Identifier (1–5) determining the rock's animation variant (`1_full`, `1_med`, `1_low`, etc.). |
| `tinted` | boolean | `false` | Whether the seastack is painted (tinted) due to proximity to the Monkey Queen. |
| `scrapbook_anim` | string | `"1_full"` | Animation name used in the Scrapbook UI. |
| `scrapbook_hide` | table | `{"paint_A", "paint_B"}` | Animation symbols to hide in Scrapbook UI. |

## Main functions
### `OnCollide(inst, data)`
*   **Description:** Handles collision between the seastack and a moving boat. Converts impact velocity into mining work applied to the rock.
*   **Parameters:** `inst` (Entity) – this seastack instance; `data` (table) – collision payload containing `other` (colliding entity) and `hit_dot_velocity` (normalized velocity projection).
*   **Returns:** Nothing.
*   **Error states:** Early-exits silently if `data.other` lacks a `boatphysics` component.

### `OnWork(inst, worker, workleft)`
*   **Description:** Callback executed after mining work completes. Destroys the seastack, spawns destruction FX, drops loot, and optionally triggers endgame event (unhandled by game logic).
*   **Parameters:** `inst` (Entity), `worker` (Entity) – entity performing the mining, `workleft` (number) – remaining work (should be `<= 0`).
*   **Returns:** Nothing.

### `OnUpgraded(inst, doer)`
*   **Description:** Converts the seastack into a water plant baby when upgraded (e.g., via "Upgrade to Water Plant" action). Spawns replacement prefabs and removes the seastack.
*   **Parameters:** `inst` (Entity), `doer` (Entity) – player performing the upgrade.
*   **Returns:** `waterplant_baby` (Entity) – the new entity (returned for modding hook purposes).

### `UpdateArt(inst)`
*   **Description:** Updates the animation to match current mine progress: `"stackid"_full`, `"stackid"_med`, or `"stackid"_low`.
*   **Parameters:** `inst` (Entity) – the seastack instance.
*   **Returns:** Nothing.

### `TestForPowderMonkeyTint(inst)`
*   **Description:** Determines whether the seastack should be tinted (painted) based on its squared distance to the Monkey Queen. Applies `paint_A` or `paint_B` animations if tinted.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes state (`stackid`, `tinted`) to save data.
*   **Parameters:** `inst` (Entity), `data` (table) – mutable save data table.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores seastack state after loading, including tinting logic and animation selection. Calls `UpdateArt`.
*   **Parameters:** `inst` (Entity), `data` (table) – loaded save data (may be `nil`).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `on_collide` – triggers `inst._OnCollide` (aliases `OnCollide`).
- **Pushes:** `CHEVO_seastack_mined` – event fired on destruction; documented as unused in-game. `floater_startfloating` – pushed via `floater:OnLandedServer()`. `itemplanted` – fired during upgrade.
- **Pushes (via component):** `entity_droploot` – from `lootdropper:DropLoot()`.