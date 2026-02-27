---
id: moonstormstaticbrain
title: Moonstormstaticbrain
description: Controls a static entity's behavior by limiting wandering to land tiles within active moonstorm zones.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 171c3a7f
---

# Moonstormstaticbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component defines a static entity's AI behavior by restricting its movement to land tiles that are currently inside an active moonstorm. It uses a single `Wander` behavior with a custom point-checking function (`CheckPointFn`) that validates terrain type (land only) and moonstorm zone presence. The brain initializes a behavior tree with this wandering action as its root priority node.

It is designed for entities that should remain stationary relative to the world but only become active or move when located within a moonstorm (e.g., static structures or creatures that react to moonstorms).

## Dependencies & Tags
- **Components used:** 
  - `TheWorld.net.components.moonstorms` (accessed via `TheWorld.net` during point validation)
- **Tags:** None identified.

## Properties
No explicit instance properties are declared or initialized in the constructor.

## Main Functions
### `OnStart()`
* **Description:** Initializes the behavior tree (`self.bt`) for the entity. It constructs a priority root node containing a single `Wander` behavior, configured to wander up to `MAX_WANDER_DIST` units, using predefined timing parameters, and only if `CheckPointFn` returns true for candidate positions.
* **Parameters:** None.
* **Returns:** `nil`.

### `CheckPointFn(pt)` (local helper)
* **Description:** Validates a candidate world position for wandering. Returns `true` only if the point is on a land tile (`TheWorld.Map:IsLandTileAtPoint`) and, if the `moonstorms` component exists, the point lies within the current moonstorm zone (`moonstorms:IsXZInMoonstorm(x, z)`). Returns `true` unconditionally if the `moonstorms` component is not present (e.g., single-player or pre-moonstorm).
* **Parameters:** 
  - `pt`: A point object supporting `Get()`, returning `(x, y, z)` world coordinates.
* **Returns:** `boolean` — `true` if the point is valid for wandering; `false` otherwise.

## Events & Listeners
None. This brain does not register or fire events directly.