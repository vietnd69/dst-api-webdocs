---
id: fruitflybrain
title: Fruitflybrain
description: Defines the AI behavior tree for fruit flies, governing their movement, targeting, planting, and spawning logic.
tags: [ai, combat, locomotion, planting, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 2bb60fda
system_scope: brain
---

# Fruitflybrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fruitflybrain` implements the AI behavior tree for fruit fly entities in DST. It determines how the entity moves, identifies and targets plants, sows weeds on suitable soil, and — for lord fruit flies — summons minions and evades while attacking. It relies heavily on the `combat`, `follower`, `leader`, and `knownlocations` components to coordinate actions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("follower")
inst:AddComponent("knownlocations")
inst:AddTag("fruitfly") -- or "lordfruitfly"
inst.components.fruitflybrain = FruitflyBrain(inst)
inst:PushEvent("brainstart")
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `leader`, `knownlocations`
**Tags:** Checks for `fruitfly` or `lordfruitfly` to branch behavior; no tags added/removed by this brain itself.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and starts the behavior tree. Constructs different branches based on whether the entity has the `lordfruitfly` tag, ordering high-priority logic (panic, home return, farming, wandering).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Assumes required components (`combat`, `follower`, `leader`, `knownlocations`) are present; failure to meet this will cause runtime errors.

## Events & listeners
- **Listens to:** None. This is a behavior tree brain and does not register event listeners directly.
- **Pushes:** None directly. Behavior tree actions may trigger events via `ActionNode` (e.g., `self.inst.sg:GoToState("buzz")`), but these are state graph transitions, not component-level events.
