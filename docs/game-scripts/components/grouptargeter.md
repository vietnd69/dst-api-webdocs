---
id: grouptargeter
title: Grouptargeter
description: Implements weighted target selection and dynamic weight redistribution for entities managing multiple potential targets.
tags: [ai, combat, targeting]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dfe8c577
system_scope: entity
---

# Grouptargeter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Grouptargeter` manages a set of weighted targets for an entity and supports dynamic target selection based on evolving weights. It is used for AI behaviors that need to track multiple targets and probabilistically select one, adjusting influence weights over time (e.g., after picking a target, weights are shifted to favor less-selected targets). It does not directly handle combat or movement but serves as a targeting subsystem for components like `brain` or custom AI logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("grouptargeter")

-- Add initial targets
inst.components.grouptargeter:AddTarget(entity1)
inst.components.grouptargeter:AddTarget(entity2)

-- Attempt to select a new target probabilistically
local new_target = inst.components.grouptargeter:TryGetNewTarget()
if new_target then
    -- Handle new target selection
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targets` | table | `{}` | Map of target entities → numeric weights (sum to 1.0). |
| `total_weight` | number | `1` | Total sum of target weights (intended to be 1.0). |
| `weight_change` | number | `0.1` | Amount of weight redistributed when a target is picked. |
| `num_targets` | number | `0` | Count of tracked targets. |
| `min_chance` | number | `0` | Lower bound for target-reselection probability. |
| `max_chance` | number | `0.7` | Upper bound for target-reselection probability. |
| `chance_delta` | number | `0.1` | Increment added to `current_chance` on failed reselection. |
| `current_chance` | number | `0` | Current probability threshold for attempting new target selection. |

## Main functions
### `StartTracking(target)`
* **Description:** Begins listening for the `onremove` event on the given target to auto-deregister it when removed.  
* **Parameters:** `target` (entity) — the target entity to track.  
* **Returns:** Nothing.  

### `StopTracking(target)`
* **Description:** Stops listening for the `onremove` event on the given target.  
* **Parameters:** `target` (entity) — the target entity to stop tracking.  
* **Returns:** Nothing.  

### `AddTarget(target)`
* **Description:** Adds a new target with computed weight to maintain unit weight sum. Existing targets’ weights are proportionally reduced.  
* **Parameters:** `target` (entity) — the entity to add as a target.  
* **Returns:** Nothing.  
* **Error states:** No effect if `target` is already in `targets`. |

### `RemoveTarget(target)`
* **Description:** Removes a target and redistributes its weight among remaining targets. Resets tracking listeners.  
* **Parameters:** `target` (entity) — the entity to remove from targets.  
* **Returns:** Nothing.  
* **Error states:** No effect if `target` is not in `targets`. |

### `GetTotalWeight()`
* **Description:** Computes and prints the sum of all target weights (intended for debugging).  
* **Parameters:** None.  
* **Returns:** Nothing (debug print only).  

### `OnPickTarget(target)`
* **Description:** Reduces the weight of the picked target and increases weights of others to equalize selection pressure over time.  
* **Parameters:** `target` (entity) — the target that was selected.  
* **Returns:** Nothing.  
* **Error states:** Early return with no effect if `num_targets <= 1`. |

### `GetTargets()`
* **Description:** Returns the current target→weight mapping.  
* **Parameters:** None.  
* **Returns:** `table` — copy reference to the internal `targets` table. |

### `IsTargeting(target)`
* **Description:** Checks whether a given entity is currently a tracked target.  
* **Parameters:** `target` (entity or `nil`) — the entity to check.  
* **Returns:** `boolean` — `true` if `target` is in `targets`, otherwise `false`. |

### `TryGetNewTarget()`
* **Description:** Attempts to select a new target using probabilistic reselection logic. Updates `current_chance` on failure.  
* **Parameters:** None.  
* **Returns:** `entity` or `nil` — the newly selected target, or `nil` if selection failed. |

### `SelectTarget()`
* **Description:** Performs weighted random selection over tracked targets.  
* **Parameters:** None.  
* **Returns:** `entity` or `nil` — the selected target; undefined behavior if `targets` is empty. |

## Events & listeners
- **Listens to:** `onremove` (on each tracked target) — triggers `RemoveTarget` automatically via `_ontargetremoved` callback.  
- **Pushes:** None identified
