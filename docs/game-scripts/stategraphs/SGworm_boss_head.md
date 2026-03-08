---
id: SGworm_boss_head
title: Sgworm Boss Head
description: Controls the state machine for the head entity of the Worm Boss, managing emergence, eating, spitting, swallowing, movement, and death behaviors.
tags: [boss, ai, combat, inventory, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: fd3b943d
system_scope: entity
---

# Sgworm Boss Head

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGworm_boss_head` defines the state graph for the Worm Boss's head entity, handling all lifecycle behaviors including emergence from the ground, devouring and digesting targets, spitting or swallowing consumed entities, and death sequences. It coordinates closely with the `combat` component for damage calculation, the `inventory` component for managing swallowed items, and the `worm_boss_util` module for shared logic. The state graph is driven by events dispatched by the parent `worm_boss` entity and system events like death, hit, and electrocution.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("worm_boss_head")
-- Assume inst.worm is the parent Worm Boss entity
inst.sg = StateGraph("worm_boss_head", states, events, "idle")
inst.sg:GoToState("emerge", { ate = true })
```

## Dependencies & tags
**Components used:** `combat`, `inventory` (via `inst.worm.components.inventory`).
**Tags:** `worm_boss_head`, `dead`, `idle`, `busy`, `move`, `canrotate`, `canelectrocute`, `noelectrocute`, `electrocute`, `hit`. Tags are added and removed dynamically per state using `inst.sg:AddStateTag` and `inst.sg:RemoveStateTag`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hits` | number | `0` | Counts recent hit events; reset to 0 after 3 seconds. Used to determine if the `busy` tag is removed after 3 hits. |

## Main functions
### `IsDevouring(inst, target)`
*   **Description:** Determines if the target is currently being devoured by this worm boss head (i.e., in a "devoured" state with `attacker` set to this head).
*   **Parameters:** `inst` (entity) – the worm boss head; `target` (entity or `nil`) – the potential victim.
*   **Returns:** `boolean` – `true` if the target is valid, has a valid stategraph with the `devoured` tag, and was attacked by this head.
*   **Error states:** Returns `false` if `target` is `nil`, invalid, lacks a stategraph, or isn’t marked as devoured by this attacker.

### `DoChew(inst, target, useimpactsound)`
*   **Description:** Applies damage to a devoured target using the worm’s combat stats, optionally suppressing impact sound.
*   **Parameters:** `inst` (entity) – the worm boss head; `target` (entity) – the victim to damage; `useimpactsound` (boolean) – if `true`, preserves existing impact sound setting; otherwise, uses a dull impact sound.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `IsDevouring(inst.worm, target)` returns `false`.

### `ChewAll(inst)`
*   **Description:** Triggers `DoChew` for every entity currently stored in `inst.worm.devoured`.
*   **Parameters:** `inst` (entity) – the worm boss head.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `death` – Starts death states (`death` or `death_loop`); dispatched by parent `worm_boss`.
  - `death_ended` – Moves to `death_ended` state.
  - `deathunderground` – Enters `death_underground` state.
  - `attacked` – Triggers `hit` state unless `busy`.
  - `sync_electrocute` – Enters `sync_electrocute` state if not `busy` or if in a valid electrocute state.
  - `worm_boss_move` – Enters `move` state if not busy or moving.
  - `taunt` – Enters `taunt` state.
- **Pushes:** None — this component consumes events but does not dispatch custom events itself. (`death_ended` is dispatched by the state graph when the `death_ended` state completes.)
