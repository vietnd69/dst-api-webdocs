---
id: SGabigail
title: Sgabigail
description: Manages Abigail's state machine, including her idle, movement, attack, transform, and special behaviors (e.g., dash attacks and gestalt mode transitions).
tags: [ai, combat, boss, stategraph, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: dd0ff5b0
system_scope: ai
---

# Sgabigail

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGabigail` defines the stategraph for Abigail (Wendy's ghost companion), governing her behavior through a collection of named states and event-driven transitions. It coordinates animation, movement, combat, and special abilities — including dash attacks, gestalt transformations, haunting, and interactions with other entities (e.g., summoning/recalling, dancing, and scaring). The stategraph integrates closely with components like `aura`, `combat`, `health`, `locomotor`, `colouradder`, and `timer`, and handles both standard and gestalt-specific logic.

## Usage example
```lua
-- The stategraph is automatically attached via the StateGraph constructor:
return StateGraph("abigail", states, events, "appear", actionhandlers)
-- No manual instantiation is required by modders.

-- Modders can extend or override states/events by referencing this file's exports.
-- Example: Hook into events in a mod to react to Abigail's actions:
inst:ListenForEvent("startaura", function(inst)
    -- Custom behavior when Abigail begins aura attack
end)
```

## Dependencies & tags
**Components used:**  
- `aura` (`Enable`, `applying`)  
- `colouradder` (`PushColour`, `PopColour`)  
- `combat` (`CanBeAttacked`, `CanTarget`, `DoAttack`, `GetAttacked`, `IsAlly`, `RestartCooldown`, `SetDefaultDamage`, `defaultdamage`, `target`, `hiteffectsymbol`, `areahitdamagepercent`, `CalcDamage`)  
- `debuffable` (`HasDebuff`)  
- `ghostlybond` (`SummonComplete`, `RecallComplete`)  
- `health` (`IsDead`, `SetCurrentHealth`, `SetInvincible`)  
- `locomotor` (`EnableGroundSpeedMultiplier`, `RunForward`, `Stop`, `StopMoving`, `WalkForward`)  
- `planardamage` (`externalbonuses`)  
- `timer` (`StartTimer`, `TimerExists`)  
- `sisturnregistry` (via `TheWorld.components.sisturnregistry:IsBlossom()`)  

**Tags:**  
- State tags include: `"idle"`, `"canrotate"`, `"busy"`, `"noattack"`, `"nointerrupt"`, `"moving"`, `"running"`, `"dancing"`, `"playful"`, `"swoop"`, `"dissipate"`, `"nocommand"`, `"doing"`, `"gestalt"` (inferred from checks), `"playing"` (inferred from checks).  
- Entity tags checked: `"gestalt"`, `"playerghost"`, `"companion"` (via `DASHATTACK_MUST_TAGS`).  
- Tags added programmatically: None directly; behavior toggles via component calls and state tags.

## Properties
No public properties are defined directly in this file; all data is stored per-instance in `inst.sg.mem`, `inst.sg.statemem`, or via component fields. Properties used internally include:
- `inst.attack_level` (number): Used to select attack animations (e.g., `"attack1"`, `"attack2"`).  
- `inst._is_transparent` (boolean): Controls animation fallback to `"abigail_escape_loop"`.  
- `inst.is_defensive` (boolean): Determines conditional use of `"idle_custom"` animation.  
- `inst._playerlink` (Entity): Reference to the associated player; used in gestalt and ghostly bond logic.

## Main functions
### `getidleanim(inst)`
* **Description:** Chooses a dynamic idle animation based on conditions (e.g., seasonal flickering, transparency, aura state, defense mode). Used in movement and idle states to ensure context-appropriate animation.  
* **Parameters:** `inst` (Entity) — the Abigail instance.  
* **Returns:** String — animation name (e.g., `"idle"`, `"idle_abigail_flicker"`, `"abigail_escape_loop"`).  
* **Error states:** Returns `nil` only if animation lookups fail; no explicit error handling.

### `startaura(inst)`
* **Description:** Initializes Abigail’s attack aura: sets red lighting and multicolour, plays an attack looping sound, spawns and configures `abigail_attack_fx` with skin overrides, and applies shadow FX if the murder debuff is present.  
* **Parameters:** `inst` (Entity) — the Abigail instance.  
* **Returns:** Nothing.  
* **Error states:** Returns early if Abigail is dead, in a `"dissipate"` state, or gestalt.

### `stopaura(inst)`
* **Description:** Reverts Abigail’s aura: restores default lighting and multicolour, kills the attack sound, and destroys the attack FX prefab.  
* **Parameters:** `inst` (Entity).  
* **Returns:** Nothing.

### `onattack(inst)`
* **Description:** Triggers a special `"gestalt_attack"` state transition if the instance is gestalt, alive, and not already in a `"busy"` state.  
* **Parameters:** `inst` (Entity).  
* **Returns:** Nothing.

### `dash_attack_onupdate(inst, dt)`
* **Description:** Handles area-of-effect (AoE) damage logic during dash attacks. Calculates nearby targets in range, checks validity (enemy, not ally), and applies delayed hits based on `aoe_attack_times` tracking. Ignores gestalt instances.  
* **Parameters:**  
  - `inst` (Entity) — Abigail instance.  
  - `dt` (number) — delta time since last update.  
* **Returns:** Nothing.  
* **Error states:** Aborts early if `aoe_attack_times` is `nil` or instance becomes gestalt mid-attack.

### `GetGestaltDashTarget(inst)`
* **Description:** Scans for valid PVP/PVE targets for gestalt dash attacks. Respects angle and distance constraints from `TUNING.ABIGAIL_GESTALT_*` constants.  
* **Parameters:** `inst` (Entity).  
* **Returns:** Entity or `nil`.  
* **Error states:** Returns `nil` if `inst._playerlink` is missing, no valid targets found, or target outside range/angle.

### `ApplyGestaltAttackAtDamageMultRate(inst, tabula, key, value)`
* **Description:** Temporarily scales damage values (e.g., `defaultdamage`, `basedamage`) by `TUNING.ABIGAIL_GESTALT_ATTACKAT_DAMAGE_MULT_RATE`, preserving original values to revert later. Tracks changes to avoid overriding external modifications.  
* **Parameters:**  
  - `inst` (Entity).  
  - `tabula` (Table) — damage table (e.g., `inst.components.combat`, `inst.components.planardamage`).  
  - `key` (string) — table key (e.g., `"defaultdamage"`).  
  - `value` (number, optional) — override value.  
* **Returns:** Nothing.

### `RemoveGestaltAttackAtDamageMultRate(inst, tabula, key)`
* **Description:** Reverts `tabula[key]` to its original value recorded during `ApplyGestaltAttackAtDamageMultRate`, if not externally modified.  
* **Parameters:**  
  - `inst` (Entity).  
  - `tabula` (Table).  
  - `key` (string).  
* **Returns:** Nothing.

### `StartFlash(inst, target, r, g, b)`
* **Description:** Triggers a timed color flash on `target` using `colouradder` for visual feedback (e.g., after a hit).  
* **Parameters:**  
  - `inst` (Entity) — source instance (for unique ID).  
  - `target` (Entity) — entity to flash.  
  - `r`, `g`, `b` (numbers) — RGB color components (0–1).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"doattack"` → `onattack(inst)`  
  - `"startaura"` → `startaura(inst)`  
  - `"stopaura"` → `stopaura(inst)`  
  - `"attacked"` → enters `"hit"` state (if not dead, dissolving, or uninterruptible)  
  - `"dance"` → enters `"dance"` state (if not busy/dissolving/dancing)  
  - `"gestalt_mutate"` → enters `"abigail_transform_pre"` with `data.gestalt`  
  - `"start_playwithghost"` → queues play target (if delay has elapsed and target is valid)  
  - `"animover"` → handled per-state (see states below)  

- **Pushes:**  
  - `"onareaattackother"` → during dash attack AoE (in `dash_attack_onupdate`)  
  - `"ghostlybond_summoncomplete"` / `"ghostlybond_recallcomplete"` → via `ghostlybond` component callbacks  
  - `"invincibletoggle"` → via `health:SetInvincible()`  
  - `"locomote"` → via `locomotor:Stop()`  
  - `"stopaura"` → via `aura:Enable(false)`  
  - `"do_ghost_scare"` → during `"scare"` state timeline  
  - Custom state exit events (e.g., `"ghostlybond_summoncomplete"`)  
