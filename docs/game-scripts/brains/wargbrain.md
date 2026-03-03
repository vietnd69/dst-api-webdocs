---
id: wargbrain
title: Wargbrain
description: Controls AI behavior for warg hounds, including carcass consumption, hound summoning, and statue mechanics.
tags: [ai, combat, hound, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 2e15596d
system_scope: brain
---

# Wargbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WargBrain` implements the behavior tree logic for warg entities in Don't Starve Together. It orchestrates high-priority behaviors such as reanimating when near players (clay wargs), summoning hound minions, consuming carcasses, and engaging in combat. It integrates with the `combat` and `burnable` components and uses standard DST behavior modules (`chaseandattack`, `leash`, `wander`, `standstill`). The brain is shared between wargs and warglets, which rely on the `SGhound` state graph.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("wargbrain")
-- Additional setup (tags, components, state graph) handled by prefab definition
```

## Dependencies & tags
**Components used:** `combat`, `burnable`  
**Tags:** Checks `clay`, `lunar_aligned`, `creaturecorpse`, `NOCLICK`, `fire`. Adds none directly.

## Properties
No public properties are initialized in the constructor. Internal state is maintained in `self.reanimatetime` and `self.carcass` (set via method calls).

## Main functions
### `SelectCarcass()`
* **Description:** Locates the nearest valid corpse within `SEE_DIST` (30 units) using `FindEntity`, storing it in `self.carcass`.
* **Parameters:** None.
* **Returns:** `true` if a matching corpse is found; `false` otherwise.
* **Error states:** May return `true` even if the corpse becomes invalid before use (checked later by `CheckCarcass`).

### `CheckCarcass()`
* **Description:** Verifies the currently stored `self.carcass` is still valid and safe to consume (not burning).
* **Parameters:** None.
* **Returns:** `true` if `self.carcass` is valid, has the `creaturecorpse` tag, and is *not* burning; `false` otherwise.
* **Error states:** Returns `false` if `self.carcass` is `nil` or its `burnable` component reports `IsBurning()`.

### `GetCarcassPos()`
* **Description:** Returns the 3D position of the target carcass, if it passes `CheckCarcass`.
* **Parameters:** None.
* **Returns:** `Vector3` (via `self.carcass:GetPosition()`) if carcass is valid; `nil` otherwise.

### `OnStart()`
* **Description:** Initializes the behavior tree for the warg. Defines the root priority node tree with conditional and hierarchical logic, including state-specific behavior for intro, statue (clay), normal panic, hound summoning, carcass eating, combat, and wandering.
* **Parameters:** None.
* **Returns:** Nothing. Assigns the behavior tree to `self.bt`.

## Events & listeners
- **Listens to:** None directly (event handling is driven by the state graph `self.inst.sg` via `HasStateTag`, `HandleEvent`, and `mem.dohowl`).
- **Pushes:** 
  - `"reanimate"` with `{ target = player }` when reanimation trigger is satisfied (clay wargs).
  - `"chomp"` with `{ target = self.carcass }` during carcass consumption (via `PushEventImmediate`).
  - `"becomestatue"` periodically when in clay state (via `PushEvent`).
- **Pushes via `BrainCommon`:** `"panic"` or `"electricpanic"` depending on configuration (not direct calls, but triggered via `PanicTrigger` and `ElectricFencePanicTrigger`).
