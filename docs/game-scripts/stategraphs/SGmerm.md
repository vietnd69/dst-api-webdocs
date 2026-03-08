---
id: SGmerm
title: Sgmerm
description: Manages the state machine for Merm characters, including idle behaviors, transformations, combat, and special animations for lunar or shadow variants.
tags: [ai, combat, animation, transformation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 03751b0b
system_scope: entity
---

# Sgmerm

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmerm` defines the state graph (`StateGraph`) for Merm entities in DST, controlling how Merms behave across various scenarios—including idle movement, combat attacks, tool usage (chop, mine, hammer), sitting, transformation into Merm King, lunar mutations, shadow spawning, and death/revival. It integrates closely with core components such as `combat`, `health`, `follower`, `locomotor`, `inventory`, `tool`, and `workable`. The state graph also responds to world-level events (e.g., `onmermkingcreated_anywhere`) and custom ones (e.g., `merm_lunar_revive`, `shadowmerm_spawn`). The `funnyidle` and `idle_sit` states reflect behavioral nuances like loyalty and guardian roles.

## Usage example
This file is not used directly as a component. Instead, it is registered as a state graph and attached to Merm prefabs (e.g., `merm.lua`, `mermking.lua`) during prefab initialization via `inst:AddStateGraph("merm")`.

```lua
-- Inside a Merm prefab definition
inst:AddStateGraph("merm")

-- Example event listener for transformation (not part of SGmerm itself)
inst:ListenForEvent("onarrivedatthrone", function(inst)
    -- Logic that triggers state transitions, e.g., sit -> transform_to_king
end)
```

## Dependencies & tags
**Components used:**
- `combat` (`DoAttack`, `StartAttack`, `HasTarget`, `externaldamagemultipliers`)
- `follower` (`GetLeader`, `GetLoyaltyPercent`)
- `health` (`IsDead`, `SetPercent`)
- `inventory` (`GetEquippedItem`)
- `locomotor` (`EnableGroundSpeedMultiplier`, `Stop`, `StopMoving`)
- `mermkingmanager` (`ShouldTransform`)
- `shadowparasitemanager` (`ReviveHosted`)
- `tool` (`GetEffectiveness`)
- `workable` (`CanBeWorked`, `WorkedBy`)

**Tags:**  
- State tags applied in states include: `"idle"`, `"busy"`, `"chopping"`, `"mining"`, `"hammering"`, `"sitting"`, `"gettingup"`, `"transforming"`, `"attack"`, `"hit"`, `"shadow_hit"`, `"nospellcasting"`, `"noelectrocute"`, `"canrotate"`, `"jumping"`, `"nosleep"`, `"nofreeze"`.  
- Entity tags checked: `"guard"`, `"shadowminion"`, `"lunarminion"`, `"lunar_merm_revivable"`.

## Properties
No public properties are initialized in the state graph constructor. State-specific memory is stored via `inst.sg.mem` and `inst.sg.statemem`.

## Main functions
The `SGmerm` module defines state handlers and event callbacks through `StateGraph` registration; it does not expose standalone public functions. However, helper functions used internally are documented below.

### `GetIdleAnim(inst)`
* **Description:** Determines which idle animation to use based on loyalty, guard status, and tiredness. Returns `"debuff"` (tired animation) under specific conditions, otherwise `"idle_loop"`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `"idle_loop"` or `"debuff"` (string).
* **Error states:** Returns `"idle_loop"` unless all conditions for tiredness are met (time interval, `ShouldWaitForHelp()`, and random chance).

### `tool_or_chop(inst)`
* **Description:** Returns `"use_tool"` if the equipped hand item has a tool component, otherwise `"chop"`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `"use_tool"` or `"chop"` (string).

### `tool_or_mine(inst)`
* **Description:** Returns `"use_tool"` if the equipped hand item has a tool component, otherwise `"mine"`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `"use_tool"` or `"mine"` (string).

### `GetAttackState(inst)`
* **Description:** Returns `"tri_attack"` if triple attack is available (`inst:CanTripleAttack()`), otherwise `"attack"`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `"attack"` or `"tri_attack"` (string).

### `GetHitState(inst)`
* **Description:** Returns `"hit_shadow"` if the entity has the `"shadowminion"` tag, otherwise `"hit"`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `"hit"` or `"hit_shadow"` (string).

## Events & listeners
- **Listens to:**
  - `doattack`: Initiates `GetAttackState(inst)` transition if not busy or stunned.
  - `attacked`: Triggers hit state (`GetHitState(inst)`) with stun mitigation checks.
  - `attackdodged`: Go to `"dodge_attack"` with attacker context.
  - `onarrivedatthrone`: Triggers sit/stand/transform logic based on `mermkingmanager`.
  - `getup`, `mutated`, `demutated`: Directly transition to `"getup"`, `"lunar_transform"`, or `"lunar_revert"`.
  - `onmermkingcreated_anywhere`, `onmermkingdestroyed_anywhere`: Transition to `"buff"` or `"debuff"`.
  - `cheer`, `win_yotb`, `merm_use_building`, `shadowmerm_spawn`, `merm_lunar_revive`: Play thematic animations.
  - `onCorpseChomped`: Standard corpse handling via `CommonHandlers`.
  - Common event handlers: `OnLocomote`, `OnSleep`, `OnFreeze`, `OnElectrocute`, `OnDeath`, `OnHop`, `OnSink`, `OnFallInVoid`.

- **Pushes:**
  - `oncandidatekingarrived`: Focused on throne arrival (via `transform_to_king`).
  - Internal state transitions (e.g., `animover` → `"idle"`).
  - No custom `PushEvent` calls beyond standard engine callbacks.
