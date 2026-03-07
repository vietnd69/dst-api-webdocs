---
id: penguinherd
title: Penguinherd
description: A non-networked entity component that manages a herd of penguins, coordinating their spawning via mood cycles and the periodic spawner system.
tags: [herd, mood, spawner, ai]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cbf016c5
system_scope: world
---

# Penguinherd

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`penguinherd` is a prefab template used to instantiate a herd entity that controls a group of penguins. It does not implement a custom component but configures a generic entity with the `herd` and `mood` components to model seasonal breeding behavior. The herd spawns egg prefabs over time using `periodicspawner`, activates only during the penguin mating season (controlled by `mood`), and removes itself when the herd becomes empty.

The prefab is responsible for:
- Setting up herd size, search range, and update range.
- Defining mood transition handlers that start/stop spawners and notify member entities.
- Installing a per-member join callback to synchronize new members with current mood state.

## Usage example
This prefab is not typically instantiated manually in mod code. It is registered as `penguinherd` and created internally by the world generation system during map setup.

To extend or modify its behavior, override or augment its components in a post-init hook:
```lua
local TheWorld = TheWorld
if TheWorld and TheWorld.prefabs and TheWorld.prefabs.penguinherd then
    -- Example: Adjust gathering range for all future penguin herds
    -- Note: Modifiers must be applied before or during world generation,
    -- as this prefab is used to create herds in static layouts.
end
```

## Dependencies & tags
**Components used:** `herd`, `mood`, `periodicspawner`  
**Tags added to entity:** `"herd"`, `"NOBLOCK"`, `"NOCLICK"`  

## Properties
No public properties are defined or used directly on the `penguinherd` prefab instance. All configuration occurs via component methods during construction.

## Main functions
The `penguinherd` prefab does not define its own methods. Its behavior is entirely implemented via callbacks passed to other components (`herd`, `mood`, `periodicspawner`):

### `AddMember(inst, member)`
*   **Description:** Callback invoked by the `herd` component when a new penguin (member) joins the herd. Sends the appropriate `"entermood"` or `"leavemood"` event to the new member based on the current mood state.
*   **Parameters:**  
    `inst` (Entity) — the herd entity.  
    `member` (Entity) — the newly added penguin entity.
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing `mood` component via nil check; no operation if absent.

### `InMood(inst)`
*   **Description:** Mood-entry callback. Starts the `periodicspawner` to resume egg spawning and broadcasts `"entermood"` to all current herd members.
*   **Parameters:** `inst` (Entity) — the herd entity.
*   **Returns:** Nothing.
*   **Error states:** Gracefully skips if `periodicspawner` or `herd` components are missing.

### `LeaveMood(inst)`
*   **Description:** Mood-exit callback. Stops the `periodicspawner` and broadcasts `"leavemood"` to all current herd members.
*   **Parameters:** `inst` (Entity) — the herd entity.
*   **Returns:** Nothing.
*   **Error states:** Gracefully skips if `periodicspawner` or `herd` components are missing.

## Events & listeners
This prefab does not directly register or fire custom events. It *triggers* events on member entities via `member:PushEvent(...)`, specifically:
- `"entermood"` — sent to new members on join and to all members when the herd enters mating season.
- `"leavemood"` — sent to new members on join and to all members when the herd leaves mating season.

It does *not* listen for events itself.
