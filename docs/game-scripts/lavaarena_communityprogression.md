---
id: lavaarena_communityprogression
title: Lavaarena Communityprogression
description: Manages community-driven progression and quest data synchronization for the Lava Arena event, handling local and networked state.
tags: [network, event, quest, progression, festival]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 965cf480
system_scope: network
---

# Lavaarena Communityprogression

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`CommunityProgression` is a singleton-like component that orchestrates the progression and quest state for the Lava Arena festival event. It manages local unlock order, progression level/percent, and client-server synchronization of daily and weekly quest data via web queries and network event propagation. It operates in different modes (frontend, dedicated server, client-hosted, or client-only) and adapts behavior accordingly, including retry logic, query caching, and save/load persistence.

## Usage example
```lua
local progression = TheSim:GetMod("lavaarena_communityprogression")
if progression ~= nil then
    progression:RegisterForWorld()
    progression:Load()
    progression:RequestAllData(false, TheNet:GetUserID())
    
    if progression:IsUnlocked("trails") then
        print("Unlock 'trails' is available")
    end
end
```

## Dependencies & tags
**Components used:** `lavaarenaeventstate` (via `TheWorld.net.components.lavaarenaeventstate`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `progression_query_active` | boolean | `false` | Indicates if a progression data query is currently in progress. |
| `progression_query_time` | number or nil | `nil` | Timestamp of last progression query (Unix time). |
| `PROGRESSION_QUERY_EXPIRY` | number | `600` | Query cache expiry time in seconds (10 minutes). |
| `progression_data` | table | `{ level = 1, percent = 0, unlock_order = {} }` | Current progression state (level, percentage, unlock order). |
| `prev_progression_data` | table | `{ level = 1, percent = 0, unlock_order = {} }` | Previous progression state, used to detect new unlocks. |
| `server_progression_json` | string | `""` | Raw JSON string representation of progression data for network sync. |
| `quest_data` | table | `{}` | Per-user quest data, keyed by `userid`. |
| `community_json` | string | `""` | Unused placeholder for community-wide data. |
| `mode` | number | `0` (IS_FRONTEND) | Execution context: `0=frontend`, `1=client-only`, `2=dedicated server`, `3=client-hosted`. |
| `dirty` | boolean | `false` | Flag indicating whether changes require saving to disk. |
| `both_queries_active` | boolean | `false` | Indicates if both progression and quest queries are pending. |

## Main functions
### `GetUnlockData(id)`
* **Description:** Returns metadata (style, icon, atlas) for a given unlock ID. Supports both primary ID and alias.
* **Parameters:** `id` (string) — unlock identifier (e.g., `"trails"`, `"lavaarena_heavyblade"`).
* **Returns:** table or nil — unlock metadata (e.g., `{ id = "trails", style = "creature", ... }`), or `nil` if not found.

### `GetUnlockOrderStyles()`
* **Description:** Returns the ordered list of unlock styles for display (e.g., creature → item → boss).
* **Parameters:** None.
* **Returns:** table — array of `{ style = "creature" }` tables in correct order.

### `GetUnlockOrder()`
* **Description:** Returns the list of unlock IDs in progression order.
* **Parameters:** None.
* **Returns:** table — array of unlock IDs (e.g., `{ "trails", "book_elemental", ... }`).

### `IsLocked(id)`
* **Description:** Determines if an unlock is currently locked for the player.
* **Parameters:** `id` (string) — unlock identifier.
* **Returns:** boolean — `true` if the unlock level is not set.

### `IsUnlocked(id)`
* **Description:** Inverse of `IsLocked`.
* **Parameters:** `id` (string) — unlock identifier.
* **Returns:** boolean — `true` if the unlock has been achieved.

### `GetProgression()`
* **Description:** Returns current progression stats.
* **Parameters:** None.
* **Returns:** table — `{ level = number, percent = number }`.

### `GetLastSeenProgression()`
* **Description:** Returns the progression state from last save/load cycle (used for detecting changes).
* **Parameters:** None.
* **Returns:** table — snapshot of `progression_data` at time of last save/load.

### `GetProgressionKeyBoss()`
* **Description:** Returns the ID of the current progression-key boss (i.e., the boss whose defeat advances the progression level).
* **Parameters:** None.
* **Returns:** string — unlock ID of the current key boss (e.g., `"trails"`, `"beetletaur"`).

### `IsEverythingUnlocked()`
* **Description:** Checks if all unlocks are unlocked.
* **Parameters:** None.
* **Returns:** boolean — `true` when progression level equals total unlock count.

### `GetNumTotalUnlocks()`
* **Description:** Returns the total number of unlocks in the event.
* **Parameters:** None.
* **Returns:** number — fixed count (11 in this implementation).

### `IsNewUnlock(id)`
* **Description:** Checks if an unlock was newly unlocked in the latest session.
* **Parameters:** `id` (string) — unlock identifier.
* **Returns:** boolean — `true` if the unlock level was reached this session but not previously.

### `IsQueryActive()`
* **Description:** Checks if any web query (progression or quest) is currently pending.
* **Parameters:** None.
* **Returns:** boolean — `true` if any active query is in flight.

### `IsProgressionQueryExpired()`
* **Description:** Determines if the cached progression data has expired.
* **Parameters:** None.
* **Returns:** boolean — `true` if data is missing or older than `PROGRESSION_QUERY_EXPIRY`.

### `IsQuestQueryExpired(userid)`
* **Description:** Determines if the cached quest data for a user has expired (based on daily/quest expiry times).
* **Parameters:** `userid` (string or number) — player identifier.
* **Returns:** boolean — `true` if quest data is missing or expired.

### `GetCurrentQuestData(userid)`
* **Description:** Returns full quest data for a user.
* **Parameters:** `userid` (string or number) — player identifier.
* **Returns:** table — quest data, or `{ error_code = "Not Set" }` if unset.

### `RemoveQuestData(userid)`
* **Description:** Clears quest data for a user.
* **Parameters:** `userid` (string or number) — player identifier.
* **Returns:** Nothing.

### `GetServerProgressionJson()`
* **Description:** Returns the last-saved raw JSON string for progression data.
* **Parameters:** None.
* **Returns:** string — JSON-encoded progression state (for network transmission).

### `GetServerQuestJson(userid)`
* **Description:** Returns the last-saved raw JSON string for a user’s quest data.
* **Parameters:** `userid` (string or number) — player identifier.
* **Returns:** string — JSON-encoded quest data, or `""`.

### `RequestProgressionData(force, time)`
* **Description:** Initiates a web query for global progression data; includes retry logic and caching.
* **Parameters:** 
  * `force` (boolean) — bypass cache expiry check.
  * `time` (number) — Unix timestamp for the request.
* **Returns:** Nothing.
* **Error states:** On failure after `NUM_RETRIES` (4), sets `progression_data.error_code` and stops retrying.

### `RequestQuestData(force, userid, time)`
* **Description:** Initiates a web query for a specific user’s quest data; includes retry logic and caching.
* **Parameters:** 
  * `force` (boolean) — bypass cache expiry check.
  * `userid` (string or number) — player identifier.
  * `time` (number) — Unix timestamp for the request.
* **Returns:** Nothing.

### `RequestAllData(force, userid)`
* **Description:** Convenience wrapper that initiates both progression and quest queries in parallel.
* **Parameters:** 
  * `force` (boolean) — bypass cache expiry.
  * `userid` (string or number) — player identifier.
* **Returns:** Nothing.

### `RegisterForWorld()`
* **Description:** Sets up network listeners for progression and quest updates from the server (client/host only); detects execution mode.
* **Parameters:** None.
* **Returns:** Nothing.

### `Load()`
* **Description:** Loads progression and quest data from persistent storage on disk.
* **Parameters:** None.
* **Returns:** Nothing.

### `Save()`
* **Description:** Saves current progression and quest data to persistent storage (client-only; does nothing on dedicated server).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnProgressionQueryComplete(override_mode)`
* **Description:** Internal callback after a progression query finishes; triggers world events or client updates.
* **Parameters:** `override_mode` (number) — mode to use instead of `self.mode`.
* **Returns:** Nothing.

### `OnQuestQueryComplete(userid, override_mode)`
* **Description:** Internal callback after a quest query finishes; updates active quests and notifies client.
* **Parameters:** 
  * `userid` (string or number).
  * `override_mode` (number).
* **Returns:** Nothing.

### `OnClientQueryCompleted()`
* **Description:** Fires `community_clientdata_updated` event when all queries complete.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `progressionjsondirty` — triggers `OnNewProgressionFromServer` when server broadcast occurs.
  - `playerquestjsondirty_<slot>` (for each player slot) — triggers `OnNewQuestFromServer` when quest data for that slot is updated.
- **Pushes:**
  - `community_clientdata_updated` — fired when all queries complete on the client.
  - `community_progression_request_complete` — fired when progression query completes on dedicated/client-hosted server.
  - `community_quest_request_complete` — fired when quest query completes on dedicated/client-hosted server (sent with `{userid = ...}`).