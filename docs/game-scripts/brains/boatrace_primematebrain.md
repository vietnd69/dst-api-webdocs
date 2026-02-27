---
id: boatrace_primematebrain
title: Boatrace Primematebrain
description: Implements the decision-making logic for the Prime Mate character during boat races, prioritizing buoy tossing, leak repair, fire suppression, and rowing behaviors.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f6b87fcb
---

# Boatrace Primematebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavioral tree for the Prime Mate character during boat races. It orchestrates high-priority actions—including tossing buoys at opponents, patching boat leaks, extinguishing fires, and rowing—to support the team's performance. It operates as a stateless behavior tree root and relies heavily on crew member and platform-related components to interact with the game world. Key dependencies include `crewmember`, `inventory`, `timer`, `walkableplatform`, and `knownlocations`.

## Dependencies & Tags

- **Components used:**
  - `crewmember` (via `inst.components.crewmember`)
  - `inventory` (via `inst.components.inventory`)
  - `timer` (via `inst.components.timer`)
  - `walkableplatform` (via `inst.components.walkableplatform`)
  - `knownlocations` (via `inst.components.knownlocations`)
  - `boatleak` (via entity component access)
  - `boatpatch` (via entity component access)
  - `burnable` (via entity component access)
  - `wateryprotection` (via entity component access)
  - `complexprojectile` (via entity component access)

- **Tags:** None added, removed, or checked directly.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_row_cooldown` | number | Random between `0` and `12 * FRAMES` | Initial rowing cooldown duration set on brain start. |
| `_last_row_position` | vector3 or nil | `nil` | Stores the last intended rowing position to avoid repeated actions on the same spot. |
| `_on_row_success` | function or nil | `nil` | Callback executed upon successful rowing, used to reset the row cooldown timer. |

## Main Functions

### `BoatRace_PrimemateBrain:OnStart()`
* **Description:** Initializes the behavior tree for the Prime Mate. Sets the initial rowing cooldown and builds the root priority node containing action sequences in order of priority: blocking during cheering, tossing buoys, patching leaks, extinguishing fires, rowing, following the boat, and wandering.
* **Parameters:** None.
* **Returns:** None.

## Behavior Helper Functions

### `TryBuoyToss(inst)`
* **Description:** Determines whether the character should toss a buoy (via `ACTIONS.TOSS`) at the nearest player or pick up a buoy from the boat. Prioritizes tossing if a buoy is in inventory; otherwise, searches the boat for an undeployed buoy deploy kit.
* **Parameters:** `inst` (entity instance).
* **Returns:** `BufferedAction` or `nil`.

### `FixBoat(inst)`
* **Description:** Attempts to patch the first active leak found on the boat using a `treegrowthsolution` item if no patch exists in inventory. Requires `ACTIONS.REPAIR_LEAK`.
* **Parameters:** `inst` (entity instance).
* **Returns:** `BufferedAction` or `nil`.

### `PutOutBoatFire(inst)`
* **Description:** Attempts to extinguish the most advanced fire/smolder on the boat using a `waterballoon` if no such item is in inventory. Prioritizes highest `fxlevel` burnable entity. Requires `ACTIONS.TOSS`.
* **Parameters:** `inst` (entity instance).
* **Returns:** `BufferedAction` or `nil`.

### `RowBoat(inst)`
* **Description:** Attempts to row the boat at a calculated offset position if the crew member is allowed to row. Uses `ACTIONS.ROW` with a post-success timer reset.
* **Parameters:** `inst` (entity instance).
* **Returns:** `BufferedAction` or `nil`.

### `GetBoat(inst)`
* **Description:** Helper used by the `Follow` behavior to determine the target for following logic.
* **Parameters:** `inst` (entity instance).
* **Returns:** The current boat platform (entity), or `nil`.

### `FindWanderPoint(inst)`
* **Description:** Returns the position to wander toward—either the boat's position or the home location if the boat is unavailable.
* **Parameters:** `inst` (entity instance).
* **Returns:** `vector3`.

### `FindMaximumWanderDistance(inst)`
* **Description:** Computes the maximum radius the character can wander within—either slightly inside the boat's platform radius, or a fallback `20` units.
* **Parameters:** `inst` (entity instance).
* **Returns:** number.

## Events & Listeners

None identified in this component.

```lua
---