---
id: mosquito
title: Mosquito
description: Acts as a small, flying insect that feeds on characters, shares combat targets with nearby mosquitoes, and splats when overfed or haunted.
tags: [combat, flying, ai, looting, hauntable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d91e323c
system_scope: entity
---

# Mosquito

> Based on game build **714004** | Last updated: 2026-03-06

## Overview
The `mosquito` prefab implements a small, flying combat entity that feeds on characters to grow (visually increasing body size) and splats when overfed or successfully haunted. It uses a custom brain (`mosquitobrain`) for basic AI, interacts with the `combat` system to target and share attacks, and integrates with multiple utility components including `sleeper`, `lootdropper`, `workable`, and `hauntable`. It cannot be picked up unless alive (`canbepickedupalive = true`), and it plays looping buzzing sounds while idle or on the ground.

## Usage example
```lua
local inst = Prefab("mosquito", mosquito, assets, prefabs)
-- Instantiate via SpawnPrefab("mosquito")
-- The prefab handles its own initialization; no manual component setup needed.
```

## Dependencies & tags
**Components used:** `locomotor`, `stackable`, `inventoryitem`, `lootdropper`, `tradable`, `workable`, `follower`, `health`, `combat`, `sleeper`, `knownlocations`, `inspectable`, `hauntable`, `feedable`, `burnable`, `freezeable`

**Tags added:** `mosquito`, `insect`, `flying`, `ignorewalkableplatformdrowning`, `smallcreature`, `cattoyairborne`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `drinks` | number | `1` | Number of times the mosquito has fed; controls body size. |
| `maxdrinks` | number | `TUNING.MOSQUITO_MAX_DRINKS` | Maximum feedings before splatting (death). |
| `toofat` | boolean | `false` | Set to `true` when overfed and killed. |
| `lastleader` | Entity reference | `nil` | Stores the last leader when leadership changes occur. |
| `sounds` | table | Local sounds table | Sound keys for takeoff, attack, buzz, hit, death, and explosion. |

## Main functions
### `OnWorked(inst, worker)`
*   **Description:** Triggered when the mosquito is netted by a player. Detaches child items (if stacked), kills sounds, and gives the mosquito to the player's inventory.
*   **Parameters:** 
    - `inst` (Entity) — The mosquito entity.
    - `worker` (Entity) — The player who worked on the mosquito.
*   **Returns:** Nothing.

### `StartBuzz(inst)`
*   **Description:** Starts the looping buzzing sound if the mosquito is held, asleep, or already buzzing, it does nothing.
*   **Parameters:** `inst` (Entity) — The mosquito entity.
*   **Returns:** Nothing.

### `StopBuzz(inst)`
*   **Description:** Stops the buzzing sound.
*   **Parameters:** `inst` (Entity) — The mosquito entity.
*   **Returns:** Nothing.

### `StoreHomePos(inst, allow_overwrite)`
*   **Description:** Records the mosquito’s current position as its "home" location via `knownlocations`.
*   **Parameters:** 
    - `inst` (Entity) — The mosquito entity.
    - `allow_overwrite` (boolean) — Whether an existing "home" location may be overwritten.
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Handles behavior when the mosquito is dropped: sets state to "idle", restarts buzzing, resets work left, and splits stack if applicable (teleports each copy to same position and stores home).
*   **Parameters:** `inst` (Entity) — The mosquito entity.
*   **Returns:** Nothing.

### `OnPickedUp(inst)`
*   **Description:** Stops buzzing and all sounds when picked up.
*   **Parameters:** `inst` (Entity) — The mosquito entity.
*   **Returns:** Nothing.

### `KillerRetarget(inst)`
*   **Description:** Custom retargeting logic: finds a valid target within 20 units that is not holding mosquito musk, is not an ally, and can be targeted by combat.
*   **Parameters:** `inst` (Entity) — The mosquito entity.
*   **Returns:** Entity reference to a suitable target, or `nil`.

### `SwapBelly(inst, size)`
*   **Description:** Updates the visible body part (`body_N`) based on how many times the mosquito has fed.
*   **Parameters:** 
    - `inst` (Entity) — The mosquito entity.
    - `size` (number) — The feeding count (1–4); determines which body part is shown.
*   **Returns:** Nothing.

### `TakeDrink(inst, data)`
*   **Description:** Called on `onattackother` event: increments feed count, updates body size, and kills mosquito if overfed.
*   **Parameters:** 
    - `inst` (Entity) — The mosquito entity.
    - `data` (table) — Attack event data (unused beyond triggering).
*   **Returns:** Nothing.

### `ShareTargetFn(dude)`
*   **Description:** Predicate used when sharing combat targets: returns `true` for living mosquitoes.
*   **Parameters:** `dude` (Entity) — The candidate helper entity.
*   **Returns:** `true` if `dude` is a mosquito and not dead; otherwise `false`.

### `OnAttacked(inst, data)`
*   **Description:** On receiving damage, sets attacker as target and shares the aggro with up to 10 nearby mosquitoes within ~30 units.
*   **Parameters:** 
    - `inst` (Entity) — The mosquito entity.
    - `data` (table) — Contains `attacker` (Entity).
*   **Returns:** Nothing.

### `OnChangedLeader(inst, new_leader, prev_leader)`
*   **Description:** Stores `new_leader` in `lastleader` if leadership changes.
*   **Parameters:** 
    - `inst` (Entity) — The mosquito entity.
    - `new_leader` (Entity or `nil`) — New leader.
    - `prev_leader` (Entity or `nil`) — Previous leader.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onattackother` — Calls `TakeDrink` to increment feed count.
  - `attacked` — Calls `OnAttacked` to set and share combat targets.
- **Pushes:**
  - `detachchild` — Fired when a mosquito is netted and splits from stack (via `OnWorked`).