---
id: ghost
title: Ghost
description: Manages the ghost entity's behavior, including its aura damage, combat targeting, sanity effects, and tethering to a gravestone.
tags: [entity, combat, aura, ghost]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d2f34319
system_scope: entity
---

# Ghost

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `ghost.lua` prefab defines two closely related entities: the base `ghost` and the `graveguard_ghost` (used for Abigail/Wendy's grave guard). It sets up the entity's visual, physical, and behavioral properties—including combat, aura damage, sanity aura, locomotion, and gravestone tethering. It registers core event handlers for death and attacks, and defines custom aura testing logic to determine which targets take damage. The component does not expose its own API; instead, it configures attached components like `aura`, `combat`, `health`, `locomotor`, `sanityaura`, `trader`, and `knownlocations`.

## Usage example
```lua
-- Standard ghost (active by default with full functionality)
local ghost = SpawnPrefab("ghost")
-- After spawn, combat and aura behaviors are active; no further setup required.

-- Grave guard ghost linked to a gravestone (e.g., Wendy's grave)
local gravestone = SpawnPrefab("grave")
local ghost = SpawnPrefab("graveguard_ghost")
if ghost.LinkToHome then
    ghost:LinkToHome(gravestone)
end
```

## Dependencies & tags
**Components used:**  
`locomotor`, `sanityaura`, `inspectable`, `health`, `combat`, `aura`, `trader`, `timer`, `knownlocations`  
**Tags added (base ghost):** `monster`, `hostile`, `ghost`, `flying`, `noauradamage`, `trader`  
**Tags added (graveguard):** `flying`, `ghost`, `graveghost`, `noauradamage`, `trader`

## Properties
No public properties are defined for this prefab itself—configuration occurs via component setters and tunings in the constructor.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:**
  - `death` — Calls `OnDeath()`, disabling the aura component (`inst.components.aura:Enable(false)`).
  - `attacked` — Calls `OnAttacked()`, setting the combat target to the attacker (unless attacker has tag `noauradamage`).
  - `ghostplaywithme` — (graveguard only) Extends the `"played_recently"` timer via `OnGhostPlayWithMe()`.
- **Pushes:** None directly.
