---
id: singingshelltrigger
title: Singingshelltrigger
description: Triggers activation callbacks for nearby singing shell entities when the owner is alive, based on a configurable range.
tags: [audio, entity, trigger]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5a5b5d46
system_scope: entity
---

# Singingshelltrigger

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Singingshelltrigger` is a passive component that monitors for nearby entities tagged `singingshell` within a defined range and invokes their activation function when they come into contact. It automatically starts updating only if a `singingshellmanager` component exists in the world. The component is typically attached to entities that act as activation sources for singing shells — for example, a musical instrument or a controller entity. It manages update lifecycle and overlapping state to ensure each shell is activated once per entry, and respects entity death/resurrection events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("singingshelltrigger")
inst.components.singingshelltrigger:SetTriggerRange(6)
-- Note: The component only begins updating if TheWorld.components.singingshellmanager exists
```

## Dependencies & tags
**Components used:** `singingshellmanager` (checked via `TheWorld.components.singingshellmanager`)
**Tags:** Adds `singingshelltrigger`; listens for `death` and `respawnfromghost` events.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trigger_range` | number | `4` | Maximum distance (in game units) within which to detect singing shell entities. |
| `findentitiesfn` | function | `findentities` | Function used to locate nearby entities; accepts `(inst, range)` and returns a list of entities. |
| `updating` | boolean | `false` | Whether the component is currently in the update loop. |
| `overlapping` | table | `{}` | Tracks overlapping singing shells: keys are entity instances, values are booleans (`true` = just entered or in range; `false` = still in range but not newly entered). |

## Main functions
### `StartUpdating()`
* **Description:** Begins calling `OnUpdate` each tick for this component. Has no effect if already updating.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopUpdating()`
* **Description:** Halts the update loop for this component. Has no effect if not currently updating.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate()`
* **Description:** Core update logic that scans for nearby singing shells, invokes their activation function on entry, and maintains state to prevent repeated activation per overlap cycle. Also clears stale entries.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:**
  - `death` – calls `StopUpdating()` when the owner dies.
  - `respawnfromghost` – calls `StartUpdating()` when the owner respawns from ghost form.
- **Pushes:** None.
