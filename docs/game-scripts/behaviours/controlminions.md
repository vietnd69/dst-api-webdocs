---
id: controlminions
title: Controlminions
description: Controls minion behavior to harvest, pick, or pick up nearby target entities within a defined radius.
tags: [ai, minions, combat, harvesting, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: e5bc79f8
system_scope: ai
---

# Controlminions

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Controlminions` is a behaviour node that enables a minion spawner's minions to cooperatively harvest, pick, or pick up target entities within their range. It operates as part of the AI state graph system (`stategraphs`) and uses `BufferedAction` to queue valid actions for individual minions. It queries entities based on tags and component availability, selecting the closest available minion for each action.

The component relies on the `minionspawner` component to track active minions and their positions, and interfaces with multiple item components (e.g., `crop`, `stewer`, `dryer`, `pickable`, `inventoryitem`) to determine action eligibility.

## Usage example
```lua
-- Typically instantiated automatically by the stategraph system.
-- Example usage in a stategraph node configuration:
stategraph.SetStateGraph("SGminion")
-- ...
-- In a branch node:
-- {
--     name = "ControlMinions",
--     node = require("behaviours/controlminions")(inst),
-- },
```

## Dependencies & tags
**Components used:** `minionspawner`, `crop`, `stewer`, `dryer`, `pickable`, `inventoryitem`, `transform`
**Tags:** Checks against multiple filter tags (`NO_TAGS` and `ACT_TAGS`) during entity search; no tags are added/removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this behaviour belongs to (usually the spawner entity). |
| `ms` | `MinionSpawner` component | `nil` | Reference to the minion spawner component. |
| `radius` | number | `nil` | Computed radius for entity search; recalculated when needed based on minion positions. |
| `minionrange` | number | `3.5` | Maximum distance (in world units) between minions and targets to consider action eligibility. |

## Main functions
### `GetClosestMinion(item, minions)`
*   **Description:** Finds the closest minion to a target item within `minionrange`, excluding the item itself. Used to assign tasks to specific minions.
*   **Parameters:**
    *   `item` (`Entity`) — The target entity to measure distance to.
    *   `minions` (`table` of `Entity`) — List of minion entities to search.
*   **Returns:** `Entity` — The closest minion within range, or `nil` if none are close enough.
*   **Error states:** Returns `nil` if all minions are too far away or the item is invalid.

### `Visit()`
*   **Description:** Main entry point for the behaviour node. Evaluates minion state, updates `radius` as needed, finds eligible target entities, and assigns actions (`HARVEST`, `PICK`, or `PICKUP`) to appropriate minions.
*   **Parameters:** None.
*   **Returns:** `nil` — Modifies internal `self.status` (`SUCCESS`, `FAILED`, or `RUNNING`).
*   **Error states:** Returns early with `FAILED` status if `ms.minionpositions` is `nil`, no minions are active, or no eligible entities are found.

## Events & listeners
*   **Listens to:** None — this behaviour does not register event listeners.
*   **Pushes:** None — this behaviour does not fire events directly.
