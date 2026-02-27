---
id: wargbrain
title: Wargbrain
description: Controls AI behavior for warg and warglet entities, including state-dependent logic for reanimation, hound spawning, carcass consumption, and combat interactions.
tags: [ai, combat, boss, state, creature]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2e15596d
---

# Wargbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

Wargbrain is the decision-making component for warg and warglet entities. It implements a behavior tree that orchestrates responses to game conditions such as being in an intro state, transforming into a statue (clay wargs), responding to electric fences, spawning hounds (summoning), consuming carcasses, and engaging in combat.

This brain is shared by both `warg` and `warglet`, with behavioral adjustments based on entity tags (`clay`, `lunar_aligned`). It depends on the `Combat` and `Burnable` components for state evaluation, and integrates with custom behaviors (`StandStill`, `ChaseAndAttack`, `Leash`, `Wander`) to construct its decision logic.

## Usage example

This component is not added directly by modders. It is assigned internally to warg/warglet prefabs as their `brain` component, e.g.:

```lua
inst:AddBrain("wargbrain")
```

For modders: if extending or replicating behavior, initialize the brain like any other component and override `OnStart()` to modify the behavior tree root.

## Dependencies & tags

**Components used:**
- `combat`: accesses `HasTarget()`, `GetLastAttackedTime()`, `GetHitRange()`, `InCooldown()`
- `burnable`: accesses `IsBurning()`

**Tags checked:**
- `clay`: triggers statue loop logic (periodically pushes `becomestatue` event)
- `lunar_aligned`: disables panic triggers and carcass-eating behavior
- `creaturecorpse`: filter for valid carcass targets

**Tags added/removed:**
- None

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `carcass` | `Entity?` | `nil` | Stores the nearest valid carcass entity found via `SelectCarcass()`; valid only while `CheckCarcass()` returns true |
| `reanimatetime` | `number?` | `nil` | Timer/flag used for clay wargs to transition from statue state to active state. `nil` = wait for proximity, `true` = pending reanimation event |

## Main functions

### `SelectCarcass()`
* **Description:** Finds the nearest valid corpse within `SEE_DIST` (30 units) that matches the criteria: has `creaturecorpse` tag, lacks `NOCLICK` and `fire` tags, and is not burning.
* **Parameters:** None.
* **Returns:** `true` if a valid carcass is found and stored in `self.carcass`; `false` otherwise.
* **Error states:** Does not fail; returns `false` if no candidate is found.

### `CheckCarcass()`
* **Description:** Verifies that the currently stored `carcass` is still valid: exists, not burning, and tagged as `creaturecorpse`.
* **Parameters:** None.
* **Returns:** `true` if the carcass is valid; `false` otherwise.
* **Error states:** If `self.carcass` is `nil` or invalid, returns `false`.

### `GetCarcassPos()`
* **Description:** Returns the 3D position of the valid carcass if `CheckCarcass()` passes; otherwise returns `nil`.
* **Parameters:** None.
* **Returns:** `Vector3?` — position of the carcass or `nil`.
* **Error states:** Returns `nil` if carcass is invalid or not yet selected.

### `OnStart()`
* **Description:** Constructs and assigns the behavior tree root for the entity. This method must be called during brain initialization to set up AI logic.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None. Behavior tree construction is idempotent per call, but only needs to be done once per entity instantiation.

## Events & listeners

- **Listens to:** None explicitly; behavior tree nodes trigger reactions based on runtime state, but no event listeners are registered in this component itself.
- **Pushes:**
  - `reanimate`: triggered via `inst:PushEvent("reanimate", { target = player })` in `TryReanimate` when a clay warg's reanimation timer elapses and a nearby player exists.
  - `chomp`: pushed immediately via `inst:PushEventImmediate("chomp", { target = self.carcass })` when a valid carcass is available and cooldown allows.
  - `dohowl`: triggered via `sg:HandleEvent("dohowl")` (via state graph) before attempting to summon a follower.
  - `becomestatue`: pushed periodically (every 3 seconds) while the entity is clay and not in intro state, via the statue loop in the behavior tree.

> Note: Events like `reanimate`, `chomp`, and `becomestatue` are pushed on the instance (`self.inst`), which is the warg/warglet entity. The state graph (`self.inst.sg`) processes `dohowl` as a state transition request, not a raw event.

---