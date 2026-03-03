---
id: alterguardian_phase4_lunarriftbrain
title: Alterguardian Phase4 Lunarriftbrain
description: Controls the combat and movement behavior of the Alterguardian during its Phase 4 Lunar Rift transition, prioritizing ranged attacks while chasing andwandering within the arena.
tags: [ai, combat, boss, locomotion, brain]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: faf55a8b
system_scope: brain
---

# Alterguardian Phase4 Lunarriftbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AlterGuardian_Phase4_LunarRiftBrain` is a behavior tree (`Brain`) component that governs the Alterguardian boss during its Phase 4 Lunar Rift phase. It implements a concurrent behavior strategy: the entity simultaneously attempts ranged attacks when a target is available and cooldown-free, chases and engages in melee combat when possible, and wanders within the WagPunk arena to maintain positional variety. This brain is specifically designed for the Lunar Rift arena environment and assumes the boss is not jumping or dead.

## Usage example
```lua
-- Typically assigned during prefab construction of the Alterguardian Phase 4 entity
inst:AddBrain("alterguardian_phase4_lunarriftbrain")
-- The brain starts automatically when the entity's StateGraph transitions to a state that calls BrainStart()
```

## Dependencies & tags
**Components used:** `combat`
**Tags:** None directly added or removed by this brain.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree root node for the Alterguardian. This function sets up a priority-based behavior tree that runs continuously while the entity is not in a jumping or dead state.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Requires `self.inst.components.combat` to exist and be functional.

## Events & listeners
None identified.
