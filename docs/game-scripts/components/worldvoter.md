---
id: worldvoter
title: WorldVoter
description: Manages world-wide voting sessions, including dialog display, vote collection, timeout handling, and result enforcement across master and secondary shards.
tags: [network, voting, world]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c727b55a
system_scope: world
---
# WorldVoter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WorldVoter` orchestrates world-level voting events (e.g., banning players, toggling settings) in DST. It handles vote lifecycle management—including initiation, countdown, vote tallying, and result enforcement—while synchronizing state between master and secondary shards. It coordinates with `playervoter` (to update per-player vote selection and squelch status) and `usercommands` (to process vote start/finish requests). The component is attached to the world entity (`TheWorld`).

## Usage example
```lua
-- Example: Check if a vote is currently active
if TheWorld.components.worldvoter:IsVoteActive() then
    print("A vote is currently in progress.")
end

-- Example: Check if voting is enabled on the server
if TheWorld.components.worldvoter:IsEnabled() then
    print("Voting is enabled.")
end
```

## Dependencies & tags
**Components used:** `playervoter` (via `player.components.playervoter`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` (injected) | The entity instance (`TheWorld`) this component is attached to. |

## Main functions
### `IsVoteActive()`
* **Description:** Returns whether a vote dialog is currently displayed.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the vote dialog is visible, otherwise `false`.

### `IsEnabled()`
* **Description:** Returns whether world voting is currently enabled (e.g., by server config).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if voting is enabled, otherwise `false`.

### `OnUpdate(dt)`
* **Description:** Handles vote countdown, net sync, and vote result finalization. Called every frame while a vote is active.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.
* **Error states:** May call `CheckVoteResults` or `CancelCountdown` if countdown expires or voting completes.

### `OnPostInit()`
* **Description:** Initializes vote state after component loading (e.g., sets default enabled status on master shard if allowed by config).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `countdowndirty` — triggers countdown display updates.
  - `playeractivated` (non-dedicated only) — refreshes vote dialog visibility.
  - `ms_playerjoined` — updates joiner’s vote selection/squelch status.
  - `ms_startvote`, `ms_stopvote`, `ms_receivevote` (master shard only) — initiates, cancels, or records votes.
  - `secondary_worldvoterupdate`, `secondary_worldvotersquelchedupdate`, `secondary_worldvoterenabled` (non-master shard only) — syncs vote state from master shard.
  - `votecountsdirty` (non-master only) — updates vote counts on client.

- **Pushes:**
  - `worldvotertick` — fires countdown ticks.
  - `showvotedialog` / `hidevotedialog` — triggers UI dialog visibility.
  - `votecountschanged` — notifies of updated vote totals.
  - `master_worldvoterupdate`, `master_worldvoterenabled` (master shard only) — broadcasts master vote state.
  - `master_worldvotersquelchedupdate` (master shard only) — broadcasts squelch list changes.

