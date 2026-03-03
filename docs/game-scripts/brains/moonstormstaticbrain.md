---
id: moonstormstaticbrain
title: Moonstormstaticbrain
description: Assigns a wandering behavior to an entity that restricts movement to land tiles within active moonstorm zones.
tags: [ai, movement, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 171c3a7f
system_scope: entity
---

# Moonstormstaticbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moonstormstaticbrain` implements a behavior tree for an entity that instructs it to wander within a limited radius, constrained to land tiles and only while the moonstorm is active at the entity's location. It uses the `Wander` behavior and integrates with the `moonstorms` component to conditionally permit movement based on the current moonstorm state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("moonstormstaticbrain")
-- The brain automatically initializes its behavior tree on entity spawn
```

## Dependencies & tags
**Components used:** `moonstorms` (via `TheWorld.net.components.moonstorms`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the entity’s behavior tree (`self.bt`) with a single `Wander` action. The wander is restricted to land tiles and only occurs when `moonstorms:IsXZInMoonstorm(x, z)` returns `true`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.
