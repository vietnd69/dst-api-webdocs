---
id: fused_shadelingbrain
title: Fused Shadelingbrain
description: Defines the behavior tree for the Fused Shadeling mob, orchestrating combat jumping, chasing, leashing, and wandering via a prioritized node hierarchy.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 7b50ab65
---

# Fused Shadelingbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `Fused_ShadelingBrain` component implements the decision-making logic for the Fused Shadeling entity using a Behavior Tree (BT). It establishes a priority-based hierarchy of behaviors: blocking action while jumping, performing a targeted combat jump when conditions are met, chasing and attacking the current target, enforcing a leash to prevent wandering too far from its spawnpoint, and defaulting to wandering when no target is in range. The component integrates with several core systems—combat (targeting and cooldowns), known locations (spawnpoint tracking), and timers (jump cooldowns)—and is used exclusively on NPC entities with AI capabilities.

## Dependencies & Tags
- **Components used:** 
  - `combat` (`InCooldown()`, `target` property)
  - `knownlocations` (`GetLocation("spawnpoint")`)
  - `timer` (`TimerExists("jump_cooldown")`)
- **Tags checked:** `self.inst.sg:HasStateTag("jumping")`
- **Tags added/removed:** None identified.

## Properties
No public instance properties are initialized in the constructor or elsewhere; all state is managed implicitly via the Behavior Tree and component references.

## Main Functions
### `OnStart()`
* **Description:** Initializes the Behavior Tree for the Fused Shadeling by constructing a prioritized node structure. This function is called automatically when the state graph transitions to the AI-active state. It configures the root node to evaluate high-priority behaviors first, such as blocking during jumps and evaluating combat jumps, followed by chase/attack, leash enforcement, and finally wandering.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
* **Pushes:** 
  - `"try_jump"` — fired with the target's position (from `target:GetPosition()`) when a combat jump is initiated. This event signals intent to perform a jump attack, typically consumed by state graph transitions or animation logic.

* **Listens to:** None. The component does not register any event listeners directly. It reacts to state graph tags (`"jumping"`) via runtime checks within its behavior tree nodes.

---