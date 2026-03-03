---
id: moonbutterflybrain
title: Moonbutterflybrain
description: Controls the AI behavior of the Moon Butterfly, prioritizing escape from threats, homing to a remembered location, and wandering within a limited radius.
tags: [ai, creature, movement, escape]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: de37f84d
system_scope: brain
---

# Moonbutterflybrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moonbutterflybrain` implements the behavior tree for the Moon Butterfly entity in DST. It defines a priority-based AI sequence: panic and flee from nearby threats (excluding those mitigated by the Wormwood Bugs skill), return to a remembered "home" location if needed, and otherwise wander within a fixed radius. It relies on the `knownlocations` component to store and retrieve the home position and uses standard DST behavior nodes (`RunAway`, `Wander`, `BrainCommon.PanicTrigger`) for decision-making.

## Usage example
```lua
-- This brain is automatically attached to the Moon Butterfly prefab and not added manually.
-- The component registers itself during entity initialization via the brain assignment in the prefab file.
```

## Dependencies & tags
**Components used:** `knownlocations`
**Tags:** Checks `scarytoprey` (via `RunAway` parameters); does not modify tags directly.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the Moon Butterfly. Sets up a priority node with panic, flee, and wander behaviors, ordering them by urgency.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No known failure conditions.

### `OnInitializationComplete()`
* **Description:** Records the Moon Butterfly's current position as its "home" location. This position is stored in the `knownlocations` component and used as the anchor for wandering behavior.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No known failure conditions.

## Events & listeners
None identified.
