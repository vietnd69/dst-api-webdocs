---
id: wagboss_tracker
title: Wagboss Tracker
description: Tracks whether the Wagboss boss has been defeated and broadcasts status updates to the world.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 65686767
---

# Wagboss Tracker

## Overview
This component monitors the defeat status of the Wagboss boss entity and ensures that world-wide updates are broadcast when its state changes. It persists its state across saves and loads, synchronizing the Wagboss defeat condition globally.

## Dependencies & Tags
- Depends on the entity having `OnSave` and `OnLoad` called by the entity's save/load system.
- Registers a listener for the `"wagboss_defeated"` event on its host entity.
- Pushes the `"master_wagbossinfoupdate"` event to `TheWorld` upon defeat or load.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `wagboss_defeated` | `boolean` | `false` | Tracks whether the Wagboss has been defeated. |

## Main Functions

### `IsWagbossDefeated()`
* **Description:** Returns the current defeat status of the Wagboss.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the component’s state for saving. Returns a table containing `wagboss_defeated`.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the component’s state from saved data. If data is present, it updates `wagboss_defeated` and broadcasts the `"master_wagbossinfoupdate"` event to reflect the restored state.
* **Parameters:**
  * `data` (`table?`): Optional table containing saved state, specifically a `wagboss_defeated` key.

## Events & Listeners
- **Listens for:** `"wagboss_defeated"` — triggers `OnWagbossDefeated` to mark the boss as defeated and notify the world.
- **Triggers:** `"master_wagbossinfoupdate"` — pushed to `TheWorld` when the Wagboss is defeated or when state is loaded, carrying `{isdefeated = boolean}`.