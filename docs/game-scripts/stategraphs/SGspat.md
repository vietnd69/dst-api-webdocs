---
id: SGspat
title: Sgspat
description: Controls the behavior state machine for the Spat entity, handling idle animations, combat attacks, sound-based actions like bellowing, and transitions between movement, grazing, and attack states.
tags: [ai, combat, animation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 728e2c82
system_scope: entity
---

# Sgspat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGspat` defines the state graph for the Spat entity, governing its behavioral transitions and animations based on internal timers, external events, and component interactions. It integrates with the `health`, `combat`, and `locomotor` components to manage attack readiness, responsiveness to damage/hearing, and movement states. The state graph supports idle behavior loops (grazing, bellowing, shaking), directed attacks (normal and projectile via snot bombs), death sequences, and integration with shared states (walk, run, hit, sleep, freeze, electrocute) via `CommonStates` helpers.

## Usage example
This state graph is typically registered internally when the Spat prefab initializes its state graph component — modders do not directly instantiate or call this state graph. However, interaction points include triggering events like `"doattack"` or `"heardhorn"` on the Spat entity:

```lua
-- Example: Force a Spat entity to bellow upon hearing a horn
if not spat_inst.components.health:IsDead() and not spat_inst.sg:HasAnyStateTag("attack", "electrocute") then
    spat_inst:PushEvent("heardhorn", { musician = some_actor })
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`
**Tags added by states:** `"idle"`, `"canrotate"`, `"busy"`, `"invisible"`, `"noattack"`, `"temp_invincible"`, `"noelectrocute"`, `"attack"`, `"busy"` (also `"attack"`), `"attack"` (for launchprojectile), `"busy"` (for death). No persistent tags added/removed by the state graph itself — tags are used purely for runtime state tracking.

## Properties
No public properties are defined or exposed by this state graph module — it returns a `StateGraph` instance and does not expose runtime state as mod-accessible properties.

## Main functions
Not applicable — `SGspat` is a module that defines and returns a state graph; it does not provide callable public functions for external use.

## Events & listeners
- **Listens to:**
  - `onstep`, `onlocomote`, `onsleep`, `onfreeze`, `onelectrocute`, `onattacked`, `ondeath` — from `CommonHandlers`.
  - `doattack` — triggers attack or projectile launch depending on equipped weapon.
  - `heardhorn` — initiates bellowing if conditions are met.
  - `loseloyalty` — triggers a shaking animation if alive and not in attack/electrocute states.
  - `corpseschomped` — from `CommonHandlers`.
  - `animover` / `animqueueover` — transitions out of animation-based states.
  - `corpsedeathanimover` — handled via `CommonHandlers.OnCorpseDeathAnimOver`.
- **Pushes:** None — this state graph does not fire custom events.

