---
id: quagmire_eventstages
title: Quagmire Eventstages
description: Defines and creates stage-related prefabs for the Quagmire event by dynamically generating instances from a central event data registry.
tags: [event, quagmire, stage, prefab]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 78da6811
system_scope: world
---

# Quagmire Eventstages

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_eventstages.lua` is a prefab generator for the Quagmire event system. It dynamically constructs a set of stage-specific prefabs (e.g., `quagmirestage_cravings`, `quagmirestage_delay`, etc.) by querying an external registry (`event_server_data`) and executing associated initialization functions. This pattern centralizes stage configuration while decoupling prefab definitions from their behavior logic.

The prefabs are primarily used to represent triggers or markers for discrete phases or events in Quagmire matches (such as cravings, delays, or match-end conditions), and are likely spawned or activated by the event controller during gameplay.

## Usage example
This file is not intended for direct usage in mod code. It is executed during game initialization to populate the prefab registry with stage prefabs. A modder would typically interact with these via `GetPrefab("quagmirestage_delay")` or through the event system.

```lua
-- Example: Retrieve and spawn a Quagmire stage prefab (e.g., "delay")
local stage = PrefabLoc("quagmirestage_delay")()
stage.Transform:SetPosition(0, 0, 0)
TheSim:AddEntity(stage)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds the tag `quagmirestage` to each generated prefab instance (via the `event_server_data` `fn`, as inferred from naming and contextual behavior).

## Properties
No public properties defined in this file.

## Main functions
This file does not define any main functions. It is a procedural module that returns a list of prefabs.

## Events & listeners
- **Pushes:** Prefab creation triggers the `event_server_data("quagmire", "prefabs/quagmire_eventstages")[v.."fn"]()` function, which may internally push events (e.g., `cravings`, `delay`, etc.) — but this file itself does not register or fire events.