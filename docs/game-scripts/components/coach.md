---
id: coach
title: Coach
description: This component allows an entity to periodically inspire nearby players and their followers, granting them sanity and combat buffs.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 297abeff
---

# Coach

## Overview
The `Coach` component enables an entity to act as an inspirer or leader, periodically granting benefits to other nearby players and their followers. These benefits include sanity restoration for players and a temporary combat buff (represented by the "wolfgang_coach_buff" debuff, which is often used in DST for temporary positive effects) for followers. The component manages the timing and radius of these inspiration events, and can also make the entity communicate when no team members are in range to be inspired.

## Dependencies & Tags
This component relies on the following components being present on the host entity or other entities:
*   `inst.components.leader` (on the coaching entity and other players)
*   `inst.components.sanity` (on other players)
*   `inst.components.talker` (on the coaching entity)
*   `inst.components.combat` (implicitly for buffs, though not directly accessed)

**Tags:**
*   Adds the `"coaching"` tag to the host entity when `Enable()` is called.
*   Removes the `"coaching"` tag from the host entity when `Disable()` is called.

## Properties
| Property         | Type      | Default Value | Description                                                                                                                                              |
|:-----------------|:----------|:--------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `inst`           | `Entity`  | `self`        | A reference to the entity this component is attached to.                                                                                                 |
| `enabled`        | `boolean` | `false`       | A flag indicating whether the coaching functionality is currently active.                                                                                  |
| `randtime`       | `number`  | `30`          | A value used to introduce randomness into the delay before the next inspiration event. The actual delay will be `math.random()*randtime + settime`.        |
| `settime`        | `number`  | `10`          | A base time in seconds used for scheduling the next inspiration event and as a minimum cooldown between inspirations.                                      |
| `lastcoachtime`  | `number`  | `nil`         | Stores the game time (retrieved via `GetTime()`) when the last successful inspiration event occurred, used for enforcing cooldowns.                      |
| `noteamlasttime` | `boolean` | `nil`         | A flag used to alternate dialogue when no teammates are found to inspire, preventing spam. It's set to `true` on the first "no team" message.           |
| `inspiretask`    | `Task`    | `nil`         | A handle to the `Task` object returned by `inst:DoTaskInTime`, allowing the inspiration loop to be cancelled or managed.                                   |

## Main Functions
### `Enable()`
*   **Description:** Activates the coaching component. It sets the `enabled` flag to `true`, adds the `"coaching"` tag to the host entity, and initiates the periodic inspiration process by calling `StartInspiring()`.
*   **Parameters:** None.

### `Disable()`
*   **Description:** Deactivates the coaching component. It sets the `enabled` flag to `false`, removes the `"coaching"` tag from the host entity, and halts the periodic inspiration process by calling `StopInspiring()`.
*   **Parameters:** None.

### `local function inspire(inst)`
*   **Description:** This is the core logic function that executes periodically. It checks if enough time has passed since the last inspiration. If so, it identifies nearby players within `INSPIRE_DIST` (25 units) and their followers.
    *   Players with less than 75% sanity receive a `SANITY_BUFF` (5 points) to their sanity.
    *   Followers of nearby players receive a temporary combat buff (internally applied via "wolfgang_coach_buff" debuff, which functions as a temporary stat modifier in DST). They also `PushEvent("cheer")`.
    *   If any entity was successfully inspired, the host entity `PushEvent("coach")`.
    *   If no entities were inspired, the host entity's `talker` component will announce "ANNOUNCE_WOLFGANG_NOTEAM" on an alternating basis.
    *   Finally, it schedules the next call to `inspire` using `DoTaskInTime`, with a delay determined by `randtime` and `settime`.
*   **Parameters:**
    *   `inst`: The entity instance that owns this `Coach` component.

### `StartInspiring()`
*   **Description:** Ensures that the inspiration task is scheduled to run. If there's no active `inspiretask`, it schedules a new one to call the `inspire` function after `TUNING.COACH_TIME_TO_INSPIRE` seconds.
*   **Parameters:** None.

### `StopInspiring()`
*   **Description:** Cancels any currently active inspiration task. If `inspiretask` exists, it cancels it and sets `inspiretask` to `nil`.
*   **Parameters:** None.

## Events & Listeners
This component pushes the following events:
*   `inst:PushEvent("coach")`: Triggered on the host entity when it successfully inspires at least one other entity.
*   `v:PushEvent("cheer")`: Triggered on individual follower entities when they receive the combat buff.