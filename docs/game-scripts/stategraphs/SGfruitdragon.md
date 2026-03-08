---
id: SGfruitdragon
title: Sgfruitdragon
description: State graph for the Fruit Dragon entity that manages its idle, ripening, sleeping, and combat-related states including fire-based attacks and challenge duels.
tags: [stategraph, combat, boss, fruit, fire]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 298d37ad
system_scope: entity
---

# Sgfruitdragon

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfruitdragon` defines the full state machine for the Fruit Dragon, a boss entity in DST. It orchestrates movement, idle behaviors, sleep/ripening transitions, and combat—including standard melee attacks and fire-based attacks. The state graph relies heavily on the `combat`, `health`, `locomotor`, `timer`, `burnable`, and `fueled` components. It also integrates reusable states from `commonstates.lua` (e.g., hit, death, walk, run, sleep, frozen, electrocute, sink, void fall).

## Usage example
The state graph is automatically instantiated and assigned by the game engine when the `fruit_dragon` prefab is created. It should not be manually constructed by modders.

```lua
-- Example: The Fruit Dragon entity is created via its prefab file, which includes this SG.
-- The state graph is referenced as the `stategraph` property in the prefab definition.
-- No direct usage is needed in mod code.
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `timer`, `burnable`, `fueled`, `light`, `dynamicshadow`, `soundemitter`, `animstate`, `transform`, `physics`
**Tags checked/used:** `fruitdragon`, `INLIMBO`, `_health`, `canlight`, `busy`, `idle`, `canrotate`, `caninterrupt`, `waking`, `sleeping`, `hit`, `frozen`, `electrocute`, `attacker`
**Tags added by common states (from `commonstates.lua`):** `waking`, `sleeping`, `busy`, `idle`, `attack`, `hit`, `canrotate`, `caninterrupt`, `canfly`, `canwander`, `moving`, `running`, `dead`, `frozen`, `electrocute`, `onfire`

## Properties
No public properties are defined in this file. State graph behavior is controlled via state definitions, events, and external component state.

## Main functions
This file returns a single `StateGraph` object via `StateGraph()`. No standalone public functions are exposed. Internal callbacks (`onenter`, `onexit`, `timeline` handlers) implement state-specific logic.

## Events & listeners
- **Listens to:**
  - `doattack` → triggers `"challenge_attack_pre"`, `"attack"`, or `"attack_fire"` states based on target tag, ripeness, and fire cooldown.
  - `attacked` → triggers `"hit"` state, with electrocution and interrupt checks.
  - `wake_up_to_challenge` → triggers `"hit"` if not electrocuted.
  - `lostfruitdragonchallenge` → triggers `"challenge_lose"` if not electrocuted.
  - Common handlers: `OnSleep()`, `OnFreeze()`, `OnElectrocute()`, `OnDeath()`, `OnLocomote()`, `OnSink()`, `OnFallInVoid()`.

- **Pushes:** None directly — uses `inst:PushEvent()` only via common state handlers imported from `commonstates.lua`.