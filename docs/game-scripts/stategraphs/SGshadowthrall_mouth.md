---
id: SGshadowthrall_mouth
title: Sgshadowthrall Mouth
description: Implements the full state machine for the Shadowthrall Mouth boss enemy, handling movement, stealth, leaping, and bite attacks.
tags: [ai, boss, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: dd2da00d
system_scope: combat
---

# Sgshadowthrall Mouth

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadowthrall_mouth` defines the state graph for the Shadowthrall Mouth enemy, a boss entity that uses stealth, leaping, and multi-stage bite attacks. It integrates with the `combat`, `health`, `locomotor`, `timer`, `lootdropper`, and `planardamage` components to manage behavior states, attack execution, movement, knockback, and death effects. The state graph supports both standard ground attacks and a specialized stealth-based stalking sequence with proximity-based leaping.

## Usage example
This stategraph is automatically assigned to the Shadowthrall Mouth entity prefab during its creation and is not manually invoked by modders. Example (internal engine usage):
```lua
-- This is typically set in the entity prefab file:
inst:AddComponent("stategraph")
inst.components.stategraph:ConstructStateGraph("SGshadowthrall_mouth")
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `timer`, `lootdropper`, `planardamage`, `inventory`  
**Tags managed:** Adds/removes `idle`, `busy`, `hit`, `attack`, `stealth`, `moving`, `jumping`, `invisible`, `temp_invincible`, `noattack`, `canrotate`, `caninterrupt`, `canmove`, `NOCLICK` as appropriate per state.

## Properties
No public properties are defined in this file.

## Main functions
### `ChooseAttack(inst, data)`
*   **Description:** Selects the next attack action based on current state and target availability. Decides between stealth smile, leaping, or direct bite attacks.
*   **Parameters:** `inst` (Entity), `data` (table, optional) - event data containing a `target` key.
*   **Returns:** Boolean `true` if an attack was selected and state transition requested, `false` otherwise.

### `DoBiteAOEAttack(inst)`
*   **Description:** Executes a bite-style area-of-effect (AOE) attack around the entity. Uses proximity and angle checks to hit targets in a small cone or circle. Supports tracking of repeated targets to reduce knockback effects.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `DoAOEAttack(inst, radius, heavymult, mult, forcelanded)`
*   **Description:** Performs a broader AOE attack around the entity with optional knockback. Applies different knockback multipliers based on armor type (heavy armor receives `heavymult`, others receive `mult`). If `mult` is `nil`, only triggers a `bit_by_shadowthrall_stealth` event instead of knockback.
*   **Parameters:**  
  `inst` (Entity)  
  `radius` (number) - radius of the attack  
  `heavymult` (number) - knockback strength multiplier for heavily armored targets  
  `mult` (number, optional) - knockback strength multiplier for other targets; if `nil`, no knockback is applied  
  `forcelanded` (boolean) - whether to force targets to land after knockback.

### `TryBiteRange(inst, target)`
*   **Description:** Determines if a biting target is within acceptable angle and distance range. Adjusts the entity's facing to align with the target if possible.
*   **Parameters:** `inst` (Entity), `target` (Entity or `nil`).
*   **Returns:** Boolean `true` if the target is in range and alignment is possible, `false` otherwise.

### `SetSpawnShadowScale(inst, scale)`
*   **Description:** Scales the entity's dynamic shadow size during death animations.
*   **Parameters:** `inst` (Entity), `scale` (number) - scale factor for shadow size.
*   **Returns:** Nothing.

### `StealthOnUpdateTracking(inst)`
*   **Description:** Used in stealth states to smoothly track a target's position using physics motor velocity overrides, simulating fluid stalking movement.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `doattack`, `locomote`, `attacked`, `enterstealth`, `animover`, `animqueueover`, `animqueueover`, `dupe_animover`, and `on_death` (via `CommonHandlers.OnDeath()`).  
- **Pushes:** `knockback` (with custom parameters), `bit_by_shadowthrall_stealth`, and internal state-driven events like `locomote`.