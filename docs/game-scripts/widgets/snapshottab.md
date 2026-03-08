---
id: snapshottab
title: Snapshottab
description: Displays and manages snapshots for a specific save slot in the server admin UI, allowing users to view, scroll through, and restore game states from stored snapshots.
tags: [ui, save, snapshot, admin]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 00aebb51
system_scope: ui
---

# Snapshottab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Snapshottab` is a UI widget responsible for rendering and handling snapshot management within the server admin interface. It presents a scrollable list of available snapshots for the currently selected save slot, displays metadata (day and season) for each snapshot by reading persisted world data, and provides interactive elements to trigger snapshot restoration. It integrates with the `ScrollableList` widget and handles snapshot listing and caching internally, while coordinating with `TheNet` and `TheSim` for network and storage operations.

## Usage example
```lua
local Snapshottab = require "widgets/snapshottab"
local tab = Snapshottab(function()
    -- Callback after a snapshot restore
    print("Snapshot list refreshed")
end)
tab:SetSaveSlot(1, nil, false)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `snapshot_page` | Widget | `nil` | Parent container widget for the snapshot display region. |
| `left_line` | Image | `nil` | Vertical line separator UI element. |
| `save_slot` | number | `-1` | Index of the active save slot (0-based). |
| `session_id` | string or `nil` | `nil` | Session identifier for the current save. |
| `online_mode` | boolean | `nil` | Whether the session is online-enabled. |
| `multi_level` | boolean | `nil` | Whether the session uses multi-level worldgen. |
| `use_cluster_path` | boolean | `nil` | Whether cluster-based pathing is used. |
| `cb` | function or `nil` | `nil` | Optional callback invoked after a snapshot is restored. |
| `snapshots` | table | `nil` | List of loaded snapshot metadata tables. |
| `slotsnaps` | table | `{}` | Cache mapping save slot indices to preloaded snapshots. |
| `snapshot_widgets` | table | `{}` | Preallocated list of snapshot tile widgets. |
| `snapshot_scroll_list` | ScrollableList | `nil` | Scrollable list widget managing snapshot display. |
| `default_focus` | Widget | `nil` | Default focus target (set to `snapshot_scroll_list`). |
| `focus_forward` | Widget | `nil` | Focus forwarding target (set to `snapshot_scroll_list`). |

## Main functions
### `RefreshSnapshots()`
*   **Description:** Updates the snapshot scroll list to reflect the current `snapshots` data, padding with empty entries if needed to maintain view consistency.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MakeSnapshotsMenu()`
*   **Description:** Constructs and initializes the snapshot tile widgets and the `ScrollableList`, including event handlers for focus, selection, and help text.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClickSnapshot(snapshot_num)`
*   **Description:** Prompts the user with a confirmation dialog to restore the snapshot at `snapshot_num`, then triggers truncation and refreshes the snapshot list upon confirmation.
*   **Parameters:** `snapshot_num` (number) — 1-based index into `self.snapshots`.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `snapshot_num` is out of bounds or the snapshot's `snapshot_id` is `nil` or `<= 0`.

### `ListSnapshots(force)`
*   **Description:** Loads snapshot metadata for the current `save_slot`. If not `force`-loaded and the slot’s snapshots are cached in `slotsnaps`, uses the cached list. Reads world file data to extract day and season for each snapshot.
*   **Parameters:** `force` (boolean) — If `true`, bypasses cache and reloads snapshots.
*   **Returns:** Nothing. Modifies `self.snapshots` and caches results in `self.slotsnaps`.

### `SetSaveSlot(save_slot, prev_slot, fromDelete)`
*   **Description:** Updates the component to manage snapshots for a new `save_slot`. Saves the current snapshot list to `slotsnaps` if applicable, fetches session and cluster settings, and reloads snapshots.
*   **Parameters:** 
  * `save_slot` (number) — New save slot index.
  * `prev_slot` (number or `nil`) — Previous save slot index.
  * `fromDelete` (boolean) — If `true`, skips cache save and reloads snapshots immediately.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `save_slot` is unchanged, `nil`, or identical to `prev_slot` (and `fromDelete` is `false`).

## Events & listeners
- **Pushes:** No events fired directly by this widget. However, `OnClickSnapshot` triggers `TheFrontEnd:PopScreen()` internally after user confirmation or cancellation.