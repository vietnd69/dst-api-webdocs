---
id: gnarwailbrain
title: Gnarwailbrain
description: AI brain controller for the Gnarwail creature that manages navigation, combat, trading, tossing, and feeding behaviors in a water-centric world.
tags: [ai, combat, boat, trader, feeding]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: d0bbe0fe
system_scope: brain
---

# Gnarwailbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GnarwailBrain` is the behavior tree controller for the Gnarwail entity in DST. It defines how the creature navigates oceans, fights while on or near water, avoids boats when fleeing, interacts with traders, searches for and consumes floating food, and tosses items to its leader. It is attached to the Gnarwail prefab and integrates tightly with the `combat`, `follower`, `eater`, `trader`, `boatphysics`, and `inventoryitem` components. The brain prioritizes state-dependent behaviors such as attacking water-bound targets, following a leader on a moving platform, and responding to trade requests.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("gnarwail")
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("gnarwailbrain")
-- Once the brain is active, it automatically drives stategraph transitions
-- and behavior execution via the behavior tree in OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `eater`, `trader`, `boatphysics`, `inventoryitem`  
**Tags:** `gnarwail`, `walkableplatform`, `INLIMBO`, `outofreach`, `FX`, `fishmeat`, `oceanfish`, `_inventoryitem`

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the Gnarwail. The tree implements conditional priority-based behavior selection: panic when horn is broken, attack water targets, leash-follow the leader on a boat, trade, and perform misc. actions like finding food or tossing items when idle. It includes dynamic pathfinding logic that respects ocean tiles and moving boats.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Behavior tree construction may fail if required behaviors (e.g., `ChaseAndAttack`, `Follow`) are not defined or depend on missing stategraph states.

## Events & listeners
None identified. The brain relies on the stategraph (`inst.sg`) for internal transitions but does not directly register or fire events.
