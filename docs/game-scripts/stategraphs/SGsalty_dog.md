---
id: SGsalty_dog
title: Sgsalty Dog
description: Manages the state machine and behavior of the Salty Dog character, including movement, summoning, desummoning, interactions, and salt-shaking animations.
tags: [ai, locomotion, interaction, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 808d1b36
system_scope: entity
---

# Sgsalty Dog

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGsalty_dog` defines the state machine for the Salty Dog character, a pet entity in DST. It handles animation transitions, locomotion control (including temporary ground speed disabling during actions like pickup and give), interaction handling (giving items, picking up targets), and summoning/desummoning sequences relative to a hat (spawner). It integrates with common states for sleep, freeze, and electrocute states, as well as amphibious hopping logic.

## Usage example
```lua
-- The stategraph is automatically applied to the Salty Dog prefab via its stategraph definition.
-- In code, the Salty Dog entity is typically created as a child of a player's hat (the spawner).
-- Key interactions include triggering states via events:
inst:PushEvent("summon")
inst:PushEvent("desummon")
inst:PushEvent("saltshake")
inst:PushEvent("despawn")
```

## Dependencies & tags
**Components used:** `health`, `inventory`, `locomotor`, `spawner`  
**Tags checked/added:** `busy`, `idle`, `canrotate`, `jumping`, `nointerrupt`, `swimming`

## Properties
No public properties.

## Main functions
### `inst:ShedSalt()`
*   **Description:** Internal helper method (called via `inst:ShedSalt()`) to shed one salt particle. Not defined in this file but referenced in timeline frame events during the `saltshake` state.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Assumed safe if `inst` is valid; does not appear to have explicit failure modes in this stategraph.

### `inst:ShedAllSalt()`
*   **Description:** Internal helper method (called during `saltshake`) to shed all salt particles from the Salty Dog. Similar to `ShedSalt()`, this is defined externally but invoked here.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified.

## Events & listeners
- **Listens to:**  
  `attacked` — triggers `hit` state unless dead or already electrocuting.  
  `death` (via `CommonHandlers.OnDeath()`) — transitions to `death` state.  
  `sleep` / `freeze` / `electrocute` (via common handlers) — enters appropriate states.  
  `hop` (via `CommonHandlers.OnHop()`) — enters hop-related states for land/water transitions.  
  `locomote` (via `CommonHandlers.OnLocomote()`) — handles movement state transitions.  
  `summon` — enters `summon` state.  
  `desummon` — enters `desummon` state, drops inventory, and returns to hat or removes self.  
  `saltshake` — enters `saltshake` state if not `busy`.  
  `despawn` — enters `despawn` state, sets `persists = false`, and schedules removal.  
  `animover` — used across multiple states (`hit`, `saltshake`, `pickup`, `give`, etc.) to return to `idle` upon animation completion.

- **Pushes:**  
  `gohomefailed` — pushed by `spawner:GoHome()` on failure (via `desummon` logic).  
  Not directly pushed by this SG, but events it handles may trigger pushes elsewhere.