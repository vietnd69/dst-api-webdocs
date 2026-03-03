---
id: buzzardbrain
title: Buzzardbrain
description: Controls the AI decision-making logic for buzzards, including food targeting, threat detection, and corpse defense or abandonment behavior.
tags: [ai, combat, behaviour, food]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 2f32453d
system_scope: brain
---

# Buzzardbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Buzzardbrain` implements the behavior tree for buzzard entities in DST. Its primary responsibility is to guide buzzard movement and interaction: seeking and consuming placed food (e.g., corpses), defending food when attacked, and fleeing threats or fire depending on mutation state. Regular buzzards (non-mutated) prioritize food they can see and aggressively defend it; mutated buzzards (tagged `lunar_aligned`) do not consume food but instead actively seek corpses to defend and attack non-mutated intruders. The brain integrates with the `combat`, `health`, `burnable`, and `locomotor` components, and uses custom behavior nodes (`StandAndAttack`, `Wander`, `Leash`) to drive state transitions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("buzzardbrain")
-- Additional setup (tags, combat, health, etc.) handled by prefab definition
```

## Dependencies & tags
**Components used:** `combat`, `health`, `burnable`, `locomotor`  
**Tags checked:** `buzzard`, `lunar_aligned`, `player`, `monster`, `scarytoprey`, `notarget`, `playerghost`, ` creaturecorpse`, `NOCLICK`, `NOINTERACT`, `INLIMBO`, `outofreach`, `edible_omni`, `edible_meat`, `edible_veggie`, `edible_insect`, `edible_fruit`, `edible_mushroom`  
**Tags added:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `corpse` | entity or `nil` | `nil` | Reference to the current corpse being eaten/defended. |
| `corpse_time` | number | `GetTime()` | Timestamp of last corpse abandonment; used for mutation-based flight logic. |
| `threat` | boolean or entity | `false` | Cached threat: `false` = untested, `nil` = none found, entity = threat found. |
| `shouldGoAway` | boolean | `false` | Flag indicating the buzzard should flee. |
| `_on_corpse_ignite` | function | `nil` | Event handler attached to the corpse's `onignite`. |
| `_on_corpse_chomped` | function | `nil` | Event handler attached to the corpse's `chomped`. |

## Main functions
### `OwnCorpse(corpse)`
*   **Description:** Claims a corpse for consumption or defense. Registers event listeners for `onignite` and `chomped` events on the corpse. Ensures only a limited number of buzzards (based on corpse size) can claim the same corpse.
*   **Parameters:** `corpse` (entity) — The corpse entity to claim.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the corpse is already fully occupied by the configured max owners.

### `LoseCorpseOwnership()`
*   **Description:** Releases ownership of the current corpse, removes event listeners, and resets internal state. Updates `corpse_time`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShouldIgnoreCorpse(corpse)`
*   **Description:** Determines if this buzzard should be prevented from eating the given corpse due to max-occupancy limits.
*   **Parameters:** `corpse` (entity) — The corpse entity to check.
*   **Returns:** `true` if this buzzard should ignore the corpse; `false` otherwise.
*   **Error states:** None. Uses global `ignorethese` table and `SIZE_TO_NUM_OWNERS` mapping.

### `FindCorpse()`
*   **Description:** Searches for a valid corpse within range. If found, calls `OwnCorpse`; otherwise, calls `LoseCorpseOwnership`.
*   **Parameters:** None.
*   **Returns:** `true` if a corpse was found and claimed; `false` otherwise.
*   **Error states:** None. Validity includes burning checks for non-mutated buzzards.

### `IsCorpseValid()`
*   **Description:** Checks if the currently owned corpse (`self.corpse`) is still valid for consumption/defense.
*   **Parameters:** None.
*   **Returns:** `true` if the corpse is valid; `false` otherwise.
*   **Error states:** Returns `false` if `self.corpse` is `nil` or invalid.

### `GetCorpsePosition()`
*   **Description:** Returns the position of the current valid corpse, or `nil` if none.
*   **Parameters:** None.
*   **Returns:** `{x, y, z}` (position vector) or `nil`.

### `FindThreat()`
*   **Description:** Finds a nearby threat within `SEE_THREAT_DIST` (shorter for mutated buzzards). Uses caching via the `threat` property to avoid recomputation.
*   **Parameters:** None.
*   **Returns:** Entity (threat) or `nil`.
*   **Error states:** None.

### `IsThreatened()`
*   **Description:** Determines if the buzzard is currently threatened (i.e., a threat exists and the stategraph is not busy).
*   **Parameters:** None.
*   **Returns:** Entity (threat) or `nil`.
*   **Error states:** Returns `nil` if the buzzard is in a busy state (`sleeping`, `busy`, `flight`).

### `DealWithThreat()`
*   **Description:** Handles threat response: if near food/corpse, attempts to defend (via `combat:SetTarget` or `combat:SuggestTarget`); if threat is unreachable or no food present, sets `shouldGoAway` to flee.
*   **Parameters:** None.
*   **Returns:** `true` if the buzzard engaged the threat or is defending; `false` if it failed to engage (e.g., threat already targeted by another buzzard in mutated case).
*   **Error states:** Returns `false` only for mutated buzzards if `combat:SuggestTarget` fails.

### `DoUpdate()`
*   **Description:** Called during behavior tree updates to refresh internal caches.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnStart()`
*   **Description:** Initializes the behavior tree root node with priority-based conditional logic: fleeing fire/threats, defending food, eating, wandering, and leashing to corpse. Sets up mutated vs non-mutated branching.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None. Behavior tree built using `PriorityNode`, `WhileNode`, `IfNode`, and action nodes (`StandAndAttack`, `Wander`, `Leash`, `FaceEntity`, `DoAction`, `ActionNode`).

### `OnStop()`
*   **Description:** Releases corpse ownership and cleans up event listeners.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onignite` on the current `corpse`: Suggests the igniting entity as a combat target if valid.
  - `chomped` on the current `corpse`: Sets the chomping entity as a combat target if valid (aggressive against non-mutated buzzards for regular buzzards; against non-mutated entities for mutated buzzards).
- **Pushes:**
  - `corpse_eat` — emitted immediately when the buzzard faces and begins eating a valid corpse (during `chomp` node execution).
  - `locomote` — emitted by `locomotor:Stop()` (via `OnStop`, `DealWithThreat`, `EatFoodAction`, etc.).
