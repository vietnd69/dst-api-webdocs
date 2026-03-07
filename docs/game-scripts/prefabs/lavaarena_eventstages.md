---
id: lavaarena_eventstages
title: Lavaarena Eventstages
description: Generates prefabs for lava arena event stage triggers used in the Don't Starve Together Lava Arena event.
tags: [event, lavaarena, stage]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2c4366a4
system_scope: world
---

# Lavaarena Eventstages

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This script dynamically creates prefabs for the Lava Arena event's stage trigger entities. Each prefab corresponds to a specific stage action (e.g., `"attack"`, `"delay"`, `"dialog"`), and when instantiated, invokes a server-side data function registered under `lavaarena_eventstages` via `event_server_data`. It is part of the event-driven progression system that orchestrates the Lava Arena minigame.

## Usage example
The prefabs are typically instantiated by the `lavaarena` event manager when scheduling event phases:
```lua
local stage_prefab = Prefab("lavaarenastage_attack")
local stage = spawn(stage_prefab)
stage:DoTaskInSeconds(0.1, function() stage:PushEvent("lavaarenastage_triggered") end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `event_server_data("lavaarena", "prefabs/lavaarena_eventstages")[v.."fn"]()`
*   **Description:** Internal server-side callback mechanism. Each stage prefab calls this function upon instantiation to retrieve and execute the appropriate stage logic (e.g., attack sequence, delay timer, or dialog display).  
*   **Parameters:**  
    *   `"lavaarena"` (string) — Event namespace identifier.  
    *   `"prefabs/lavaarena_eventstages"` (string) — Path to the data registry.  
    *   `v.."fn"` (string) — Key specifying the stage function (e.g., `"attackfn"`, `"delayfn"`).  
*   **Returns:** The result of executing the registered stage function — typically `nil` or an action-completion callback.  
*   **Error states:** Returns `nil` if no function is registered for the given key.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
