---
id: SGlunarthrall_plant
title: Sglunarthrall Plant
description: Manages the state machine and behavior of the Lunarthrall Plant boss, including idle, attack, hit, death, fatigue, and freeze states.
tags: [ai, boss, combat, freeze]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a4fb6606
system_scope: entity
---

# Sglunarthrall Plant

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph defines the full behavioral lifecycle of the Lunarthrall Plant boss entity in DST. It handles transitions between core states such as `idle`, `attack`, `hit`, `death`, and fatigue-related states (`tired_pre`, `tired`, `tired_wake`, `tired_pst`). It also integrates freeze/thaw mechanics via `frozen` and `thaw` states, and coördinates subordinate vine entities during these states. The stategraph uses helper functions like `DoAOEAttack` to execute area-of-effect combat logic and integrates with `commonstates` utilities for electrocution and freeze handling.

## Usage example
Stategraphs are not added directly to entities like components; instead, this stategraph is referenced by the boss prefab to set its `stategraph` property. Example usage in a prefab definition:
```lua
inst.stategraph = SGlunarthrall_plant
```

## Dependencies & tags
**Components used:** `combat`, `freezable`, `health`, `inventory`
**Tags added/removed:** `retaliates`, `busy`, `idle`, `frozen`, `thawing`, `dead`, `tired`, `wake`, `noelectrocute`, `noretaliate`
**Tags checked:** `_combat`, `INLIMBO`, `invisible`, `notarget`, `wall`, `noattack`, `heavyarmor`, `heavybody`, `lunarthrall_plant`, `lunarthrall_plant_end`

## Properties
No public properties. Configuration is done via local constants and runtime state stored on `inst` or `inst.sg.statemem`.

## Main functions
### `DoAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets)`
*   **Description:** Executes an area-of-effect attack from the plant, targeting all valid entities within a circular zone. Applies combat attacks and knockback with directional/armor-based strength modifiers.
*   **Parameters:**  
    `inst` (Entity) – The plant performing the attack.  
    `dist` (number) – Forward offset from the plant’s facing direction.  
    `radius` (number) – Base radius for targeting.  
    `heavymult` (number) – Knockback strength multiplier for heavily armored targets.  
    `mult` (number) – Knockback strength multiplier for normal targets.  
    `forcelanded` (boolean) – Forces knockback to land regardless of terrain.  
    `targets` (table, optional) – Table to track which targets have already been hit to avoid duplicates.
*   **Returns:** Nothing.
*   **Error states:** Skips invalid, dead, or immune targets. `ignorehitrange` is temporarily enabled to bypass standard combat range checks.

## Events & listeners
- **Listens to:**  
    `animover` – Restarts idle animation or transitions to next state.  
    `attacked` – Handles hit state or electrocution (see `CommonHandlers.TryElectrocuteOnAttacked`).  
    `death` – Triggers `death` state.  
    `unfreeze` / `onthaw` – Responds to freeze state transitions.  
    `electrocute` (via `CommonStates.AddElectrocuteStates`) – Handles electrocution loop/pst states for plant and vines.  
- **Pushes:** `knockback` (on hit), `death`, `unfreeze`, `electrocute` (via `PushEventImmediate` for vine sync).