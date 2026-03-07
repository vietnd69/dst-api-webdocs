---
id: minotaurbrain
title: Minotaurbrain
description: Controls the behavior tree logic for the Minotaur boss, coordinating combat, movement, and special attacks (jump and ram) in response to environment and state conditions.
tags: [ai, combat, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 8e769774
system_scope: brain
---

# Minotaurbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Minotaurbrain` is the brain component for the Minotaur boss entity. It defines a priority-based behavior tree (`BT`) that orchestrates combat flow—including chasing, attacking, jumping, ramming, and retreating to a known "home" location—based on health, cooldowns, target proximity, and environmental obstacles (e.g., quake pillars). It depends heavily on the `combat`, `health`, `knownlocations`, and `timer` components, and integrates behaviors like `ChaseAndRam` and `StandStill` via the DST behavior library.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("minotaur")
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("knownlocations")
inst:AddComponent("timer")
inst:AddComponent("brain")
inst.components.brain:SetBrain("minotaurbrain")
inst.components.brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `health`, `knownlocations`, `timer`, `brain`
**Tags:** Checks `notarget` (on targets), `leapattack` (state tag), `busy`, `running` (state tags), `stunned` (timer-based); adds no new tags itself.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the Minotaur's behavior tree by constructing a `PriorityNode` hierarchy that determines action precedence. The tree prioritizes jump attacks, then ram attacks, then standard combat, rest during cooldowns, panic, returning home, facing the target, and finally idling.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Requires the `brain` component to be attached and `inst.components.brain` to be valid. Assumes `self.inst` and its components are fully initialized.

### `GoHomeAction(inst)` *(local function)*
* **Description:** Returns a `BufferedAction` to walk to the Minotaur's "home" location if no target exists and the home position is known. Otherwise returns `nil`.
* **Parameters:** `inst` (EntityInstance) — the Minotaur instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if `combat.target` is present or `knownlocations:GetLocation("home")` returns `nil`.

### `GetFaceTargetFn(inst)` *(local function)*
* **Description:** Determines if the Minotaur should face a nearby player as part of its "keep face" behavior. Only selects a target within `START_FACE_DIST` (14) who is valid and not tagged `notarget`.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Player `EntityInstance` or `nil`.
* **Error states:** Returns `nil` if no suitable target is within range, `home` is far, or target has `notarget`.

### `KeepFaceTargetFn(inst, target)` *(local function)*
* **Description:** Decides whether the Minotaur should continue facing a given target. Continues only if the Minotaur is near its home and the target lacks the `notarget` tag.
* **Parameters:** `inst` (EntityInstance), `target` (EntityInstance).
* **Returns:** Boolean (`true` or `false`).
* **Error states:** Always returns `false` if `home` position is missing or Minotaur is too far from home.

### `ShouldGoHome(inst)` *(local function)*
* **Description:** Determines if the Minotaur should move back to its home. Triggers if the Minotaur is beyond `GO_HOME_DIST` (40) or is beyond `CHASE_GIVEUP_DIST` (10) and has no active target.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Boolean (`true` or `false`).
* **Error states:** Returns `false` if `home` location is unknown.

### `closetopillar(inst)` *(local function)*
* **Description:** Checks whether the Minotaur is standing adjacent to (within radius 4) a quake-enabled pillar (entity with tag `quake_on_charge`).
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Boolean (`true` if pillar nearby, else `false`).
* **Error states:** None; returns `false` if no pillars found.

### `shouldramattack(inst)` *(local function)*
* **Description:** Evaluates whether the Minotaur should perform a ram attack. Returns `true` only if a target exists, is not in a cooldown-induced "rammed" state, not currently leaping, and not adjacent to a quake pillar. Handles post-ram cooldown reset and forces one last attack if the target is in range.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Boolean or `nil`.
* **Error states:** May return `nil` early to abort ram attack if `combat.target` is missing or conditions (e.g., cooldowns, obstacles) are not met.

### `shouldjumpattack(inst)` *(local function)*
* **Description:** Evaluates whether a jump attack is viable. Requires low health (`<= 60%`), no `busy`/`running` state tags, no `stunned` timer, target within `MAX_JUMP_ATTACK_RANGE` (15), and no pillar blocking the straight-line path to the target.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Boolean (`true` if jump attack is valid, else `false`).
* **Error states:** Returns `false` if target is invalid, out of range, or blocked; also returns `false` if jump attack is on cooldown and target is within attack range.

### `dojumpAttack(inst)` *(local function)*
* **Description:** Triggers the jump attack by making the Minotaur face the target and pushing the immediate event `"doleapattack"`.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Nothing.
* **Error states:** Does nothing if target is `nil` or state already has `leapattack` tag.

## Events & listeners
- **Pushes:** `"doleapattack"` — immediate event sent via `inst:PushEventImmediate("doleapattack")` to initiate a leap attack state transition.
- **Listens to:** None explicitly defined in this file (assumed to be handled by parent `Brain` or stategraph).
