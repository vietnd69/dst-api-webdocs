---
id: SGwanderingtrader
title: Sgwanderingtrader
description: Controls the state machine behavior for the Wandering Trader, managing movement, trading, revelation, concealment, and teleportation states.
tags: [ai, locomotion, entity, animation, trading]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 63e65da8
system_scope: brain
---

# Sgwanderingtrader

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGwanderingtrader` stategraph defines the complete behavioral logic for the Wandering Trader entity in DST. It orchestrates transitions between movement (`idle`, `walk_start`, `walk`, `walk_stop`), trading (`trading_start`, `trading`, `trading_stop`, `dotrade`), talking, teleportation (`teleport`, `arrive`), hiding, and concealment states. The trader moves slowly (`0.35x` speed multiplier applied via `dappertrot`) and reveals itself only when trading or interacting. This stategraph depends heavily on the `locomotor` component for movement and the `talker` component for managing chatter.

## Usage example
This stategraph is not manually instantiated by mods — it is automatically assigned to the Wandering Trader prefab via the `StateGraph` return value. A modder would typically interact with it indirectly by triggering events such as `"dotrade"` or `"arrive"` on the Wandering Trader entity instance.

```lua
-- Example: Force the Wandering Trader into the "dotrade" state
-- (called from server-side logic, e.g., after a player initiates a trade)
trader.inst:PushEvent("dotrade", { no_stock = false })

-- Example: Trigger arrival (e.g., after teleporting in)
trader.inst:PushEvent("arrive")
```

## Dependencies & tags
**Components used:**  
- `locomotor` (`StopMoving`, `WalkForward`, `SetExternalSpeedMultiplier`, `RemoveExternalSpeedMultiplier`)  
- `talker` (`ShutUp`)  

**Tags added/removed:**  
- State tags: `idle`, `canrotate`, `moving`, `busy`, `revealed`, `invisible`  
- Instance tags: `NOCLICK` (added during teleportation/hiding; removed on exit)  

## Properties
No public properties are defined in this stategraph.

## Main functions
The stategraph is built declaratively using the `StateGraph` constructor — no explicit public functions are exposed. State behavior is implemented via callbacks (`onenter`, `onupdate`, `onexit`, `timeline`, `events`) within individual state definitions.

## Events & listeners
- **Listens to:**  
  - `animover` – triggered when an animation finishes; used for state transitions.  
  - `dotrade` – enters `dotrade` state to complete a trade interaction.  
  - `arrive` – enters `arrive` state to simulate teleporting into the world.  

- **Pushes:**  
  - None — this stategraph does not emit custom events.
