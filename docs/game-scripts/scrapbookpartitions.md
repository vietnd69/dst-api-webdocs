---
id: scrapbookpartitions
title: Scrapbookpartitions
description: Manages chunked storage and logic for the scrapbook data system, including tracking what items each character has seen or inspected, and coordinating with the backend for persistence.
tags: [scrapbook, persistence, character, network, data]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: components
source_hash: 6e0f214e
system_scope: player
---

# Scrapbookpartitions

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ScrapbookPartitions` is a data management component that partitions the scrapbook key space into multiple buckets (16 buckets total) for efficient backend storage and syncing. It tracks what entities (by prefab name) a player has seen or inspected, associating inspection data with specific characters using bitmask flags. The component acts as the single entry point for interacting with scrapbook data and handles loading, saving, offline and online syncing, and client-server RPC coordination. It depends heavily on `screens/redux/scrapbookdata` for metadata about entries and uses `TheInventory` and `TheSim` for storage operations.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("scrapbookpartitions")

-- Mark a thing as seen
inst.components.scrapbookpartitions:SetSeenInGame("bee")

-- Mark that the current player has inspected a thing
inst.components.scrapbookpartitions:SetInspectedByCharacter("bee", inst.prefab)

-- Check inspection status
local seen = inst.components.scrapbookpartitions:WasSeenInGame("bee")
local inspected = inst.components.scrapbookpartitions:WasInspectedByCharacter("bee", inst.prefab)

-- Get scrapbook level (0=unknown, 1=seen, 2=inspected)
local level = inst.components.scrapbookpartitions:GetLevelFor("bee")
```

