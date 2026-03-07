---
id: cookiecutterbrain
title: Cookiecutterbrain
description: Manages the AI behavior tree for the Cookiecutter entity, handling fleeing, wandering, boat boarding, and home return logic.
tags: [ai, brain, locomotion, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e575b068
system_scope: brain
---

# Cookiecutterbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CookiecutterBrain` is a behavior tree implementation that governs the decision-making logic for the Cookiecutter entity. It coordinates responses to threats (via `RunAway`), movement toward safe zones (`Wander` and `Leash`), resource consumption (`EatFoodAction`), and special actions like boarding boats or returning to a remembered home location. The brain relies on the `knownlocations` component to persist and retrieve the home position, and the `burnable` component to verify that wood is safe to eat.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cookiecutterbrain")
-- After initialization, the brain automatically starts managing behavior
inst.components.knownlocations:RememberLocation("home", Point(inst.Transform:GetWorldPosition()), true)
```

## Dependencies & tags
**Components used:** `knownlocations`, `burnable`
**Tags:** Checks `scarytocookiecutters`, `scarytoprey`, `edible_WOOD`, `INLIMBO`, `boat`

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes and installs the behavior tree root node, configuring behavior priority and state-based conditions (e.g., fleeing while drilling, boarding boats when near, wandering toward home).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

### `OnInitializationComplete()`
* **Description:** Records the Cookiecutter's current position as the `home` location using the `knownlocations` component. Ensures the position is only set once (`dont_overwrite = true`).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `gohome` — fired when the entity is too far from home and attempts to board a nearby boat to return.
