---
id: brightmare_gestaltbrain
title: Brightmare Gestaltbrain
description: Controls combat and movement behavior for the Brightmare Gestalt boss based on its current behavior level and surrounding threats.
tags: [ai, boss, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 216461e7
system_scope: brain
---

# Brightmare Gestaltbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GestaltBrain` is the behavior tree brain for the Brightmare Gestalt boss entity. It implements layered combat logic based on `behaviour_level`, dynamically switching between fleeing from shadows, avoiding players, facing/charging at players, and retreating when in combat cooldown. The brain uses behavior tree nodes (`PriorityNode`, `WhileNode`, `SequenceNode`, `ActionNode`, `IfNode`) to evaluate threats and select appropriate actions via a priority-ordered hierarchy. It depends on the `combat` component to manage targeting and the `locomotor` component to halt movement when necessary.

## Usage example
This brain is automatically assigned to the Brightmare Gestalt prefab and does not need manual instantiation. Typical integration is handled in the prefab definition:
```lua
inst:AddBrain("brightmare_gestaltbrain")
```
The brain dynamically responds to changes in `inst.behaviour_level` and external events such as `droppedtarget`.

## Dependencies & tags
**Components used:** `combat`, `locomotor`  
**Tags:** Uses `oneoftags` group `"SHADOW_TAGS"` (includes `nightmarecreature`, `shadowcreature`, `shadow`, `shadowminion`, `stalker`, `stalkerminion`, `nightmare`, `shadow_fire`) for avoidance logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._ignorerelocating` | boolean | `nil` | If set to `true`, disables relocation logic. |
| `inst.tracking_target` | entity or `nil` | `nil` | Tracks current target; relocation is skipped if a player is nearby. |
| `inst.behaviour_level` | number | `1` | Controls behavior behavior layer (1 = fleeing players, 2 = cautious aggression, 3 = aggressive chase). |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree. Creates a root `PriorityNode` that evaluates state tags and behavior level to select actions such as relocate, flee shadows/players, stand and attack, chase and attack, or wander.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Relies on external components (`combat`, `locomotor`) being attached to `self.inst`; behavior fails if components are missing.

## Events & listeners
- **Listens to:** No events registered directly; behavior reacts to `combat` component state (e.g., `combat.target`) and internal stategraph state tags (e.g., `busy`, `jumping`).
- **Pushes:** None directly; delegates to stategraph transitions (e.g., `relocate` state via `inst.sg:GoToState("relocate")`).
