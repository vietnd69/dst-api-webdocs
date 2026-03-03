---
id: runaway
title: Runaway
description: Causes an entity to flee from a detected hunter or threat by calculating a safe escape direction and moving away, optionally returning home if near a safe location.
tags: [ai, locomotion, evasion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 4f3945ca
system_scope: locomotion
---

# Runaway

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RunAway` is a behaviour node used in the DST AI system to implement evasion logic. When active, it detects a nearby threat (`hunter`) based on configurable criteria (tags, distance, visibility), computes a safe run direction (including obstacle avoidance and overhang correction), and commands the entity to walk or run away. If `runshomewhenchased` is enabled and the entity has a valid non-burning home, it will attempt to return home instead of running blindly.

This component extends `BehaviourNode` and integrates with `locomotor`, `homeseeker`, `burnable`, `equippable`, `inventoryitem`, and `follower` components to make intelligent movement and condition checks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("behaviourtree")
inst:AddComponent("locomotor")
inst:AddComponent("homeseeker")

inst.components.behaviourtree:AddNode("runaway", {
    type = "runaway",
    hunterparams = { tags = {"monster"}, fn = function(ent, me) return ent ~= me end },
    see_dist = 10,
    safe_dist = 12,
    runhome = true,
    walk_instead = false
})
```

## Dependencies & tags
**Components used:** `locomotor`, `homeseeker`, `burnable`, `equippable`, `inventoryitem`, `follower`

**Tags:** Checks tags (`hunterparams.tags`, `hunterparams.notags`, `hunterparams.oneoftags`) on potential hunters; adds no tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `safe_dist` | number | — | Distance squared threshold at which fleeing succeeds (distance check uses `distsq > safe_dist^2`). |
| `see_dist` | number | — | Maximum distance at which a hunter is detected. |
| `huntertags` | table or nil | `{ hunterparams }` if string | Tags a potential hunter *must* have (if string used, converted to single-item table). |
| `hunternotags` | table | `{ "NOCLICK" }` | Tags a potential hunter *must not* have. |
| `hunteroneoftags` | table or nil | — | Optional: hunter must have *at least one* of these tags. |
| `hunterseeequipped` | boolean or nil | — | If true, hunter must be visible or equipped and owned by another leader (not same as fleeing entity's leader). |
| `runshomewhenchased` | boolean | — | Whether to go home (`GoHome`) instead of fleeing when home is safe. |
| `fix_overhang` | boolean | — | If true and entity is on an ocean overhang, attempts to redirect back to land/water. |
| `walk_instead` | boolean | — | If true, walks (`WalkInDirection`) instead of runs (`RunInDirection`). |
| `safe_point_fn` | function or nil | — | Optional callback returning a point (`Vector3`) to use as a secondary target for direction calculation (e.g., to avoid walls). |
| `gethunterfn` | function or nil | — | Optional custom function to retrieve/update the hunter reference. |
| `hunterfn` | function or nil | — | Optional filter function to validate a potential hunter (`fn(hunter, self)` returns `true`/`false`). |

## Main functions
### `Visit()`
*   **Description:** Main execution method of the behaviour node. First checks for a valid hunter within `see_dist` (using `gethunterfn`, `hunterseeequipped`, or `FindEntity`). If a hunter is found and passes `shouldrunfn` (if provided), it sets status to `RUNNING`. While `RUNNING`, it moves the entity away from the hunter; if `runshomewhenchased` is enabled and the home is safe, it runs home instead. When the entity is outside `safe_dist`, status changes to `SUCCESS` and movement stops.
*   **Parameters:** None (overrides `BehaviourNode.Visit`).
*   **Returns:** Nothing.
*   **Error states:** Sets status to `FAILED` if hunter is lost, `safe_point_fn` fails to find a valid angle, or `homeseeker:GoHome` has no home.

### `GetRunAngle(pt, hp, sp)`
*   **Description:** Calculates the optimal run angle away from the hunter (`hp`) relative to the entity's position (`pt`), optionally using a secondary safe point (`sp`) for obstacle-aware pathing. Applies wall avoidance and water/land overhang correction (`fix_overhang`) if needed.
*   **Parameters:**  
    - `pt` (`Vector3`) — Entity position.  
    - `hp` (`Vector3`) — Hunter position.  
    - `sp` (`Vector3` or nil) — Optional safe point to influence direction.  
*   **Returns:** `number` — Angle in degrees (0–360) to run toward, or fallback to `hp + 180` if no safe direction found.
*   **Error states:** May return raw angle with no deflection if all obstacle-avoidance attempts fail.

## Events & listeners
- **Listens to:** None (behaviour tree control flow is event-driven via `Sleep` and status updates, not `ListenForEvent`).
- **Pushes:** No events; relies on behaviour tree `SUCCESS`, `RUNNING`, `FAILED` status transitions.
