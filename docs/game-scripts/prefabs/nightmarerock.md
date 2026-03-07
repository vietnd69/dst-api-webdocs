---
id: nightmarerock
title: Nightmarerock
description: A reactive environmental obstacle that physically rises or lowers based on nearby player sanity status, used in the sanity rock mechanics.
tags: [environment, obstacle, sanity, physics]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3ddccf0d
system_scope: environment
---

# Nightmarerock

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`Nightmarerock` is a functional obstacle that toggles between active (rising) and inactive (lowered) states based on the sanity status of nearby players. It implements dynamic collision and pathfinding behavior: when active and not concealed, it blocks characters, items, and obstacles; when concealed or inactive, its collision profile changes accordingly. Two prefabs are defined: `sanityrock` (active when players are sane) and `insanityrock` (active when players are insane). It interacts with the `inspectable` and `sanity` components for status reporting and logic evaluation, and with the pathfinding system via shared walls to avoid overlapping region conflicts.

## Usage example
```lua
-- Example: Create and configure a sanity rock prefab instance
local inst = CreateEntity()
inst:AddTag("sanityrock")
-- (In practice, prefabs are instantiated via Prefab() system, not CreateEntity())
-- The component logic is embedded in the prefab definition itself.
```

## Dependencies & tags
**Components used:** `inspectable` (for status reporting), `sanity` (via external call on players)
**Tags added:** `antlion_sinkhole_blocker`, plus either `"sanityrock"` or `"insanityrock"` depending on prefab variant.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active` | boolean | `false` | Current physical state (true = rock is up/rising). |
| `active_queue` | boolean | `false` | Target state determined during refresh; may differ from `active` during transition. |
| `conceal` | boolean | `nil` (treated as false) | Whether the rock is visually hidden/concealed (e.g., during minigames). |
| `conceal_queued` | boolean | `nil` | Target concealment state; triggers `conceal` or `reveal` state transition. |
| `activeonsane` | boolean | `true` (sanityrock) / `false` (insanityrock) | Determines whether the rock activates when players are sane (`true`) or insane (`false`). |
| `_pftable` | table | `nil` | Stores grid coordinates of pathfinding walls added/removed by this entity. |
| `_ispathfinding` | net_bool | `false` | Networked flag indicating whether pathfinding walls should be active. |

## Main functions
### `refresh(inst)`
*   **Description:** Recalculates whether the rock should be active based on proximity and player sanity state. Compares each valid player’s sanity (`IsSane` or `IsInsane`) with `inst.activeonsane`, and activates if any player is within `NEAR_DIST_SQ` or `FAR_DIST_SQ`. Triggers a state transition if needed.
*   **Parameters:** `inst` (Entity instance) — the rock instance to evaluate.
*   **Returns:** Nothing.
*   **Error states:** Skips evaluation entirely if rock is currently concealed (`inst.conceal` or `inst.conceal_queued`).

### `OnIsPathFindingDirty(inst)`
*   **Description:** Synchronizes pathfinding walls with the rock’s current `_ispathfinding` state. Adds walls when becoming pathfinding-dirty (active + not concealed), removes them when inactive. Handles shared wall logic to prevent conflicts in overlapping obstacle regions.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `ConcealForMinigame(inst, conceal)`
*   **Description:** Temporarily forces the rock into a concealed state for minigames or special events. Sets `conceal_queued`, clears `active_queue`, and triggers a `conceal` or `reveal` state transition.
*   **Parameters:** `conceal` (boolean) — `true` to conceal, `false` or `nil` to reveal.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns a status string for the `inspectable` component (e.g., `"ACTIVE"` or `"INACTIVE"`).
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** `"ACTIVE"` if `inst.active` is `true`, otherwise `"INACTIVE"`.

### `updatephysics(inst)`
*   **Description:** Updates physics collision group and mask based on `inst.conceal` and `inst.active`. Configures collision to include `CHARACTERS` only when active and not concealed.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onispathfindingdirty` — triggers `OnIsPathFindingDirty` to manage pathfinding walls when `_ispathfinding` state changes.
- **Pushes:** None — this component does not fire custom events, but integrates with `inst.sg` state graph transitions (`raise`, `lower`, `conceal`, `reveal`).
