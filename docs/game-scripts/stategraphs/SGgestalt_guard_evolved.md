---
id: SGgestalt_guard_evolved
title: Sggestalt Guard Evolved
description: Defines the state graph for the evolved Gestalt Guard boss entity, managing its idle, movement, combat, and death behaviors through state transitions and timed events.
tags: [ai, boss, combat, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 23a2a7cb
system_scope: ai
---

# Sggestalt Guard Evolved

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This state graph defines the behavior of the evolved Gestalt Guard, a boss entity in DST. It handles entity states such as `idle`, `attack`, `attack_mid`, `attack_far`, `hit`, `teleport`, `teleporting`, `spawned`, `emerge`, and `death`. The state graph integrates with several components—including `combat`, `health`, `locomotor`, `lootdropper`, `follower`, `sanity`, and `grogginess`—to coordinate actions like AoE charge attacks, mid-range summoning, and far-range explosions. It uses frame events to trigger timed attack logic and leverages `CommonStates.AddWalkStates` for movement transitions.

## Usage example
This state graph is not instantiated directly by modders. It is automatically assigned to the Gestalt Guard (evolved variant) via its prefab definition using `inst.entity:AddStateGraph("gestalt_guard_evolved", "stategraphs/SGgestalt_guard_evolved")`. Modders would typically interact with it indirectly by modifying the entity's components (e.g., `combat`, `health`) or by overriding its `DoAttack_Mid`/`DoAttack_Far` methods if implemented.

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`, `follower`, `sanity`, `grogginess`
**Tags:** `idle`, `canrotate`, `busy`, `noattack`, `attack`, `jumping`, `hit`, `hidden`, `invisible`
Note: Tags like `busy`, `noattack`, and `attack` are used as stategraph tags (checked via `sg:HasStateTag`/`sg:HasAnyStateTag`).

## Properties
No public properties are defined in this state graph file. All configuration is embedded in state definitions and tunable constants (e.g., `TUNING.GESTALT_ATTACK_HIT_RANGE_SQ`, `TUNING.GESTALT_EVOLVED_TELEPORT_TIME_INVISIBLE`).

## Main functions
### `IsValidAttackTarget(inst, target, x, z, rangesq)`
*   **Description:** Determines whether a target is valid for attack based on range, health status, state tags, tags, and combat targeting rules.
*   **Parameters:**
    *   `inst` (entity) — the attacker entity.
    *   `target` (entity) — the candidate target.
    *   `x`, `z` (number) — the attacker's world coordinates.
    *   `rangesq` (number) — squared attack range.
*   **Returns:** Two values: a boolean (`isvalid`) indicating whether the target is valid, and a number (`dsq`) representing the squared distance to the target.
*   **Error states:** Returns `false, dsq` if the target is dead, in an invalid attack state (e.g., sleeping), tagged as `brightmare` or `brightmareboss`, or disallowed by `combat:CanTarget`.

### `FindAoEChargeAttackTarget(inst)`
*   **Description:** Finds the nearest valid AoE charge attack target within the predefined range (`TUNING.GESTALT_ATTACK_HIT_RANGE_SQ`), preferring the current `combat.target` and scanning all players if needed.
*   **Parameters:**
    *   `inst` (entity) — the attacker entity.
*   **Returns:** The target entity if found; otherwise `nil`.
*   **Error states:** Returns `nil` if no valid target exists or the combat component's target is invalid/out of range.

### `DoAoEChargeAttackHitOn(inst, target)`
*   **Description:** Executes theAoE charge attack effects on a target: sanity damage, combat attack, and grogginess application (if the target survives).
*   **Parameters:**
    *   `inst` (entity) — the attacker entity.
    *   `target` (entity) — the target entity.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the target lacks the required components; gracefully skips grogginess if the target is already dead or lacks `grogginess`.

## Events & listeners
- **Listens to:**
    - `spawned` — transitions to `spawned` state if not busy.
    - `death` — transitions to `death` state.
    - `doattack` — transitions to `attack` state (melee).
    - `doattack_mid` — transitions to `attack_mid` state.
    - `doattack_far` — transitions to `attack_far` state.
    - `attacked` — transitions to `hit` state if idle and not busy/dead.
    - `teleport` — transitions to `teleport` state with provided data.

- **Pushes:** None directly; events are handled internally by the state machine.
