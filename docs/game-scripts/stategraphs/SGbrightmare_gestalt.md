---
id: SGbrightmare_gestalt
title: Sgbrightmare Gestalt
description: Manages the state machine for the Brightmare Gestalt boss entity, controlling its behavior including emergence, movement, idle, attack, relocation, and capture states.
tags: [combat, ai, boss, stategraph, gestalt]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 93d44810
system_scope: entity
---

# Sgbrightmare Gestalt

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbrightmare_gestalt` is the state graph (`StateGraph`) that defines the complete behavioral state machine for the Brightmare Gestalt boss entity in DST. It handles transitions between idle, walking, attacking (both normal and guard variants), relocating (teleporting), emerging, dying, and being captured. It interacts closely with the `locomotor`, `combat`, `gestaltcapturable`, `sanity`, and `grogginess` components to manage movement, targeting, combat execution, and status effects on players during attacks.

## Usage example
This state graph is automatically used by the Brightmare Gestalt prefab. Modders typically do not directly instantiate or configure this state graph; instead, they may extend or override its behavior by modifying the underlying state definitions or byhooking into its events. Example of a typical integration pattern:

```lua
-- In a prefab file (e.g., gestaltboss.lua):
local inst = CreateEntity()
inst:AddComponent("locomotor")
inst:AddComponent("combat")
inst:AddComponent("gestaltcapturable")
inst:AddComponent("sanity")
inst:AddComponent("grogginess")

inst:AddStateGraph("gestalt", MakeStateGraph("gestalt", states, events))
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `gestaltcapturable`, `sanity`, `grogginess`  
**Tags:** States add tags such as `idle`, `moving`, `busy`, `noattack`, `canrotate`, `attack`, `jumping`, `hidden`, `invisible`, `nointerrupt`. The `captured` state adds the `NOCLICK` tag.

## Properties
No public properties.

## Main functions
This state graph itself is a `StateGraph` definition and does not expose standalone functions beyond the internal `State` definitions. However, two utility functions are defined in the file:

### `FindBestAttackTarget(inst)`
*   **Description:** Scans all players and returns the closest valid, visible, non-dead/non-ghost, non-stunned player within `TUNING.GESTALT_ATTACK_HIT_RANGE_SQ` range. Used by the `attack` state to find a target when no specific combat target is set.
*   **Parameters:** `inst` (Entity) — the Brightmare Gestalt instance.
*   **Returns:** `Entity?` — the closest valid player, or `nil` if none found.
*   **Error states:** Returns `nil` if no players meet the filtering criteria or are out of range.

### `DoSpecialAttack(inst, target)`
*   **Description:** Executes the Brightmare Gestalt’s signature attack on a player, applying sanity drain and grogginess/knockout effects. May optionally push a generic `"attacked"` event with zero base damage.
*   **Parameters:**  
    - `inst` (Entity) — the Brightmare Gestalt instance.  
    - `target` (Entity) — the player entity being attacked.
*   **Returns:** Nothing.
*   **Error states:** No direct error return; effects are applied if the respective components (`sanity`, `grogginess`) exist on the target.

## Events & listeners
The state graph listens to the following events via global `EventHandler` definitions:

- **Listens to:**  
  - `"locomote"` — triggers walk_start/walk_stop transitions based on movement intent and capturability.  
  - `"gestaltcapturable_targeted"` — forces walk_stop if the entity becomes targeted while moving.  
  - `"death"` — transitions to the `"death"` state.  
  - `"doattack"` — triggers `"attack"` or `"guardattack"` states based on `inst.isguard`.  
  - `"captured"` — immediately interrupts any state to go to `"captured"`.  

- **Pushes:**  
  - The state graph itself does not push high-level events. However, internal state functions (e.g., `DoSpecialAttack`) push `"attacked"` and `"sanitydelta"` events on targets.

State-specific listeners include:
- `"animover"` — used across many states (`idle`, `emerge`, `death`, `relocate`, `attack`, `guardattack`, `mutate_pre`, `captured`) to loop animations or transition to the next state after animation completion.
- `"entitysleep"` — in the `"death"` state, triggers immediate removal if the entity goes to sleep.
- `"ontimeout"` — in `"relocating"`, handles despawn or re-emergence logic after a delay.