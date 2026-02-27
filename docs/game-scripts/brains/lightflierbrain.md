---
id: lightflierbrain
title: Lightflierbrain
description: Controls the autonomous behavior of lightflier entities by managing threat avoidance, home-finding logic, and formation following through a behavior tree.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 339afd05
---

# Lightflierbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`LightFlierBrain` is a brain component that defines the decision-making logic for lightflier entities (e.g., fireflies) in Don't Starve Together. It orchestrates movement, threat response, and home-seeking behavior using a behavior tree (`BT`). The brain integrates with several components—including `formationfollower`, `homeseeker`, `locomotor`, `childspawner`, `burnable`, and `pickable`—to dynamically adjust behavior based on environmental conditions, formation leadership status, and proximity to threats or suitable nesting locations.

The brain prioritizes escaping from threats (`RunAway`), returning to a home location under specific conditions, and resuming normal wandering or following behavior when safe. It resets locomotion and formation flags at the start of behavior execution, ensuring correct movement control transitions between autonomous and formation-driven states.

## Dependencies & Tags
- **Components used:** `burnable`, `childspawner`, `formationfollower`, `homeseeker`, `knownlocations`, `locomotor`, `pickable`
- **Tags:** `scarytoprey` (hunter tags), `NOCLICK` (excluded from threat detection), `lightflier_home` (home location tags), `burnt`, `fire` (excluded from valid home locations)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this brain controls. Inherited from `Brain`. |
| `huntertags` | `table` | `{"scarytoprey"}` | Tags used to identify threatening entities. |
| `NEW_HOME_TAGS` | `table` | `{"lightflier_home"}` | Tags that qualify an entity as a potential home location. |
| `NEW_HOME_NOTAGS` | `table` | `{"burnt", "fire"}` | Tags that disqualify an entity as a valid home location. |

## Main Functions

### `LightFlierBrain:OnStart()`
* **Description:** Initializes the behavior tree for the lightflier entity. Sets initial locomotion and formation-following flags, then constructs a priority-based behavior tree that handles panic events, recent attacks, lack of a leader, and home-finding logic. This function is called when the entity is spawned or its brain is activated.
* **Parameters:** None.
* **Returns:** None.

### `GoHomeAction(inst)`
* **Description:** Generates a buffered action to move toward the lightflier's assigned home location. Only returns an action if the lightflier is not currently busy, the home exists and is valid, and the home is neither burning nor pickable.
* **Parameters:** `inst` (`Entity`) — The entity instance.
* **Returns:** `BufferedAction` if conditions are met, otherwise `nil`.

### `FindHome(inst)`
* **Description:** Ensures the `homeseeker` component exists and assigns a suitable home location to the lightflier if none exists. A valid home is an entity with the `lightflier_home` tag, without `burnt` or `fire` tags, within wandering range.
* **Parameters:** `inst` (`Entity`) — The entity instance.
* **Returns:** None. Assigns the found home via `childspawner:TakeOwnership(inst)`.

### `ShouldGoHome(inst)`
* **Description:** Evaluates whether the lightflier should initiate movement to its home. Returns `true` if the lightflier has been alive for more than 60 seconds and enough offspring are outside (`numchildrenoutside > TUNING.LIGHTFLIER_FLOWER_TARGET_NUM_CHILDREN_OUTSIDE`), OR if it has already been assigned as the designated returning lightflier for this home.
* **Parameters:** `inst` (`Entity`) — The entity instance.
* **Returns:** `boolean` — `true` if the lightflier should go home, otherwise `false`.

## Events & Listeners
* **Listens to:** `"panic"` — Triggers immediate panic behavior combined with a 6-second wait.
* **Pushes:** None explicitly defined in this file.

> Note: The brain uses `BrainCommon.PanicTrigger(self.inst)` and `BrainCommon.ElectricFencePanicTrigger(self.inst)` which internally register and respond to relevant panic-inducing events (e.g., fire, electric fences, predators). These helpers abstract event listening logic but are not defined in this file.