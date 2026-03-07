---
id: rabbitking
title: Rabbitking
description: Implements the Rabbit King and its minions, including passive (shopkeeper), aggressive (combat-focused), bunnyman minion, and lucky (trap-catchable) variants with associated combat, leadership, and transformation logic.
tags: [boss, ai, combat, leader]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 83abcc51
system_scope: entity
---

# Rabbitking

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `rabbitking` prefab defines four related entities: `rabbitking_passive`, `rabbitking_aggressive`, `rabbitkingminion_bunnyman`, and `rabbitking_lucky`. These prefabs implement the Rabbit King boss mechanic and its bunnyman minions within the Entity Component System. The `rabbitkingmanager` component coordinates world-level behavior, while individual prefabs handle variant-specific traits via state graphs, brains, and component setups. Key interactions include combat targeting, minion summoning and leadership, sanity effects, loot drops, and special transformations (e.g., lucky rabbit king被捕获后 transforming back to active boss form).

## Usage example
```lua
-- Spawn an aggressive Rabbit King variant
local rk = SpawnPrefab("rabbitking_aggressive")
if rk and rk.components.combat then
    rk.components.combat:SetDefaultDamage(50)
end

-- Spawn a bunnyman minion and assign it to a leader
local minion = SpawnPrefab("rabbitkingminion_bunnyman")
if minion and minion.components.follower then
    minion.components.follower:SetLeader(some_leader_entity)
end

-- Check if the aggressive Rabbit King can summon more minions
if rk and rk.CanSummonMinions and rk:CanSummonMinions() then
    rk:SummonMinions()
end
```

## Dependencies & tags
**Components used:**  
`colouradder`, `locomotor`, `eater`, `knownlocations`, `drownable`, `health`, `lootdropper`, `combat`, `inspectable`, `sleeper`, `sanityaura`, `prototyper`, `talker`, `bloomer`, `named`, `follower`, `inventoryitem`, `acidinfusible`, `leader`, `timer`

**Tags added/checked:**  
`animal`, `rabbit`, `rabbitking`, `stunnedbybomb`, `companion`, `prototyper`, `scarytoprey`, `character`, `pig`, `manrabbit`, `rabbitking_manrabbit`, `prey`, `smallcreature`, `canbetrapped`, `_named`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rabbitking_kind` | string | `"passive"`, `"aggressive"`, or `"lucky"` | Identifies the variant type; set in `fn_common` constructor and used for logic branching. |
| `ConvertLuckyToRabbitKing` | function | None | Reference to transformation function; attached only on `rabbitking_lucky`. |
| `CanSummonMinions` | function | None | Predicate method on aggressive Rabbit King checking summon cooldown and follower count. |
| `SummonMinions` | function | None | Triggers minion spawn sequence with visual effect. |
| `FindMinionSpawnPos` | function | None | Finds valid terrain position near the Rabbit King for minion summoning. |
| `BringMinions` | function | None | Teleports all bunnyman followers to specified point. |
| `CanDropkick` | function | None | Predicate checking dropkick ability cooldown. |
| `scrapbook_hide` | table | `{"hat", "ARM_carry", "HAIR_HAT"}` | List of symbols to hide in scrapbook view; set on `rabbitkingminion_bunnyman`. |
| `sounds` | table | `nil` | Custom sound overrides; set on `rabbitking_lucky` variant. |

## Main functions
### `CheckRabbitKingManager(inst)`
*   **Description:** Ensures only one active Rabbit King exists world-wide via the `rabbitkingmanager`. If no manager exists or limit is exceeded, forces burrow state.
*   **Parameters:** `inst` (Entity) — The Rabbit King instance.
*   **Returns:** Nothing.
*   **Error states:** Calls `inst.sg:GoToState("burrowaway")` early if manager is absent.

### `fn_passive()`
*   **Description:** Constructs the passive shopkeeper variant with prototyper functionality and positive sanity aura.
*   **Parameters:** None (uses `fn_common` internally).
*   **Returns:** Entity — Fully configured `rabbitking_passive` prefab instance.
*   **Error states:** Returns client-side proxy instance (without components) when `TheWorld.ismastersim` is false.

### `fn_aggressive()`
*   **Description:** Constructs the aggressive combat variant with minion leadership, negative sanity aura, and combat retargeting logic.
*   **Parameters:** None (uses `fn_common` internally).
*   **Returns:** Entity — Fully configured `rabbitking_aggressive` prefab instance.
*   **Error states:** Returns client-side proxy instance when `TheWorld.ismastersim` is false.

### `fn_bunnyman()`
*   **Description:** Constructs a bunnyman minion with combat, follower, and leadership integration; supports teleporting to leader position while sleeping via `OnEntitySleep`.
*   **Parameters:** None.
*   **Returns:** Entity — Fully configured `rabbitkingminion_bunnyman` prefab instance.
*   **Error states:** Returns client-side proxy instance when `TheWorld.ismastersim` is false.

### `fn_lucky()`
*   **Description:** Constructs the catchable, non-combat variant used during trap mechanics; self-destructs upon successful capture by player or transformation to active Rabbit King.
*   **Parameters:** None (uses `fn_common` internally).
*   **Returns:** Entity — Fully configured `rabbitking_lucky` prefab instance.
*   **Error states:** Returns client-side proxy instance when `TheWorld.ismastersim` is false.

## Events & listeners
- **Listens to:**  
  `onwenthome` — Removes the entity (for lucky variant).  
  `ondropped` — Cancels pending conversion task and sets entity removal on sleep (lucky variant).  
  `onputininventory` — Schedules conversion to active Rabbit King via task (lucky variant).  
  `safelydisarmedtrap` — Triggers immediate conversion to active Rabbit King (lucky variant).  
  `isfullmoon` — Applies bloom shader to bunnyman on full moon; clears otherwise.

- **Pushes:**  
  `dotrade` — Fired when player activates passive Rabbit King (via prototyper).  
  `leaderchanged` — Sent via `Follower:SetLeader` when leader changes.  
  `burrowto`, `burrowarrive` — Used for minion teleporting and visual state transitions.