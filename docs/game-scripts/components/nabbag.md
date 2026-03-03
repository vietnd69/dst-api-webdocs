---
id: nabbag
title: Nabbag
description: Implements the Wortox ability to pick up multiple items in a forward cone and net multiple entities in sequence.
tags: [combat, inventory, wortox, cone]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2b0860ef
system_scope: inventory
---

# Nabbag

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Nabbag` is a component that enables the Wortox character’s signature ability: rapidly picking up multiple valid items within a forward-facing cone, or repurposing a net to hit multiple targets in sequence. It manages both item collection (`DoNabFromAct`) and network replication (`ReplicateNetFromAct`) logic, carefully handling stackable stacking, item limits, and finite-uses consumption. It integrates closely with `inventory`, `finiteuses`, and `stackable` components to ensure proper pickup flow and stack consolidation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("nabbag")
-- Called internally by WORTOX_ABILITY. Nabbag does not expose public methods directly.
-- Example of action invocation (typically handled by action system):
-- act.doer.components.nabbag:DoNabFromAct(act)
```

## Dependencies & tags
**Components used:** `finiteuses`, `inventory`, `stackable`, `inventoryitem`
**Tags:** Adds `"nabbag"` to the entity on construction; removes it on component removal.
**Tuning keys used:** `TUNING.SKILLS.WORTOX.NABBAG_CONEANGLE`, `TUNING.SKILLS.WORTOX.NABBAG_MAX_RADIUS`, `TUNING.SKILLS.WORTOX.NABBAG_CIRCLE_RADIUS`, `TUNING.SKILLS.WORTOX.NABBAG_MAX_USES_PER_NAB_PERCENT`, `TUNING.SKILLS.WORTOX.NABBAG_MAX_ITEMS_PER_NAB`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `replicatingnet` | `boolean?` | `nil` | Flag indicating whether a `ReplicateNetFromAct` call is in progress (used to prevent recursion). |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup handler; removes the `"nabbag"` tag when the component is removed from its entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoNabFromAct(act)`
* **Description:** Performs the main nabbag (item-pickup) logic. Picks up the initial target item, then scans all valid entities in the forward cone to pick up additional items — up to `NABBAG_MAX_ITEMS_PER_NAB` total. Handles stackable stacking via a custom `HandleLeftoversFn`, consumes finite uses, and enforces the cone angle and radius limits.
* **Parameters:**  
  `act` (`table`) — Action table containing:  
  - `doer` (`Entity`) — The character performing the action  
  - `target` (`Entity`) — The first target to pick up  
  - `invobject` (`Entity`) — The item used to perform the action (e.g., net)  
  - `rmb` (`boolean`) — Right mouse button flag  
* **Returns:** `success` (`boolean`), `reason` (`string?`) — Success status and optional rejection reason.
* **Error states:**  
  - Returns `false` if the initial target has any of the disallowed tags (`INLIMBO`, `FX`, `_container`, `heavy`, `fire`).  
  - Early termination occurs if `invobject` is consumed or max-item/usage limits are reached.

### `ReplicateNetFromAct(act)`
* **Description:** Used when the net action hits multiple entities in sequence (network replication). Finds all valid entities in the cone and simulates `ACTIONS.NET` on each, one after another, until the net is used up.
* **Parameters:**  
  `act` (`table`) — Action table containing:  
  - `doer` (`Entity`) — The character performing the action  
  - `target` (`Entity`) — Original (unused) target  
  - `invobject` (`Entity`) — The net item  
  - `rmb` (`boolean`) — Right mouse button flag  
* **Returns:** Nothing.
* **Error states:**  
  - Exits early if `self.replicatingnet` is already `true`.  
  - Early termination occurs if `invobject` becomes invalid after a hit.

## Events & listeners
None. This component does not register or fire any events directly.
