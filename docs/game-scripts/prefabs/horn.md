---
id: horn
title: Horn
description: A consumable instrument that召集s beefalo followers and tends farm plants when used by the player.
tags: [instrument, consumable, follower, tool]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: db8154d9
system_scope: entity
---

# Horn

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `horn` prefab is a single-use tool and instrument that allows the player to attract nearby beefalo (specifically adult ones) to follow them. When used, it triggers loyalty time additions for eligible beefalo and may also heal tended farm plants. It relies heavily on the `instrument`, `tool`, `leader`, `follower`, `combat`, and `finiteuses` components to coordinate group behavior and track usage.

## Usage example
```lua
-- typical use via player action (e.g., hotbar click)
local inst = CreateEntity()
inst:AddComponent("instrument")
inst:AddComponent("tool")
inst:AddComponent("finiteuses")
-- See fn() in source for full setup; usage is via ACTIONS.PLAY
```

## Dependencies & tags
**Components used:** `instrument`, `tool`, `finiteuses`, `combat`, `follower`, `herdmember`, `leader`, `farmplanttendable`, `skilltreeupdater`, `inventoryitem`, `inspectable`
**Tags:** Adds `horn`, `tool`, `instrument`. Checks `battlesinger`, `beefalo`, `baby`.

## Properties
No public properties.

## Main functions
### `FollowLeader(follower, leader)`
*   **Description:** Pushes a `"heardhorn"` event onto the `follower`'s state graph, notifying it that a horn was sounded by `leader`.
*   **Parameters:** `follower` (EntityInstance), `leader` (EntityInstance).
*   **Returns:** Nothing.

### `TryAddFollower(leader, follower)`
*   **Description:** Attempts to add `follower` to `leader`'s follower list if the follower is a non-baby beefalo and the leader hasn't exceeded the maximum follower count. Adds loyalty time and stops combat if the beefalo was targeting the leader.
*   **Parameters:** `leader` (EntityInstance), `follower` (EntityInstance).
*   **Returns:** Nothing.
*   **Error states:** No effect if the follower is a baby beefalo, already added, or the leader's follower count exceeds `TUNING.HORN_MAX_FOLLOWERS`.

### `HearHorn(inst, musician, instrument)`
*   **Description:** Main handler triggered when a horn is heard by another entity. Stops the entity's combat if active, attempts to add it as a follower (and its herd members), and tends farm plants.
*   **Parameters:** `inst` (EntityInstance) — the entity hearing the horn, `musician` (EntityInstance) — the horn player, `instrument` (unknown type, unused directly).
*   **Returns:** Nothing.

### `OnPlayHorn(inst, musician)`
*   **Description:** Called after the horn is played. Sends a remote procedure call (RPC) to notify the client if the player is a `battlesinger` and the "wathgrithr_songs_revivewarrior" skill is not active.
*   **Parameters:** `inst` (EntityInstance), `musician` (EntityInstance).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (uses callbacks via component APIs instead).
- **Pushes:** `heardhorn` (via state graph) — triggered on entities that hear the horn.