---
id: antlionbrain
title: Antlionbrain
description: Controls the decision-making logic for the antlion boss using a behavior tree to manage combat, rock-eating recovery, and post-combat calm periods.
tags: [ai, combat, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 5d485f9a
system_scope: brain
---

# Antlionbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AntlionBrain` implements the AI for the antlion boss entity using a behavior tree (`BT`). It coordinates high-priority rock-eating during health recovery, standard combat via `StandAndAttack`, and a post-fight calm phase where attack speed is reduced before resuming normal aggression. It relies on the `health`, `combat`, and `worldsettingstimer` components to make state-aware decisions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("antlionbrain")
-- The brain is automatically initialized when added
-- It will evaluate behaviors and trigger events like "eatrocks" and "antlionstopfighting"
```

## Dependencies & tags
**Components used:** `health`, `combat`, `worldsettingstimer`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with a priority-based root node that sequences rock-eating (high-priority if recently attacked during a wall cooldown), standard combat, low-priority rock-eating, and a post-combat calm sequence. This function is automatically called when the brain is attached to an entity and starts running.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (the brain itself does not register listeners directly; it triggers events via `inst:PushEvent`).
- **Pushes:** 
  - `"eatrocks"` — when the antlion begins eating rocks to heal (high or low priority).
  - `"antlionstopfighting"` — to signal the end of the calm period and transition back to active combat behavior.
