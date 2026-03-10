---
id: dlcsupport
title: Dlcsupport
description: Manages DLC registration, activation, and loading of DLC-specific prefabs and setup functions at runtime.
tags: [detection, loading, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 83241cc8
system_scope: network
---

# Dlcsupport

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`dlcsupport` is a globally scoped utility module—not an Entity Component System component—that handles dynamic DLC discovery, registration, and initialization. It exposes functions to enable/disable DLCs, load their prefab lists, and invoke custom setup logic. It interacts with the engine via `TheSim:SetDLCEnabled`, `TheSim:IsDLCEnabled`, and `TheSim:IsDLCInstalled` to reflect real-time DLC availability on the client/server.

## Usage example
```lua
-- Register and enable all known DLCs
RegisterAllDLC()
EnableAllDLC()

-- Initialize all registered DLCs (calls Setup() if present)
InitAllDLC()

-- Check if a specific DLC is enabled
if IsDLCEnabled(REIGN_OF_GIANTS) then
    -- DLC-specific logic
end
```

## Dependencies & tags
**Components used:** None. This module operates at the global/script scope and interacts with the engine via `TheSim` API.
**Tags:** None.

## Properties
No public properties.

## Main functions
### `RegisterAllDLC()`
*   **Description:** Scans DLC script files `DLC0001` through `DLC0010`, loads and stores their return tables in `RegisteredDLC`, and reloads the combined prefab list.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Fails with an assertion error if a DLC file fails to load or is malformed.

### `RegisterDLC(index)`
*   **Description:** Clears all registered DLCs, then registers and loads only the DLC at the given index. Calls `ReloadPrefabList()` afterward.
*   **Parameters:** `index` (number) – DLC index (e.g., `1` for Reign of Giants).
*   **Returns:** Nothing.
*   **Error states:** Same as `RegisterAllDLC()` for the specified index.

### `InitAllDLC()`
*   **Description:** Invokes the optional `Setup()` function for each registered DLC. Typically called after `RegisterAllDLC()` to apply DLC-specific modifications (e.g., add prefabs, hooks, or behaviors).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `InitDLC(index)`
*   **Description:** Invokes the `Setup()` function for the DLC at `index`, if present and registered.
*   **Parameters:** `index` (number) – DLC index.
*   **Returns:** Nothing.

### `EnableDLC(index)`
*   **Description:** Enables the DLC at `index` via the engine API (`TheSim:SetDLCEnabled(true)`), making its content available to the game.
*   **Parameters:** `index` (number) – DLC index.
*   **Returns:** Nothing.

### `DisableDLC(index)`
*   **Description:** Disables the DLC at `index` via the engine API (`TheSim:SetDLCEnabled(false)`), hiding its content.
*   **Parameters:** `index` (number) – DLC index.
*   **Returns:** Nothing.

### `IsDLCEnabled(index)`
*   **Description:** Queries whether the DLC at `index` is currently enabled on this client/server instance.
*   **Parameters:** `index` (number) – DLC index.
*   **Returns:** `true` if enabled, `false` otherwise.

### `IsDLCInstalled(index)`
*   **Description:** Queries whether the DLC at `index` is installed on the host system (not necessarily enabled).
*   **Parameters:** `index` (number) – DLC index.
*   **Returns:** `true` if installed, `false` otherwise.

### `EnableAllDLC()`
*   **Description:** Enables every DLC listed in the global `DLC_LIST` array (e.g., `REIGN_OF_GIANTS`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableAllDLC()`
*   **Description:** Disables every DLC listed in `DLC_LIST`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EnableAllMenuDLC()`
*   **Description:** First disables all DLCs, then enables those listed in `MENU_DLC_LIST`. Typically used to ensure only menu-relevant DLCs are active in the main menu context.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetActiveCharacterList()`
*   **Description:** Returns a combined list of base (`DST_CHARACTERLIST`) and mod-provided characters (`MODCHARACTERLIST`).
*   **Parameters:** None.
*   **Returns:** `table` – Array of character prefab names.

### `GetSelectableCharacterList()`
*   **Description:** Returns the active character list excluding those in `SEAMLESSSWAP_CHARACTERLIST`, which are reserved for internal use (e.g., seamless swaps during gameplay).
*   **Parameters:** None.
*   **Returns:** `table` – Array of character prefab names.

### `GetFEVisibleCharacterList()`
*   **Description:** Returns a filtered list of characters suitable for display in the front-end, applying special rules (e.g., `wonkey` only appears if previously played).
*   **Parameters:** None.
*   **Returns:** `table` – Array of character prefab names.

## Events & listeners
None. This module does not register or emit events; it is called proactively by other systems.