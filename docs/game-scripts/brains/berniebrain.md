---
id: berniebrain
title: Berniebrain
description: Manages the AI behavior of Bernie the Big Bernie, including detecting when to transform, finding a leader to follow, taunting nearby sanity monsters, and switching between wandering and following states.
tags: [ai, brain, sanity, combat, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 76e54e5f
system_scope: brain
---

# Berniebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BernieBrain` is a behavior tree-based AI controller for the "Big Bernie" entity. It handles dynamic transitions between states such as transforming into Big Bernie mode when near a qualifying player, taunting nearby sanity-based enemies to shift their aggro, following a designated leader, and default wandering behavior. It interacts with the `combat`, `sanity`, and `timer` components to make context-aware decisions.

## Usage example
This component is added automatically to the prefab during initialization. Modders typically do not instantiate it directly but can inspect or extend it. A typical usage in a prefab file might be:

```lua
inst:AddBrain("berniebrain")
inst.components.sanity.dotters = true -- Enables sanity monster attraction logic
```

Note: The actual usage is internal to the game engine and handled by `inst:AddBrain("berniebrain")`.

## Dependencies & tags
**Components used:** `combat`, `sanity`, `timer`
**Tags:** Checks tags like `shadowcreature`, `_combat`, `locomotor`, `INLIMBO`, `notaunt`, `bernieowner`; does not add or remove tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_targets` | table (of Entities) or `nil` | `nil` | List of tauntable shadow creatures currently in range. |
| `_leader` | Entity or `nil` | `nil` | The player entity currently recognized as the leader for following/transforming. |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for Bernie. Constructs a priority-based root node that evaluates conditions in order: Go Big (transform), taunt, check for leader presence, follow leader, or wander.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified; requires the instance to have `inst.sg`, `inst.components.timer`, and support the `GoBig(leader)` function.

## Events & listeners
* **Listens to:** None identified.
* **Pushes:** None identified.
