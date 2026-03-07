---
id: babybeefalo
title: Babybeefalo
description: A growth-stage-based animal prefab that matures through defined life phases, interacts with beefalo herds, and supports combat, foraging, and periodic waste production.
tags: [entity, growth, herd, combat, animal]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3476127c
system_scope: entity
---

# Babybeefalo

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`babybeefalo` is a prefabricated entity representing the juvenile life stage of the beefalo. It uses the `growable` component to progress through distinct growth stages (`baby`, `toddler`, `teen`, `grown`), each associated with visual scaling, loot table changes, and resistance values. It integrates with the `herdmember` and `leader` systems to seek adoption by an adult beefalo leader during gameplay, and supports basic combat and foraging behaviors via dedicated components. The prefab also maintains network synchronization, spawns poop periodically, and responds to environmental hazards like fire and cold.

## Usage example
```lua
local inst = SpawnPrefab("babybeefalo")
inst.Transform:SetPosition(x, y, z)
inst.components.growable:SetStage(2) -- set to toddler stage
inst.components.growable:StartGrowing() -- resume growth timer
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `follower`, `growable`, `health`, `herdmember`, `locomotor`, `lootdropper`, `periodicspawner`, `sleeper`, `inspectable`, `knownlocations`, `drownable`, `hauntable`, `soundemitter`, `animstate`, `transform`, `dynamicshadow`, `network`  
**Tags added:** `beefalo`, `baby`, `animal`, `herdmember`  
**Tags used in filtering:** `player`, `debuffed` (for aggro decisions), and `herdmember` (for herd membership)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `growUpPending` | boolean | `false` | Internal flag indicating a pending growth transition when sleeping. |
| `sounds` | table | `nil` (assigned at runtime) | Table mapping sound names to paths (e.g., `["walk"]`, `["grunt"]`). |
| `growth_stages` | table | defined internally | Array of stage definitions: `{name, time, fn, growfn}` used by the `growable` component. |

## Main functions
### `OnAttacked(inst, data)`
*   **Description:** Handles attack events by setting the attacker as the combat target and broadcasting the attack to nearby non-player beefalo herd members.
*   **Parameters:** `inst` (Entity), `data` (table containing `attacker`) — passed by the event system.
*   **Returns:** Nothing.

### `FollowGrownBeefalo(inst)`
*   **Description:** Scans for the nearest adult beefalo with open leader capacity and attempts to join its herd as a follower. Only considers beefalo with the `herdmember` tag and excludes `baby` tagged entities as potential leaders.
*   **Parameters:** `inst` (Entity) — the baby beefalo instance.
*   **Returns:** Nothing.

### `Grow(inst)`
*   **Description:** Initiates the next growth stage transition. If the entity is currently sleeping, schedules growth to begin after waking by setting `growUpPending` and forcing the "wake" state.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `SetBaby(inst)`, `SetToddler(inst)`, `SetTeen(inst)`, `SetFullyGrown(inst)`
*   **Description:** Stage-specific callbacks used by the `growable` component. These functions update the entity's scale, loot table, sleeper resistance, and, in the final stage, transform into a mature `beefalo`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `GetGrowTime()`
*   **Description:** Returns a randomized growth duration using tunable base and variance values.
*   **Parameters:** None.
*   **Returns:** `number` — time in seconds (e.g., `TUNING.BABYBEEFALO_GROW_TIME.base + random variance`).

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked` to initiate combat and share targeting.
- **Pushes:** None explicitly in this file (events are pushed by components or state graphs).
- **Internal event hooks:** Uses `inst:DoTaskInTime(1, FollowGrownBeefalo)` to defer leader adoption until one second after creation.