---
id: SGcentipede
title: Sgcentipede
description: Defines the state machine behavior for the Archive Centipede entity, handling movement, idle, taunt, roll attacks, AOE attacks, and combat interactions.
tags: [ai, combat, locomotion, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d1895807
system_scope: ai
---

# Sgcentipede

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcentipede` is a stategraph that controls the behavior of the Archive Centipede entity. It defines a complete set of states—including idle, walk, taunt, roll, and attack variations—using helpers from `commonstates.lua` (`CommonStates.AddWalkStates`, `CommonStates.AddCombatStates`, etc.). The stategraph integrates with the `health`, `combat`, and `locomotor` components to manage movement, attack execution, and life cycle transitions (e.g., spawn, death, sleep, freeze, void fall). Attack logic includes both single-target strikes and area-of-effect (AOE) capabilities, with conditional checks based on entity tags and distance.

## Usage example
This stategraph is automatically assigned to the `centipede` entity during prefabs initialization (e.g., `inst:AddStateGraph("centipede")`). Modders extending or overriding behavior typically modify or wrap this file using `ReplicateStateGraph` or by overriding the `centipede` stategraph key in a `modmain.lua`. Direct manual instantiation is not required.

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`  
**Tags added/checked:** `idle`, `canrotate`, `canroll`, `busy`, `atk_pre`, `charge`, `canwalk`, `sleeping`, `frozen`, `falling`  
**AOE filters:** `AOE_MUST_TAGS = {"_combat", "_health"}`, `AOE_CANT_TAGS = {"ancient_clockwork", "archive_centipede", "INLIMBO", "flight", "invisible", "notarget", "noattack"}`, `AOE_ONEOF_TAGS = {"character", "monster", "shadowminion", "animal", "smallcreature"}`  
**Roll-specific filters:** `ROLL_CANT_TAGS` excludes structures and immobile entities.

## Properties
No public properties are exposed directly in this file. Stategraph state behavior is configured via callbacks (`onenter`, `onupdate`, `ontimeout`, etc.) and shared constants (e.g., `AOE_RANGE_PADDING`, `AOE_MUST_TAGS`).

## Main functions
### `doAOEattack(inst)`
* **Description:** Executes an area-of-effect attack on nearby valid targets, temporarily overriding the combat component’s default damage and range to use `TUNING.ARCHIVE_CENTIPEDE.AOE_DAMAGE` and `AOE_RANGE`. After the loop, it restores the single-target damage/range values. Does not return any value.
* **Parameters:** `inst` (entity instance) — the centipede performing the attack.
* **Returns:** Nothing.
* **Error states:** Targets are filtered by tags, validity, and alive status. Attacked only if within calculated range (AOE range + target physics radius). If `inst.components.combat` or `inst.components.combat.target` is `nil`, the function exits early.

### `attackexit(inst)`
* **Description:** Sets the `inst.doAOE` flag to `true` after a standard attack completes. This flag is later evaluated in the `idle` state to trigger an AOE attack if the condition is met.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `animover`: Returns to `idle` state after animation completes (used in `idle`, `taunt`, `spawn`, `roll_stop`, `atk_aoe`).
  - `locomote`: Triggered when movement stops/changes (via `CommonHandlers.OnLocomote`).
  - `sleep`, `freeze`, `attack`, `attacked`, `death`, `fallinvoid`: Provided by `CommonHandlers` (via `CommonStates`).
  - `rollattack`: Fires `roll_start` state if conditions (valid, not dead, `canroll` or `moving` state tag) are met.
  - `attackstart`: Pushed from `roll_start` → `roll` transition.
- **Pushes:**
  - `attackstart`: Fired at the end of `roll_start` to begin the `roll` state.
  - `locomote`: Fired by `LocoMotor:Stop()` and internally during transitions.
  - `rollattack`: Not pushed here—only listened for.
