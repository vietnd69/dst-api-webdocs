---
id: SGshadowthrall_horns
title: Sgshadowthrall Horns
description: Manages the state machine and combatbehaviour for the Shadow Thrall (Horns) boss, handling states like jumping, slapping, faceplanting, and devouring targets.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1c476a3b
system_scope: entity
---

# Sgshadowthrall Horns

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This file defines the stategraph for the Shadow Thrall (Horns) boss entity, coordinating movement, attacks, and visual effects across multiple states. It is responsible for high-level boss behaviour such as `jump` (faceplant), `slap`, `idle`, `spawn`, and `death`, as well as coordinating team attacks with associated entities (`hands`, `wings`) via the `entitytracker` component. It integrates closely with `combat`, `locomotor`, `health`, `workable`, and `lootdropper` components.

## Usage example
```lua
-- Typically instantiated by the `shadowthrall_horns` prefab, no manual usage required
-- Example event registration (internal to the SG):
inst:ListenForEvent("doattack", function(inst, data)
    if not inst.sg:HasStateTag("busy") then
        ChooseAttack(inst, data)
    end
end)
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `health`, `locomotor`, `workable`, `lootdropper`  
**Tags:** Adds/removes `busy`, `idle`, `canrotate`, `caninterrupt`, `nointerrupt`, `attack`, `jumping`, `appearing`, `invisible`, `temp_invincible`, `NOCLICK`, `canmove` via `AddTag`/`RemoveTag`.

## Properties
No public properties defined. All configuration is externalized to `TUNING` constants and `StateGraph` internals.

## Main functions
### `DoAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets, devour)`
*   **Description:** Performs area-of-effect attacks against entities in a radius around the boss. Optionally devours players within a tighter radius. Handles damage, knockback, and tracking of already-hit targets.
*   **Parameters:**
    *   `inst` (Entity) — The boss instance performing the attack.
    *   `dist` (number) — Forward offset to calculate attack origin.
    *   `radius` (number) — Base attack radius.
    *   `heavymult` (number) — Knockback multiplier for heavy-armoured targets.
    *   `mult` (number) — Knockback multiplier for regular targets.
    *   `forcelanded` (boolean) — Whether knockback forces target to land.
    *   `targets` (table) — Table used to track already-hit entities.
    *   `devour` (boolean or Entity) — Whether to attempt devouring players; if a player, tries to devour them.
*   **Returns:** `Entity` or `nil` — The devoured player entity if devoured, otherwise `nil`.
*   **Error states:** May skip invalid, dead, or non-targetable entities.

### `DoAOESlap(inst)`
*   **Description:** Performs a directional beam-like slap attack in front of the boss, using location and angle constraints to filter valid targets.
*   **Parameters:** `inst` (Entity) — The boss instance performing the slap.
*   **Returns:** Nothing.
*   **Error states:** Skips invalid, dead, or non-targetable entities.

### `DoAOEWork(inst, dist, radius, targets)`
*   **Description:** Destroys collidable world objects (e.g., trees, walls) in an area of effect. Targets are filtered by work actions (e.g., `CHOP`, `HAMMER`) and tags.
*   **Parameters:**
    *   `inst` (Entity) — The boss instance.
    *   `dist` (number) — Forward offset to calculate origin.
    *   `radius` (number) — Area radius.
    *   `targets` (table) — Table to track destroyed objects.
*   **Returns:** Nothing.
*   **Error states:** Only destroys objects that are `CanBeWorked()` and have valid `work_action.id` from allowed set.

### `SetTeamAttackCooldown(inst, isstart)`
*   **Description:** Synchronizes attack timing between the boss and its `hands`/`wings` entity subcomponents. Ensures coordinated attacks share cooldowns and target info.
*   **Parameters:**
    *   `inst` (Entity) — The boss instance.
    *   `isstart` (boolean) — If `true`, starts attack and records timestamp; if `false`, restarts cooldown.
*   **Returns:** Nothing.

### `IsDevouring(inst, target)`
*   **Description:** Checks whether a target is currently in a devoured state and being devoured by this boss.
*   **Parameters:**
    *   `inst` (Entity) — The boss instance.
    *   `target` (Entity) — Target to check.
*   **Returns:** `boolean` — `true` if the target is valid, has state tag `devoured`, and its attacker memory matches `inst`.

### `DoChew(inst, target, useimpactsound)`
*   **Description:** Delivers damage while the target is devoured, optionally suppressing impact sound.
*   **Parameters:**
    *   `inst` (Entity) — The boss instance.
    *   `target` (Entity) — The devoured target.
    *   `useimpactsound` (boolean) — If `true`, suppresses impact sound.
*   **Returns:** Nothing.

### `DoSpitOut(inst, target)`
*   **Description:** Triggers the target to be spat out from the devoured state, reactivating targeting.
*   **Parameters:**
    *   `inst` (Entity) — The boss instance.
    *   `target` (Entity) — The devoured target to spit out.
*   **Returns:** Nothing.

### `ResetTeamTarget(inst)`
*   **Description:** Ensures `hands` and `wings` entities share the same target as the boss.
*   **Parameters:** `inst` (Entity) — The boss instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
    *   `doattack` — Triggers `ChooseAttack` if not `busy`.
    *   `locomote` — Handled via `CommonHandlers.OnLocomote`.
    *   `fallinvoid` — Handled via `CommonHandlers.OnFallInVoid`.
    *   `onattacked` — Handled via `CommonHandlers.OnAttacked`.
    *   `ondeath` — Handled via `CommonHandlers.OnDeath`.
- **Pushes:** None directly; relies on component-level events (e.g., `knockback`, `devoured`, `spitout`) triggered via `PushEvent`/`PushEventImmediate`.

Stategraph events such as `animover` and `timeline` `FrameEvent` callbacks drive transitions between states (`idle`, `walk`, `jump`, `slap`, `spit`, `death`, etc.).