---
id: SGshark
title: Sgshark
description: Manages the state machine for shark entities, handling transitions between idle, swimming, attacking, jumping, eating, and death states.
tags: [ai, combat, locomotion, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a9172beb
system_scope: entity
---

# Sgshark

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshark` defines the state graph for shark entities in DST, governing behavioral transitions such as idle swimming, leaping attacks, biting, eating prey, and death. It integrates closely with the `combat`, `health`, `locomotor`, `amphibiouscreature`, and `timer` components to adapt behavior based on environment (water vs land), target presence, and entity state. The graph supports amphibious locomotion and includes support for common utility states (e.g., sleep, frozen, electrocute, corpse) via `CommonStates`.

## Usage example
This stategraph is automatically assigned to shark prefabs by the engine. Modders typically extend or override behavior via component logic or by registering event handlers outside this file:

```lua
-- Example: Listening for a shark attack event
local function OnSharkAttack(inst, data)
    -- Custom logic when shark attacks
end
inst:ListenForEvent("doattack", OnSharkAttack)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `amphibiouscreature`, `timer`  
**Tags added/removed/checked:**  
- *State tags:* `idle`, `canrotate`, `busy`, `attack`, `hit`, `jumping`, `leap_electrocute`, `walking`  
- *Entity tags:* `swimming`, `walking`, `dead` (via `OnDeath` handler), `leaper`, `aquatic` (inferred from usage)  
- *AOE search exclusions:* `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`, `"notarget"`

## Properties
No public properties are defined in this file. Behavior is controlled via entity instance state and component methods.

## Main functions
### `DoAttack(inst)`
*   **Description:** Performs area-of-effect (AOE) attack targeting. Scans for valid targets within a configurable range and executes combat attack if any are found.
*   **Parameters:** `inst` (Entity) — the shark instance executing the attack.
*   **Returns:** Nothing.
*   **Error states:**None; silently skips attack if no valid targets are found.

### `findwater(inst)`
*   **Description:** Calculates a valid water position for the shark to leap toward when emerging from water. Uses radial fan-search to locate the nearest non-ground point.
*   **Parameters:** `inst` (Entity) — the shark instance.
*   **Returns:** `offset` (Vector3) — relative offset to current position indicating target water point.
*   **Error states:**search radius increases in increments of 4 units until valid water is found (no explicit failure case).

## Events & listeners
**Listens to:**  
- `leap` — initiate a jump state.  
- `dobite` — trigger a bite sequence.  
- `attacked` — enter hit or electrocute state.  
- `doattack` — initiate attack on specified target.  
- `dive_eat` — begin pre-eating dive if food is above water.  
- `animover`, `animqueueover` — state progression.  
- Sleep, hop, locomote, freeze, electrocute, death, and corpse handlers from `CommonHandlers`.  

**Pushes:**  
- `droppedtarget` (via `Combat.DropTarget`)  
- Custom events are not directly pushed, but transition actions invoke component-driven side effects (e.g., camera shake, splash FX).  

**State events handled by common handlers (via `CommonStates`):**  
- `onsleep`, `onhop`, `onlocomote`, `onfreeze`, `onelectrocute`, `ondeath`, `oncorpsechomped`, `oncorpsedeathanimover`  

*(Note: Full list of events is provided via the `events` array and `CommonStates` helper calls in source.)*