## Dependencies & tags
**Components used:** None (this is a plain Lua class, not an ECS component; it is typically instantiated as a global or per-player property like `ThePlayer.scrapbookpartitions` or `TheScrapbookPartitions`).
**Tags:** None (does not directly manipulate entity tags).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storage` | table | `{}` | In-memory hash-to-data mapping for scrapbook entries. Keys are hashed string identifiers, values are 32-bit integers encoding flags and character masks. |
| `dirty_buckets` | table | `{}` | Tracks which of the 16 buckets have unsaved changes. Keys are bucket indices `0..15`. |
| `synced` | boolean | `nil` | Internal flag indicating whether online profile data has been applied. Set to `true` after `ApplyOnlineProfileData` succeeds. |
| `loaded` | boolean | `nil` | Internal flag indicating whether a local disk save has been applied. Set to `true` after `ApplyOnlineProfileData` detects no disk data but loaded profile data. |

## Main functions
### `RedirectThing(thing)`
* **Description:** Converts an entity instance to its scrapbook identifier (string), preferring `thing.scrapbook_proxy` if present, otherwise falling back to `thing.prefab`. If `thing` is not an entity, returns it unchanged.
* **Parameters:** `thing` (Entity or string) — either an entity instance or a string identifier.
* **Returns:** string — the resolved scrapbook entry identifier.
* **Error states:** None.

### `WasSeenInGame(thing)`
* **Description:** Checks if a thing has been seen (i.e., recorded in storage), regardless of inspection status.
* **Parameters:** `thing` (string) — resolved scrapbook entry identifier.
* **Returns:** boolean — `true` if the thing has at least one non-zero data entry in storage.
* **Error states:** Returns `false` if `thing` is not a string.

### `SetSeenInGame(thing)`
* **Description:** Marks a thing as seen by storing a zero-initialized entry (just the bucket presence) in storage.
* **Parameters:** `thing` (string) — resolved scrapbook entry identifier.
* **Returns:** Nothing.
* **Error states:** No-op if `SCRAPBOOK_DATA_SET` does not define the entry, or if it is already marked as seen.

### `WasViewedInScrapbook(thing)`
* **Description:** Checks if a thing has been explicitly clicked/inspected in the scrapbook UI (flag `VIEWED_IN_SCRAPBOOK` set).
* **Parameters:** `thing` (string) — resolved scrapbook entry identifier.
* **Returns:** boolean — `true` if the `VIEWED_IN_SCRAPBOOK` flag is set in storage.
* **Error states:** Returns `false` if `thing` is not a string, or if no storage entry exists.

### `SetViewedInScrapbook(thing, value)`
* **Description:** Sets or clears the `VIEWED_IN_SCRAPBOOK` flag for a thing.
* **Parameters:**  
  - `thing` (string) — resolved scrapbook entry identifier.  
  - `value` (boolean or `nil`) — `true` to set flag, `false` or `nil` to clear flag. If `nil`, treated as `true`.
* **Returns:** Nothing.
* **Error states:** No-op if `SCRAPBOOK_DATA_SET` does not define the entry or `thing` is not a string; also returns early if the flag state is unchanged.

### `WasInspectedByCharacter(thing, character)`
* **Description:** Checks if a specific character has personally inspected the thing, based on whether their character mask is present in storage.
* **Parameters:**  
  - `thing` (string) — resolved scrapbook entry identifier.  
  - `character` (string) — character prefab name (e.g., `"wilson"`).
* **Returns:** boolean — `true` if the character’s mask is set in the storage data for this entry.
* **Error states:** Modded characters default to `"wilson"` for storage; returns `false` for unknown characters or non-string inputs.

### `SetInspectedByCharacter(thing, character)`
* **Description:** Marks a thing as inspected by a specific character and updates the scrapbook UI.
* **Parameters:**  
  - `thing` (string) — resolved scrapbook entry identifier.  
  - `character` (string) — character prefab name.
* **Returns:** Nothing.
* **Error states:** Modded characters default to `"wilson"`; no-op if entry is unknown or character invalid; also clears the `VIEWED_IN_SCRAPBOOK` flag automatically to treat the entry as "new".

### `GetLevelFor(thing)`
* **Description:** Returns the scrapbook level for a thing: `0` (unknown), `1` (seen only), or `2` (seen and inspected by at least one character).
* **Parameters:** `thing` (string) — resolved scrapbook entry identifier.
* **Returns:** number — `0`, `1`, or `2`.
* **Error states:** Returns `0` if `thing` is not a string.

### `UpdateStorageData(hashed, newdata)`
* **Description:** Updates the in-memory storage for a given hash with new data and marks the bucket as dirty. Initiates syncing via backend (online) or local (offline) depending on mode.
* **Parameters:**  
  - `hashed` (number) — precomputed hash of the entry identifier.  
  - `newdata` (number) — new 32-bit integer data value.
* **Returns:** Nothing.
* **Error states:** None; handles both online and offline modes internally.

### `UpdateMultiStorageData()`
* **Description:** Flushes all dirty bucket data to the backend in a single batch operation, using `TheInventory:SetStorageValueMulti`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `Save(force_save)`
* **Description:** Persists bucket data to local disk (`scrapbook_0` through `scrapbook_15`) using `TheSim:SetPersistentString`. Skips saving empty buckets unless `force_save` is `true`.
* **Parameters:** `force_save` (boolean, optional) — if `true`, saves even if bucket is not dirty.
* **Returns:** Nothing.

### `Load()`
* **Description:** Loads bucket data from disk into `self.storage`. Reads all 16 `scrapbook_i` persistent strings.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Logs a failure message if JSON decoding of a bucket fails.

### `ApplyOnlineProfileData()`
* **Description:** Merges online profile data (from `TheInventory:GetLocalScrapbookX`) into in-memory storage. Marks `synced = true` after success.
* **Parameters:** None.
* **Returns:** boolean — `true` if profile data was successfully applied.
* **Error states:** Only applies in online mode with inventory downloaded; skips if offline.

### `TryToTeachScrapbookData_Random(numofentries)`
* **Description:** Teaches a random set of unknown scrapbook entries (of known type categories) up to `numofentries`.
* **Parameters:** `numofentries` (number) — maximum number of entries to teach.
* **Returns:** boolean — `true` if at least one new entry was taught.
* **Error states:** None.

### `TryToTeachScrapbookData_Special(index)`
* **Description:** Teaches all entries defined for a special scrapbook page index (via `SPECIAL_SCRAPBOOK_PAGES_LOOKUP`).
* **Parameters:** `index` (number) — special page index.
* **Returns:** boolean — `true` if at least one new entry was taught.
* **Error states:** Returns `false` if `index` has no entry in `SPECIAL_SCRAPBOOK_PAGES_LOOKUP`.

### `TryToTeachScrapbookData_Note(entry)`
* **Description:** Marks a specific entry as inspected by `ThePlayer`, opens the scrapbook screen, and selects the entry.
* **Parameters:** `entry` (string) — scrapbook entry identifier.
* **Returns:** boolean — always `true`.
* **Error states:** None.

### `TryToTeachScrapbookData(is_server, inst)`
* **Description:** High-level method to teach scrapbook data for an entity instance, determining teaching strategy based on tags and ID.
* **Parameters:**  
  - `is_server` (boolean) — whether running on server.  
  - `inst` (Entity) — the entity being taught.
* **Returns:** boolean — whether any new data was learned.
* **Error states:** On client, sends `RPC.OnScrapbookDataTaught` to server.

### `_GetBucketForHash(hashed)`
* **Description:** Exposes internal bucket hashing logic for debugging.
* **Parameters:** `hashed` (number) — precomputed hash.
* **Returns:** number — bucket index (`0..15`).
* **Error states:** None.

### `DebugDeleteAllData()`
* **Description:** For debugging — erases all scrapbook data by setting all entries to `-1`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `DebugSeenEverything()`
* **Description:** For debugging — marks every entry in `SCRAPBOOK_DATA_SET` as seen.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `DebugUnlockEverything()`
* **Description:** For debugging — fully unlocks every entry by setting all flag and character bits (`0xFFFFFFFF`).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** None (this class does not register any event listeners).
- **Pushes:** `scrapbookupdated` — fired on `ThePlayer` via `UpdatePlayerScreens` when a thing is marked as seen or inspected.
- **RPC pushes:** Sends `RPC.OnScrapbookDataTaught` to server from `TryToTeachScrapbookData` when called on client.