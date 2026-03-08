---
id: SGlureplant
title: Sglureplant
description: Manages state transitions and animations for the Lure Plant entity, handling phases such as emergence, hiding, bait display, hit responses, and death.
tags: [ai, combat, animation, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8a9a3882
system_scope: entity
---

# Sglureplant

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGlureplant` is a `StateGraph` that defines the full behavioral state machine for the Lure Plant entity (e.g., `lureplant` prefab). It governs animation selection, timing, sound triggers, and transitions between states such as `idleout`, `idlein`, `hidebait`, `showbait`, `hitout`, `hitin`, and death states. It integrates with the `health` component to avoid re-entering hit states when the entity is dead, and uses common electrocution handlers for lightning damage responses.

## Usage example
The `SGlureplant` stategraph is not added manually — it is automatically assigned to `lureplant` prefabs during entity creation. A modder would typically interact with it indirectly by triggering events on the instance:

```lua
local inst = TheWorld.Map:GetEntity("lureplant")
if inst and inst.sg then
    -- Force the lure plant to emerge and show bait
    inst.sg:GoToState("showbait")
    -- Or trigger a hit response programmatically
    inst:PushEvent("attacked", { attacker = some_actor })
end
```

## Dependencies & tags
**Components used:** `health`
**Tags added/removed:** States use tags including `"idle"`, `"busy"`, `"hiding"`, `"vine"`, `"noelectrocute"`, `"hit"`. The stategraph dynamically adds/removes `"hiding"`, `"vine"`, and `"noelectrocute"` tags based on state transitions and event handlers.

## Properties
No public properties — this is a `StateGraph` definition, not a component with instance state.

## Main functions
This stategraph is returned as a `StateGraph` instance from `StateGraph(...)`, and does not define public functions beyond the standard stategraph callbacks.

## Events & listeners
- **Listens to:**  
  - `death` → triggers `deathvine` or `death` state based on `"vine"` tag  
  - `attacked` → triggers hit response (`hitout`, `hitin`, or `hithibernate`) if not dead; handles electrocution via `CommonHandlers`  
  - `worked` → triggers hit response (same logic as `attacked`)  
- **Pushes:**  
  - `"hidebait"` → triggered from `hitout` state on animation completion  
  - `"freshspawn"` → fired on exit from `spawn` state  
