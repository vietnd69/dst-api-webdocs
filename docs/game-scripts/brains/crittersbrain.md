---
id: critterbrain
title: CritterBrain
description: Defines AI behavior tree for critter entities including owner following, combat avoidance, playful interactions, and minigame watching.
tags: [ai, critter, behavior, brain]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: brains
source_hash: 68bfb6ec
system_scope: brain
---

# CritterBrain

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`CritterBrain` is an AI behavior tree that governs critter entity behavior in Don't Starve Together. It manages owner following, combat avoidance, playful interactions with other critters, affection displays, and minigame spectator behavior. This brain is typically assigned to pet-like critter entities that follow players and exhibit social behaviors.

## Usage example
```lua
local inst = CreateEntity()
-- After setting up critter components...
inst.components.brain:SetBrain(require("brains/crittersbrain"))
```

## Dependencies & tags
**Components used:** `follower`, `crittertraits` (on critter); `sleeper`, `locomotor`, `combat`, `grouptargeter` (on owner or target entities); `minigame_participator` (on owner); `minigame` (on minigame entity returned by minigame_participator)

**Tags:** Checks `busy`, `playerghost`, `flying`, `_combat`, `_health`, `wall`, `INLIMBO`

## Properties
No public properties. This is a Brain class that defines behavior tree logic rather than storing entity state. Configuration is handled through local constants at the top of the file.

## Main functions
### `CritterBrain(inst)`
*   **Description:** Constructor that initializes the brain for a specific entity instance. Handled internally by the Brain component; users should assign the brain via `components.brain:SetBrain`.
*   **Parameters:** `inst` (Entity) - The entity instance this brain will control.
*   **Returns:** New CritterBrain instance.

### `CritterBrain:OnStart()`
*   **Description:** Builds and assigns the behavior tree when the brain starts. Sets up priority nodes for minigame watching, combat avoidance, playful behavior, owner following, and affection actions. **This method is automatically invoked by the Brain component when the brain is assigned and should not be called manually.**
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Requires the entity to have a valid stategraph and necessary components attached.

## Events & listeners
- **Pushes:** `start_playwithplaymate` - Fired when the critter begins playing with another critter. Data includes `{target = playfultarget}`.
- **Pushes:** `critter_avoidcombat` - Fired when combat avoidance state changes. Data includes `{avoid = true/false}`.