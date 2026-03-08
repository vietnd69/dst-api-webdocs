---
id: SGshadow_bishop
title: Sgshadow Bishop
description: Manages the state machine and combat behavior for the Shadow Bishop boss entity during its attack cycle in Don't Starve Together.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: ff4e65ef
system_scope: entity
---

# Sgshadow Bishop

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadow_bishop` defines the full state graph for the Shadow Bishop boss, controlling its attack patterns, movement, and transitions. It inherits common states (idle, taunt, hit, death, etc.) from `SGshadow_chesspieces` and extends them with a multi-phase attack sequence (`attack` → `attack_loop` → `attack_loop_pst` → `attack_pst`) that includes periodic area-of-effect attacks, invincibility windows, and positional teleports. The state graph handles the entity’s physics, animation, sound, and visual effects synchronization during boss encounters.

## Usage example
This stategraph is instantiated automatically when the Shadow Bishop entity is created and does not require direct manual instantiation by modders. It is registered and used internally by the entity's `StateGraph` component.

```lua
-- Internally, the stategraph is loaded and assigned to the entity via:
inst:AddComponent("stategraph")
inst.components.stategraph:ChangeState("idle")
-- All states and logic are defined in SGshadow_bishop.lua and inherited states from SGshadow_chesspieces.lua
```

## Dependencies & tags
**Components used:** `combat`, `health`
**Tags:** `attack`, `busy`, `noattack` (applied via state tags during attack phases)

## Properties
No public properties are defined in this stategraph. All state behavior is controlled through internal state logic and `inst.sg.statemem` for transient state data.

## Main functions
### `DoSwarmAttack(inst)`
*   **Description:** Performs an area-of-effect attack around the Shadow Bishop, damaging nearby valid targets within `hitrange`.
*   **Parameters:** `inst` (entity instance) - the Shadow Bishop entity triggering the attack.
*   **Returns:** Nothing (uses `Combat:DoAreaAttack` internally).
*   **Error states:** Does not return any value; failures in `DoAreaAttack` are silently handled by the component.

### `DoSwarmFX(inst)`
*   **Description:** Spawns a `shadow_bishop_fx` prefab at the Shadow Bishop's position and scales/orients it to match the entity for visual feedback during attacks.
*   **Parameters:** `inst` (entity instance) - the Shadow Bishop entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `animover` - triggers state transitions upon animation completion (e.g., advance from pre-attack to loop).
  - All events defined in `ShadowChess.CommonEventList` (inherited from `SGshadow_chesspieces.lua`), including `hit`, `death`, `taunt`, etc.
- **Pushes:** No events are explicitly pushed by this stategraph; it relies on state transitions and `inst.sg:GoToState()` for control flow.