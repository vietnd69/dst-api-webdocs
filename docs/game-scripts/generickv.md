---
id: generickv
title: Generickv
description: Manages a persistent key-value store synchronized with TheInventory system for client-server data sharing.
tags: [network, inventory, persistence]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: c8ec6a01
system_scope: network
---

# Generickv

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Generickv` is a lightweight component that provides a simple key-value storage mechanism with persistence and online profile synchronization. It stores data in a local JSON file via `TheSim:SetPersistentString` and attempts to merge local state with TheInventory's cloud-stored generic key-value data on load via `ApplyOnlineProfileData`. It is explicitly designed for internal use and **not** recommended for mod use due to safety concerns noted in the file comments.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("generickv")
inst.components.generickv:Load()
-- Later, after data is ready
inst.components.generickv:SetKV("mykey", "myvalue")
-- Sync with online profile if online
inst.components.generickv:ApplyOnlineProfileData()
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `kvs` | table | `{}` | Internal key-value store. Keys and values are strings. |
| `save_enabled` | boolean | `nil` | Controls whether writes are processed (enables saving to disk). |
| `dirty` | boolean | `nil` | Marks whether local state has unsaved changes. |
| `synced` | boolean | `nil` | Tracks whether the online profile has been synced with local data. |
| `loaded` | boolean | `nil` | Tracks whether initial data has been successfully loaded. |

## Main functions
### `GetKV(key)`
*   **Description:** Retrieves the value associated with a key in the local store.
*   **Parameters:** `key` (string) - the lookup key.
*   **Returns:** The value (string or `nil`) associated with `key`.

### `SetKV(key, value)`
*   **Description:** Sets a key-value pair and persists it if saving is enabled and not on a dedicated server.
*   **Parameters:**  
    `key` (string) - the key to set.  
    `value` (string) - the value to store (must be a string, enforced by `assert`).
*   **Returns:** `true` if the operation succeeded and saved; `false` if saving is disabled or the value matches the current one.
*   **Error states:** Raises an assertion error if `value` is not a string.

### `Save(force_save)`
*   **Description:** Serializes the current key-value store to a persistent string using JSON.
*   **Parameters:** `force_save` (boolean) - bypasses `save_enabled` and `dirty` checks.
*   **Returns:** Nothing.

### `Load()`
*   **Description:** Asynchronously loads persisted data from disk and populates the internal store.
*   **Parameters:** None.
*   **Returns:** Nothing.  
*   **Error states:** Logs a warning if JSON decoding fails.

### `ApplyOnlineProfileData()`
*   **Description:** Attempts to synchronize local KV data with TheInventory's online profile. Performs a bidirectional merge: online values into local store, and local values into online cache (non-dedicated only). Sets `synced = true` upon successful sync.
*   **Parameters:** None.
*   **Returns:** `true` if online profile was successfully applied; `false` otherwise.
*   **Error states:** May skip merging if offline mode is active or inventory is unavailable.

## Events & listeners
None identified