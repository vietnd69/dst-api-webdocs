---
id: findflower
title: Findflower
description: A behaviour node that identifies and selects the nearest valid flower for pollination, then initiates a pollination action.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: ac58c15a
---

# Findflower

## Overview
`Findflower` is a behaviour node responsible for selecting a nearby flower as a pollination target and initiating the pollination action. It extends `BehaviourNode`, integrating into the AI behaviour tree system. The component reads from the `pollinator` component to determine eligibility and validity of flowers as targets, and uses the `locomotor` component to execute movement toward the target. It relies on proximity-based world scanning (`GetClosestInstWithTag` and `FindEntity`) to locate suitable flowers within range and avoid conflicting pollination attempts by other entities.

## Dependencies & Tags
- **Components used:**
  - `pollinator`: Reads `target` and calls `CanPollinate(target)`; sets `target`.
  - `locomotor`: Calls `PushAction(action)` to queue movement and pollination.
- **Tags:**
  - `FINDFLOWER_MUST_TAGS = {"pollinator"}`: Used to filter entities during conflict checks.
  - `FLOWER_TAGS = {"flower"}`: Used to identify candidate flowers.
- **Tags checked:** `pollinator`, `flower`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | The entity instance this behaviour node operates on (typically the pollinator entity). |
| `status` | `string` | `READY` (inherited from `BehaviourNode`) | Current state of the behaviour node (`READY`, `RUNNING`, `FAILED`). |

## Main Functions
### `DBString()`
* **Description:** Returns a human-readable debug string describing the current target flower, for logging and behaviour tree inspection.
* **Parameters:** None.
* **Returns:** `string` – A string of the format `"Go to flower <target>"`, where `<target>` is `nil` or the entity reference of the target flower.

### `Visit()`
* **Description:** Main execution method of the behaviour node. In `READY` state, it picks a target and initiates movement/pollination. In `RUNNING` state, it validates that the target is still valid and unconflicted; fails if not.
* **Parameters:** None.
* **Returns:** `void`.

### `PickTarget()`
* **Description:** Scans for the closest flower within `SEE_DIST` (30 units) and sets it as the pollination target if eligible. A flower is eligible if:
  - It exists and is tagged with `"flower"`.
  - `pollinator:CanPollinate()` returns `true`.
  - No other entity with the `"pollinator"` tag is already targeting it (conflict resolution).
* **Parameters:** None.
* **Returns:** `void`. Sets `self.inst.components.pollinator.target` to the chosen flower or `nil` if none found/eligible.

## Events & Listeners
None.