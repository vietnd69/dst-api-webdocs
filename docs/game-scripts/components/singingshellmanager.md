---
id: singingshellmanager
title: Singingshellmanager
description: Manages the activation state of singing shells in the world by tracking active shells and controlling whether players should check for them.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 5a3419d0
---

# Singingshellmanager

## Overview
This component is dynamically attached to the world entity to coordinate the global state of singing shells: it tracks which shells are currently active, and ensures player-side `singingshelltrigger` components begin or cease scanning for shells accordingly. It automatically removes itself from the world when no singing shells remain active.

## Dependencies & Tags
**Component Dependencies:**
- Requires that the world entity has the `singingshellmanager` component removed and re-added as needed.
- Assumes `AllPlayers` contains valid player entities.
- Relies on players having a `singingshelltrigger` component with methods `StartUpdating()` and `StopUpdating()`.

**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *n/a* | Reference to the world entity the component is attached to. |
| `active_shells` | `table` | `{}` | Dictionary mapping active shell entities to `true`; used to track currently awakened singing shells. |
| `players_should_run_update` | `boolean` | `false` | *Not used* — present in source but never set or checked. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Called when the component is removed from its entity. Stops updating all players' shell triggers.
* **Parameters:** None.

### `RememberActiveShell(shell)`
* **Description:** Registers a shell as active (awake), updates `active_shells`, and ensures players continue scanning. If this was the first shell, players will already be scanning due to initialization.
* **Parameters:**
  - `shell` (*Entity*): The singing shell entity being awakened.

### `ForgetActiveShell(shell)`
* **Description:** Removes a shell from the active set. If no shells remain active after removal, the component removes itself from the world entity.
* **Parameters:**
  - `shell` (*Entity*): The singing shell entity being put to sleep.

## Events & Listeners
- Listens for `"singingshell_wake"` → triggers `OnShellWake`
- Listens for `"singingshell_sleep"` → triggers `OnShellSleep`
- Listens for `"ms_playerjoined"` → triggers `OnPlayerJoined`