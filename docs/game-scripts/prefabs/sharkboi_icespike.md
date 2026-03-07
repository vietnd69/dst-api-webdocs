---
id: sharkboi_icespike
title: Sharkboi Icespike
description: A deployable frozen ground spike that damages nearby entities, breaks collapsible workable structures, and can be mined for ice resources.
tags: [combat, structure, groundspike, mining]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2cafab91
system_scope: world
---

# Sharkboi Icespike

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sharkboi_icespike` is a deployable environmental trap prefab used by the Sharkboi character in DST. It spawns as a frozen ice spike with variable height and size, performs area-of-effect damage and knockback on nearby entities upon activation, and can be mined to yield ice resources. It supports dynamic sizing (small/large), randomized visual variations, and interactable state management via the `workable`, `lootdropper`, `pickable`, `mine`, and `savedrotation` components.

## Usage example
```lua
-- Spawn a small ice spike at world position (x, 0, z)
local spike = SpawnPrefab("sharkboi_icespike")
spike.Transform:SetPosition(x, 0, z)

-- Optional: manually set spike variation (1–3 = small, 4 = large)
spike:SetVariation(2)

-- The spike automatically becomes workable after 3 frames and damages entities nearby
-- Players or sharks can mine it using the MINE action
```

## Dependencies & tags
**Components used:** `workable`, `lootdropper`, `savedrotation`, `inventoryitem`, `mine`, `pickable`  
**Tags added:** `groundspike`, `frozen`, `FX`, `NOCLICK`, `CLASSIFIED`, `INLIMBO`  
**Tags checked:** `player`, `flying`, `shadow`, `ghost`, `NPC_workable`, `*_workable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number | `1` | Visual/spike style variation (1–4; 4 = large spike). |
| `islarge` | net_bool | `false` | Networked flag indicating if the spike is large-sized. |
| `dmgtask` | DoTaskInTime | `nil` | Task scheduled to trigger `DoDamage()` immediately on spawn. |
| `workabletask` | DoTaskInTime | `nil` | Task scheduled to make the spike workable after 3 frames. |
| `targets` | table | `nil` | Table mapping defeated entities to `true` to prevent repeated knockback. |

## Main functions
### `SetVariation(variation)`
* **Description:** Changes the visual appearance and size of the spike (1–3 = small, 4 = large). Automatically adjusts physics size and updates `workable` work left if already workable.
* **Parameters:** `variation` (number) – Variation index (1 to 4 inclusive). Values beyond range are clamped.
* **Returns:** Nothing.
* **Error states:** None. Invalid values are clamped; size transitions preserve remaining work进度.

### `DoDamage(inst)`
* **Description:** Applies area-of-effect damage and knockback to nearby entities. Destroys ice prefabs, knocks back players, and processes workable or pickable entities (e.g., destroys stumps, picks vegetation).
* **Parameters:** `inst` (Entity) – The spike instance performing damage.
* **Returns:** Nothing.
* **Error states:** Does nothing if entity is invalid. Filters out flying/ghost/non-targetable entities.

### `OnWork(inst, worker, workleft)`
* **Description:** Callback when the spike is mined or destroyed. Plays audio, drops loot, and triggers visual destruction FX if complete; otherwise updates animation level.
* **Parameters:**
  * `inst` (Entity) – The spike being worked.
  * `worker` (Entity) – The actor doing the work.
  * `workleft` (number) – Remaining work units before complete destruction.
* **Returns:** Nothing.
* **Error states:** If `workleft <= 0`, destroys spike; otherwise calls `RefreshWorkLevel`.

### `RefreshWorkLevel(inst, workleft)`
* **Description:** Updates the animation state based on remaining work progress (e.g., `spike1_low`, `spike4_med`).
* **Parameters:**
  * `inst` (Entity) – The spike.
  * `workleft` (number) – Current work remaining.
* **Returns:** `true` if animation changed; `nil` otherwise.

### `MakeWorkable(inst)`
* **Description:** Attaches the `workable` component and configures it for `ACTIONS.MINE`.
* **Parameters:** `inst` (Entity) – The spike instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animqueueover` – Triggers removal of the FX entity after destruction animation completes (in `OnWork`).
- **Pushes:** `knockback` (on players only) – Used by `DoDamage` to trigger knockback logic.
- **Pushes:** `picked`, `destroy` (via `pickable` and `workable` components) – Handled by standard behavior in connected components.