---
id: singingshellmanager
title: Singingshellmanager
description: Manages active singing shell entities and controls whether players should update their shell detection logic.
tags: [shell, world, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5a3419d0
system_scope: world
---

# Singingshellmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SingingShellManager` is a server-only component attached to the world (`TheWorld`) that tracks which singing shells are currently active. When at least one shell is active, it ensures all players start updating their shell detection via the `singingshelltrigger` component. When no shells remain active, the component automatically removes itself from the world.

This component serves as a centralized control point to reduce unnecessary computation: shell-checking logic only runs on clients when needed.

## Usage example
```lua
-- Automatically added to TheWorld by singing shell prefabs as needed
-- Example: When a shell wakes up
local shell = -- ... existing singing shell instance
TheWorld.components.singingshellmanager:RememberActiveShell(shell)

-- When a shell goes to sleep
TheWorld.components.singingshellmanager:ForgetActiveShell(shell)
```

## Dependencies & tags
**Components used:** `singingshelltrigger` (via `v.components.singingshelltrigger`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GGame` | `inst` | Reference to the world instance (server-only). |
| `active_shells` | table (set) | `{}` | Tracks currently active singing shell entities as keys. |
| `players_should_run_update` | boolean | `false` | Flag indicating whether player triggers should be active (not directly used internally). |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Stops shell-updating on all players and is automatically called when the component is removed from the world (i.e., when no shells remain active).
* **Parameters:** None.
* **Returns:** Nothing.

### `RememberActiveShell(shell)`
* **Description:** Registers a singing shell as active and triggers shell-updating for all players if this was the first shell.
* **Parameters:** `shell` (GEntity) — the singing shell entity that just woke up.
* **Returns:** Nothing.

### `ForgetActiveShell(shell)`
* **Description:** Unregisters a singing shell as active. If this was the last active shell, removes the component from the world.
* **Parameters:** `shell` (GEntity) — the singing shell entity that just went to sleep.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `singingshell_wake` — handled by `OnShellWake`, registers a shell as active.
  - `singingshell_sleep` — handled by `OnShellSleep`, deregisters a shell and conditionally removes the component.
  - `ms_playerjoined` — handled by `OnPlayerJoined`, restarts shell-updating for the new player.

- **Pushes:** None.
