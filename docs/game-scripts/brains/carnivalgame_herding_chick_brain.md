---
id: carnivalgame_herding_chick_brain
title: Carnivalgame Herding Chick Brain
description: Controls the behavior of a herding-chick entity during a minigame by prioritizing fleeing from threats and players, avoiding the home station, and wandering near the home location.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2621a965
---

# Carnivalgame Herding Chick Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component defines the behavior tree for a chicken-like entity participating in the herding minigame. It governs movement decisions using a priority-based behavior tree: the chick first flees from players or participants (`minigame_participator`/`minigame_spectator` tags) when within a critical distance, then avoids the designated home station area, and finally wanders within a bounded radius of the home location if no higher-priority actions apply. It depends on the `locomotor` and `knownlocations` components for movement and spatial referencing.

## Dependencies & Tags
- **Components used:** `locomotor`, `knownlocations`
- **Tags:**
  - `minigame_participator` (used for runaway behavior triggering)
  - `minigame_spectator` (used for runaway behavior triggering)
  - `carnivalgame_herding_station` (used to define a zone to avoid)

## Properties
No public properties are explicitly initialized in the constructor. Behavior parameters are defined as local constants at the top level of the file.

## Main Functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree for the entity. Constructs a priority node structure where fleeing and avoiding the station take precedence over wandering. The behavior tree is only active while the `locomotor` component exists.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
This component does not register or push any events directly. Behavior logic is encoded entirely within the behavior tree nodes.

---