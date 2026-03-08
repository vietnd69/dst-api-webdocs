---
id: SGshadowthrall_hands
title: Sgshadowthrall Hands
description: Manages the state machine and attack behavior of the Shadow Thrall Hands entity, coordinating locomotion, AOE attacks, team coordination, and animation-driven scaling.
tags: [ai, combat, stategraph, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d08f0ac8
system_scope: ai
---

# Sgshadowthrall Hands

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadowthrall_hands` defines the complete state machine for the `shadowthrall_hands` entity, a boss companion in DST that fights in coordinated teams with horns and wings. It handles locomotion states (idle, walk, run), attack states (including multi-hit AOE sequences), death, spawn, and hit recovery. It interacts closely with the `combat`, `locomotor`, `entitytracker`, `health`, and `lootdropper` components to manage attacks, movement, and death behavior.

## Usage example
This is a stategraph definition, not a component added via `inst:AddComponent`. It is automatically assigned to the `shadowthrall_hands` prefab via `StateGraph("shadowthrall_hands", states, events, "idle")`. Modders typically reference it when creating custom prefabs or extending AI behavior, but do not instantiate it directly.

```lua
-- This stategraph is not directly instantiated by mods.
-- It is used internally by the game for the "shadowthrall_hands" prefab.
-- Example mod integration: extends states or overrides behavior in a fork:
-- local shadowthrall_hands = require("stategraphs/SGshadowthrall_hands")
-- table.insert(shadowthrall_hands.states, my_custom_state)
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `entitytracker`, `health`, `lootdropper`, `inventory`, `health`
**Tags:** Manages state tags `idle`, `busy`, `attack`, `moving`, `running`, `canrotate`, `softstop`, `appearing`, `noattack`, `temp_invincible`, `invisible`, `caninterrupt`, `hit`, `canmove`, `canattack`.
**AOE tags:** Targets must have tag `_combat`; targets cannot have `INLIMBO`, `flight`, `invisible`, `notarget`, `noattack`, `shadowthrall`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AOE_RANGE_PADDING` | number | `3` | Extra radius buffer added when querying entities for AOE attacks. |
| `AOE_TARGET_MUSTHAVE_TAGS` | table | `{ "_combat" }` | Required tags for an entity to be hit by AOE attacks. |
| `AOE_TARGET_CANT_TAGS` | table | `{ "INLIMBO", "flight", "invisible", "notarget", "noattack", "shadowthrall" }` | Tags that exclude an entity from being hit by AOE attacks. |
| `TEAM_ATTACK_COOLDOWN` | number | `1` | Minimum seconds between team attacks by horns/wings to prevent simultaneous strikes. |

## Main functions
### `ChooseAttack(inst, data)`
*   **Description:** Determines if the entity should begin movement toward its target. It checks if `horns` or `wings` sub-entities are already attacking, and if not, initiates `run_start` if the target is valid and not in a running state.
*   **Parameters:** `inst` (entity instance), `data` (table with `target` field or `nil`).
*   **Returns:** `true` if `run_start` was entered, otherwise `false`.
*   **Error states:** Returns `false` if `horns` or `wings` sub-entities are already in an attack state.

### `DoAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets)`
*   **Description:** Performs an area-of-effect attack at a calculated offset position. Targets within `radius + AOE_RANGE_PADDING` are checked for valid combat tags, health status, and `CanTarget`. Each valid target receives a `DoAttack` and optionally a `knockback` event.
*   **Parameters:**
    *   `dist` (number) — forward offset from the entity's facing direction (in world space).
    *   `radius` (number) — radius of the attack zone.
    *   `heavymult` (number or `nil`) — knockback multiplier for heavily armored targets.
    *   `mult` (number or `nil`) — knockback multiplier for normal targets.
    *   `forcelanded` (boolean or `nil`) — passed to knockback.
    *   `targets` (table or `nil`) — optional table used to track already-hit targets (prevents multi-hit per frame).
*   **Returns:** `true` if the primary `combat.target` was hit, otherwise `false`.
*   **Error states:** Skips targets that are invalid, in limbo, dead, or already tracked in `targets`.

### `SetShadowScale(inst, scale)`
*   **Description:** Sets the dynamic shadow size to `2 * scale` (width) by `scale` (height).
*   **Parameters:** `scale` (number) — scale factor.
*   **Returns:** Nothing.

### `SetSpawnShadowScale(inst, scale)`
*   **Description:** Sets the dynamic shadow size to `1.5 * scale` (width) by `scale` (height), used during spawn animation.
*   **Parameters:** `scale` (number) — scale factor.
*   **Returns:** Nothing.

### `SetTeamAttackCooldown(inst, isstart)`
*   **Description:** Synchronizes attack timing between the main entity and its `horns` and `wings` sub-entities to ensure attacks are staggered by at least `TEAM_ATTACK_COOLDOWN` seconds. Calculates formation angles for coordinated positioning.
*   **Parameters:**
    *   `inst` (entity instance) — the main shadow thrall entity.
    *   `isstart` (boolean) — if `true`, sets the base entity's attack time; otherwise just restarts its cooldown.
*   **Returns:** Nothing.
*   **Error states:** Formation calculation assumes `horns` and/or `wings` exist; if only one sub-entity exists, it is assigned to `formation + 180`.

## Events & listeners
- **Listens to:** `doattack`, `locomote`, `animover`, `attacked`, `OnFallInVoid`, `OnAttacked`, `OnDeath`.
- **Pushes:** `knockback` (via `v:PushEvent("knockback", ...)`) during AOE hits.
- **Handles timeline frame events:** `FrameEvent(n, fn)` used extensively to control animation-synchronized actions (shadow scaling, sounds, physics toggling, tag removal).