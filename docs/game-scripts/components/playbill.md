---
id: playbill
title: Playbill
description: Manages the current act of a play script for performance-related gameplay elements in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e62d69fd
---

# Playbill

## Overview
This component tracks and persists the current act being performed in a play script. It is used to manage state related to theatrical performances, storing and restoring the active act across game sessions via save/load hooks.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scripts` | `table` | `{}` | Dictionary of available play scripts. Initialized in constructor. |
| `costumes` | `table` | `{}` | Dictionary of costume data. Initialized in constructor. |
| `starting_act` | `any` | `nil` | The first act in the play sequence. Stored but not modified or read in this implementation. |
| `current_act` | `any` | `nil` | The currently active act in the performance. Updated via `SetCurrentAct` and persisted via save/load. |
| `book_build` | `any` | `nil` | Placeholder for build/book state related to the play. Present in constructor but unused in this code. |

## Main Functions

### `SetCurrentAct(act)`
* **Description:** Updates the `current_act` property to the specified act value. Used to advance or set the performance state.
* **Parameters:**  
  - `act`: The act identifier (type not strictly defined; could be string, number, or table) representing the current act to set.

### `OnSave()`
* **Description:** Serializes the component's persistent state into a table for saving to disk. Only includes the `current_act` field.
* **Parameters:** None.  
* **Returns:** `table` — A dictionary containing `{ current_act = self.current_act }`.

### `OnLoad(data)`
* **Description:** Restores the component's state from saved data. Updates `current_act` if present in the input data.
* **Parameters:**  
  - `data`: `table` — The saved data table, expected to contain a `current_act` key if available.

## Events & Listeners
None.