---
id: mushgnomebrain
title: MushgnomeBrain
description: AI behaviour tree for the Mush Gnome entity, prioritising spore spray attacks, panic responses, threat avoidance, and wandering.
tags: [brain, ai, behaviour-tree, mob]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: brains
source_hash: 0032888d
system_scope: brain
---

# MushgnomeBrain

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`MushgnomeBrain` is the AI behaviour tree for the Mush Gnome prefab. It selects between spraying spores at combat targets, panicking from general threats or electric fences, fleeing from entities that are targeting it or being targeted by it, and idle wandering. Brains are paused when the entity is far from any player and resume automatically on player proximity. Brain trees are attached via the prefab brain field or engine framework.

## Usage example
```lua
-- Brains are attached during prefab construction via the engine framework.
-- The brain module is required and passed to the brain attachment system.
local brain = require("brains/mushgnomebrain")
-- Brain attachment is handled by the prefab's brain field or engine framework

-- The framework calls OnStart() to obtain the behaviour tree.
-- Manual access to the running tree:
if inst.brain ~= nil and inst.brain.bt ~= nil then
    -- inspect or reset the running behaviour tree
end
```

## Dependencies & tags
**External dependencies:**
- `behaviours/standandattack` -- StandAndAttack behaviour node for spore spray attacks
- `behaviours/standstill` -- StandStill behaviour node (imported, used internally by StandAndAttack)
- `behaviours/wander` -- Wander behaviour node for idle movement
- `brains/braincommon` -- PanicTrigger and ElectricFencePanicTrigger utility functions

**Components used:**
- `combat` -- queried for HasTarget(), InCooldown(), and TargetIs() to determine attack and threat state

**Tags:**
- `_combat` -- required tag on threat candidates for RunAway behaviour
- `DECOR`, `FX`, `INLIMBO` -- excluded tags on threat candidates for RunAway behaviour

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `THREAT_PARAMS` | table (local constant) | --- | Configuration for RunAway threat detection. Defines `fn` callback, required `tags`, and excluded `notags`. |
| `THREAT_PARAMS.fn` | function | --- | Returns true if candidate is targeting inst or inst is targeting candidate. |
| `THREAT_PARAMS.tags` | table | `{ "_combat" }` | Required tags on threat candidates. |
| `THREAT_PARAMS.notags` | table | `{ "DECOR", "FX", "INLIMBO" }` | Excluded tags on threat candidates. |

## Main functions
### `OnStart()` (Brain method)
* **Description:** Constructs the root PriorityNode of the behaviour tree. Prioritises spore spray attacks while target is valid and not on cooldown, then panic triggers, then threat avoidance, then wandering. Called once when the brain is attached and on resume after pause.
* **Parameters:** None
* **Returns:** None (assigns `self.bt` with the BehaviourTree)
* **Error states:** Errors if `self.inst.components.combat` is missing (nil dereference on combat method calls — no guard present).



## Events & listeners
None — brain trees react to component state through behaviour nodes, not engine events directly. Event handling is done in the brain's host stategraph or via component subscriptions.