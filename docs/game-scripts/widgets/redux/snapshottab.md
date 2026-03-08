---
id: snapshottab
title: Snapshottab
description: Displays and manages server snapshot restoration options in the UI, including listing snapshots and triggering truncation actions.
tags: [ui, snapshot, server]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: cef53edb
system_scope: ui
---

# Snapshottab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SnapshotTab` is a UI widget responsible for rendering a scrollable list of server snapshot entries and handling snapshot restoration workflows. It manages fetching snapshot metadata (including day and season data), displaying them in a list, and presenting a confirmation dialog before truncating snapshots to a selected save point. It integrates with `TheNet` and `TheSim` to access networked and persistent storage APIs, and uses `ShardSaveGameIndex` to resolve session metadata.

## Usage example
```lua
local SnapshotTab = require "widgets/redux/snapshottab"
local tab = SnapshotTab(function()
    print("Snapshot list updated")
end)
tab:SetDataForSlot(1)
-- snapshots are loaded and displayed automatically
```

## Dependencies & tags
**Components used:** None (this is a standalone UI widget, not an ECS component).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `save_slot` | number | `-1` | Slot index of the save game to list snapshots for. |
| `session_id` | string or nil | `nil` | Session identifier used for snapshot listing. |
| `online_mode` | boolean | `nil` | Whether the session is in online mode. |
| `multi_level` | boolean | `nil` | Whether the save uses multi-level world structure. |
| `use_legacy_session_path` | boolean | `nil` | Whether to use legacy pathing for session data. |
| `cb` | function or nil | `nil` | Callback invoked after snapshot truncation. |
| `snapshots` | table | `{}` | List of snapshot entries with metadata (`snapshot_id`, `world_day`, `world_season`, `empty`). |
| `slotsnaps` | table | `{}` | Reserved; unused in current implementation. |
| `snapshot_page` | Widget | `nil` | Parent container widget. |
| `snapshot_scroll_list` | ScrollingGrid | `nil` | Widget managing scrollable list of snapshot tiles. |
| `focus_forward` | Widget | `snapshot_scroll_list` | Widget to receive focus when this tab gains focus. |

## Main functions
### `RefreshSnapshots()`
* **Description:** Updates the snapshot list widget (`snapshot_scroll_list`) with current `snapshots` data. Ensures the list contains exactly `visible_rows` items by padding with empty placeholders if needed.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `MakeSnapshotsMenu()`
* **Description:** Constructs the scrollable list UI for snapshots using `TEMPLATES.ScrollingGrid`. Defines tile creation (`MakeSnapshotTile`) and update (`UpdateSnapshot`) functions, and sets up scrolling behavior.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `OnClickSnapshot(snapshot_num)`
* **Description:** Displays a confirmation dialog to restore a snapshot. On confirmation, calls `TheNet:TruncateSnapshots` or `TheNet:TruncateSnapshotsInClusterSlot` to truncate the snapshot chain up to the selected snapshot ID, then refreshes the snapshot list and invokes the callback.  
* **Parameters:**  
  * `snapshot_num` (number) — 1-based index into `self.snapshots`.  
* **Returns:** Nothing.  
* **Error states:** Returns early if `snapshot_num` is out of bounds or the snapshot ID is `nil` or `<= 0`.  

### `ListSnapshots()`
* **Description:** Fetches snapshot metadata from storage (`TheNet:ListSnapshotsInClusterSlot` or `TheNet:ListSnapshots`) and populates `self.snapshots`. For each snapshot, attempts to read the metadata file (`.meta`) to extract `world_day` and `world_season`; if metadata is unavailable, falls back to reading the world file directly. Removes the first entry (current save) from the list.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** Sets `self.snapshots` to `{}` if `save_slot` or `session_id` is `nil`.  

### `UpdateSaveSlot(save_slot)`
* **Description:** Updates the `save_slot` property to a new value. Does not reload snapshots.  
* **Parameters:**  
  * `save_slot` (number) — New slot index.  
* **Returns:** Nothing.  

### `SetDataForSlot(save_slot)`
* **Description:** Sets session and save parameters (`save_slot`, `session_id`, `online_mode`, `multi_level`, `use_legacy_session_path`) using `ShardSaveGameIndex`, then triggers `ListSnapshots()` and `RefreshSnapshots()`.  
* **Parameters:**  
  * `save_slot` (number) — Slot index to configure for snapshot listing.  
* **Returns:** Nothing.  

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.