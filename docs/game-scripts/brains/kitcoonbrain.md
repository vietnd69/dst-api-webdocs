---
id: kitcoonbrain
title: Kitcoonbrain
description: Manages the AI behavior of a kitcoon, handling owner following, combat avoidance, playful interactions with other kitcoons and toys, and minigame observation.
tags: [ai, mob, companion, minigame]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 0a44d87e
system_scope: brain
---

# Kitcoonbrain

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`KitcoonBrain` is an AI brain component for the kitcoon prefab, implementing behavior trees to orchestrate movement, social, and reactive behaviors. It extends `Brain` and coordinates interactions with the `follower`, `entitytracker`, `combat`, `locomotor`, `sleeper`, `burnable`, and `minigame_participator` components. The kitcoon follows its owner under normal conditions, avoids ongoing combat, plays with toys or other kitcoons, and may watch minigames if the owner participates in one.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrain("kitcoonbrain")
-- Additional setup (tags, follower component, etc.) required for full functionality
```

## Dependencies & tags
**Components used:** `follower`, `entitytracker`, `combat`, `locomotor`, `sleeper`, `burnable`, `minigame_participator`, `grouptargeter`, `timer`, `minigame`  
**Tags:** Checks for and temporarily removes/ restores tags: `cattoy`, `cattoyairborne`, `catfood`, `busy`, `kitcoon`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `stump`, `burnt`, `notarget`, `flight`, `fire`, `irreplaceable`

## Properties
No public properties.

## Main functions
### `GetOwner(inst)`
* **Description:** Returns the kitcoon's owner via the `follower` component, or `nil`.
* **Parameters:** `inst` (entity instance) — the kitcoon entity.
* **Returns:** `inst` or `nil` — the owner entity, or `nil` if not set.

### `ShouldPanic(inst)`
* **Description:** Determines if the kitcoon should panic (e.g., due to owner being absent or its den burning).
* **Parameters:** `inst` (entity instance) — the kitcoon entity.
* **Returns:** `true` if the panic timer exists or the den is burning; otherwise `false`.

### `FindPlaymate(self)`
* **Description:** Attempts to locate or retain a nearby kitcoon to play with, based on cooldowns, proximity, and availability.
* **Parameters:** `self` (brain instance) — the kitcoon brain.
* **Returns:** `true` if a valid playmate is found or retained; otherwise `false`.

### `PlayAction(inst)`
* **Description:** Finds and initiates playing with a compatible toy or food item.
* **Parameters:** `inst` (entity instance) — the kitcoon entity.
* **Returns:** A `BufferedAction` on success, or `nil` if no valid target or in a `busy` state.

### `WatchingMinigame(inst)`
* **Description:** Returns the `minigame` component of the owner if the owner is a participator.
* **Parameters:** `inst` (entity instance) — the kitcoon entity.
* **Returns:** The `minigame` component or `nil`.

### `OnStart()`
* **Description:** Constructs and assigns the behavior tree on brain initialization. Defines priority-based logic including: standing when being named, panicking, following/avoiding owner, watching minigames, playing, and wandering.
* **Parameters:** None.
* **Returns:** None.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls are present).
- **Pushes:** `critter_avoidcombat`, `start_playwithplaymate`, `on_played_with`
