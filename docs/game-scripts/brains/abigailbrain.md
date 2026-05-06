---
id: abigailbrain
title: Abigailbrain
description: Defines the behavior tree AI for Abigail, Wendy's ghost sister companion.
tags: [ai, brain, companion, ghost, abigail]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: brains
source_hash: 0248138c
system_scope: brain
---

# Abigailbrain

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`AbigailBrain` defines the artificial intelligence behavior tree for Abigail, Wendy's spectral companion. It manages Abigail's decision-making across multiple modes including defensive combat, aggressive combat, dancing with her leader, haunting targets, and playful interactions with other ghosts. The brain evaluates priority nodes to determine appropriate actions based on Abigail's current state, leader proximity, and environmental conditions. Defensive/aggressive mode is controlled via `inst.is_defensive` on the entity (true for defensive, nil/false for aggressive).

## Usage example
```lua
local AbigailBrain = require("brains.abigailbrain")
local inst = SpawnPrefab("abigail")

-- Attach the brain to Abigail's entity
RunBrain(inst, AbigailBrain:new(inst))

-- The brain automatically manages behavior based on state
-- Defensive mode: inst.is_defensive = true
-- Aggressive mode: inst.is_defensive = nil or false
```

## Dependencies & tags
**External dependencies:**
- `behaviours/doaction` -- provides DoAction behavior node for haunt actions
- `behaviours/follow` -- provides Follow behavior node for leader following
- `behaviours/wander` -- provides Wander behavior node for idle movement

**Components used:**
- `follower` -- retrieves leader via GetLeader() for positioning and state checks
- `timer` -- tracks "played_recently" timer for ghost playmate cooldowns
- `trader` -- checks IsTryingToTradeWithMe() for trade interactions with leader
- `minigame_participator` -- checks GetMinigame() for minigame watching behavior
- `combat` -- accesses target, InCooldown(), and GiveUp() for combat decisions

**Tags:**
- `busy` -- excluded when finding playmates (PLAYMATE_NO_TAGS)
- `ghostkid` -- searched when finding playmates (PLAYMATE_ONEOF_TAGS)
- `graveghost` -- searched when finding playmates (PLAYMATE_ONEOF_TAGS)
- `dancing` -- checked on leader's stategraph to trigger dance party
- `gestalt` -- triggers avoidance behavior when in cooldown during combat
- `swoop` -- guards against behavior execution during swoop state

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | BehaviorTree | `nil` | The behavior tree instance created in OnStart(). |
| `playfultarget` | Entity | `nil` | Current ghost playmate target for playful interactions. |

## Main functions
### `OnStart()`
* **Description:** Initializes and constructs the complete behavior tree for Abigail. Sets up priority nodes for dancing, minigame watching, transparent state, haunting, defensive mode, and aggressive mode. This is called automatically when the brain is attached to an entity via RunBrain().
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst` is nil when accessing components or calling behavior node constructors — no nil guard present in the function body.

### `new(inst)`
* **Description:** Constructor inherited from Brain class. Creates a new AbigailBrain instance for the given entity. Calls Brain._ctor to initialize base brain functionality.
* **Parameters:** `inst` -- the entity instance that will own this brain
* **Returns:** AbigailBrain instance
* **Error states:** None

## Events & listeners
- **Pushes:** `dance` -- fired when Abigail joins a dance party with her leader.
- **Pushes:** `start_playwithghost` -- fired when Abigail begins playing with a ghost playmate, includes `target` data field.