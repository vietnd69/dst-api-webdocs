---
id: wobsterbrain
title: Wobsterbrain
description: AI controller for the Wobster entity that manages its behavior while fishing, including struggling when hooked, returning home during the day, and interacting with fishing lures.
tags: [ai, fishing, ocean, behavior, entity]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: entity
source_hash: 776c92cb
---

# Wobsterbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

Wobsterbrain is the AI behavior tree controller for the Wobster entity. It orchestrates high-level decision-making for the creature while it is engaged in ocean fishing activities. The brain handles transitions between normal wandering, returning to its home base during daylight hours, interacting with fishing hooks (e.g., struggling or waiting), and nibbling at fishing lures. It depends heavily on the `homeseeker`, `knownlocations`, `oceanfishable`, and `oceanfishinghook` components to determine state and perform actions.

The behavior tree evaluates conditions in priority order: first guarding against jumping behavior, then handling hook interactions, followed by home migration, lure interaction, and finally idle wandering.

## Usage example

This component is automatically added to the Wobster prefab instance during its creation in the game. Modders do not typically instantiate it manually. To override or extend its behavior, one would subclass `WobsterBrain` or modify the behavior tree in `OnStart()`.

```lua
-- Example of how the brain is typically registered on an entity (internal usage only)
inst:AddBrain("brains/wobsterbrain")
```

## Dependencies & tags

**Components used:**
- `homeseeker`: Used to check for valid home existence (`HasHome()`) and locate home position (`self.home`)
- `knownlocations`: Used to retrieve the stored "home" location via `GetLocation("home")`
- `oceanfishable`: Used to retrieve the fishing rod (`GetRod()`), check struggle state (`IsStruggling()`, `UpdateStruggleState()`)
- `oceanfishinghook`: Used to manage and evaluate lure interest (`TestInterest`, `UpdateInterestForFishable`, `SetLostInterest`, `HasLostInterest`)

**Tags checked:**
- `"partiallyhooked"`: determines if the Wobster is currently in the pre-struggle state
- `"jumping"`: checked via stategraph tag (not via `inst:HasTag`) to prevent behavior during aerial phases

**Tags added/removed:** None identified.

## Properties

No direct instance properties are initialized in the constructor. The brain uses local closure variables for behavior configuration and maintains transient state via `inst._lure_target` and `inst._num_lure_nibbles` (set and modified within `find_lure_target` and `nibble_lure` functions).

## Main functions

### `WobsterBrain:OnStart()`
* **Description:** Initializes and assigns the root behavior tree for the Wobster. This function constructs a priority-based behavior tree that dictates the Wobster's actions based on real-time conditions (e.g., whether it is hooked, struggling, near a lure, or it is daytime).
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None. Assumes all required components are attached to `self.inst`. Behavior tree execution may fail silently if component dependencies are missing.

## Events & listeners

This brain does not register any event listeners or push events. It relies entirely on polling conditions and behavior tree node evaluation to trigger state transitions and actions.