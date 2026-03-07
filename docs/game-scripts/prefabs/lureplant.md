---
id: lureplant
title: Lureplant
description: Acts as a hostile, spellcasting entity that spawns minions and consumes bait to lure and attack players and creatures.
tags: [combat, ai, boss, minion]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c76d54cb
system_scope: entity
---

# Lureplant

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `lureplant` is a hostile, spellcasting entity that functions as a boss or elite mob in DST. It remains hidden underground and periodically reveals bait using the `shelf` component. When bait is collected, it enters the "picked" state, halting minion production and entering a temporary hibernation period. It spawns minions via the `minionspawner` component, digests loot with the `digester` component, and supports seasonal hibernation during winter. It integrates with `health`, `lootdropper`, `eater`, and `workable` components for core survival mechanics.

## Usage example
```lua
local inst = SpawnPrefab("lureplant")
inst.Transform:SetPosition(x, y, z)
inst:DoTaskInTime(0, function() inst:PushEvent("freshspawn") end)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `shelf`, `inventory`, `eater`, `inspectable`, `lootdropper`, `workable`, `minionspawner`, `digester`, `hauntable`  
**Tags added:** `lureplant`, `hostile`, `veggie`, `lifedrainable`, `wildfirepriority`, `NPCcanaggro`, `NPC_workable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lure` | entity or nil | `nil` | The current bait item placed on the shelf. |
| `lurefn` | function | `SelectLure` | Function that selects or creates bait for display. |
| `hibernatetask` | task or nil | `nil` | Timer task controlling re-emergence after hibernation. |
| `wintertask` | periodic task or nil | `nil` | Periodic task during winter to extend hibernation. |

## Main functions
### `TryRevealBait(inst)`
*   **Description:** Attempts to select and expose bait on the shelf. If successful, transitions to the `"showbait"` state. If not, schedules a retry after a delay.
*   **Parameters:** `inst` (entity) — the lureplant instance.
*   **Returns:** Nothing.
*   **Error states:** If no valid bait is available and no minions have been spawned to spare, creates and uses `plantmeat` as fallback bait.

### `HideBait(inst)`
*   **Description:** Hides the current bait, cancels pending bait attempts, transitions to `"hidebait"` state, and schedules re-emergence.
*   **Parameters:** `inst` (entity) — the lureplant instance.
*   **Returns:** Nothing.
*   **Error states:** No-op if already in `"hiding"` or if the plant is dead.

### `OnPicked(inst)`
*   **Description:** Handles the player collecting bait. Disables bait, kills all minions, enters hibernation, and schedules re-emergence.
*   **Parameters:** `inst` (entity) — the lureplant instance.
*   **Returns:** Nothing.

### `SelectLure(inst)`
*   **Description:** Chooses bait from the lureplant's inventory. Prioritizes tagged `"lureplant_bait"` items. If none exist and minion count meets threshold, creates `plantmeat`.
*   **Parameters:** `inst` (entity) — the lureplant instance.
*   **Returns:** entity or nil — selected bait or `nil`.

### `OnDeath(inst)`
*   **Description:** Handles death logic: stops minion spawning, kills all minions, drops loot, and triggers game-wide cheevo event.
*   **Parameters:** `inst` (entity) — the lureplant instance.
*   **Returns:** Nothing.

### `CanDigest(owner, item)`
*   **Description:** Determines whether an item should be digested. Items *not* currently on the shelf are digested; items *on* the shelf are only digested if stack size > `5`.
*   **Parameters:** `owner` (entity), `item` (entity).
*   **Returns:** boolean — `true` if digestible.

### `CollectItems(inst)`
*   **Description:** Periodically collects items from minion inventories into the main inventory, adjusting perishability if present.
*   **Parameters:** `inst` (entity) — the lureplant instance.
*   **Returns:** Nothing.

### `ExtendHibernation(inst)`
*   **Description:** Extends hibernation duration if already hibernating during winter, or immediately enters hibernation if not.
*   **Parameters:** `inst` (entity) — the lureplant instance.
*   **Returns:** Nothing.

### `OnIsWinter(inst, iswinter)`
*   **Description:** Starts or stops periodic hibernation extension logic based on the world season.
*   **Parameters:** `inst` (entity), `iswinter` (boolean).
*   **Returns:** Nothing.

### `OnWorkFinished(inst, worker)`
*   **Description:** Automatically kills the lureplant when fully worked (hammered) by a player.
*   **Parameters:** `inst` (entity), `worker` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `death` — triggers `OnDeath`  
  `hidebait` — triggers `HideBait`  
  `onitemstolen` — triggers `OnPotentiallyPicked`  
  `startfiredamage` — triggers `OnStartFireDamage`  
  `stopfiredamage` — triggers `OnStopFireDamage`  
  `freshspawn` — triggers `FreshSpawn`  
  `minionchange` — triggers `OnMinionChange`  
  `loot_prefab_spawned` — triggers `OnLootPrefabSpawned`  
  `"iswinter"` world state — triggers `OnIsWinter`  
  `onremove` (on bait) — triggers `_OnLurePerished`
- **Pushes:** `perishchange` (via `perishable` component), `entity_droploot` (via `lootdropper`), `CHEVO_lureplantdied` (custom game event)