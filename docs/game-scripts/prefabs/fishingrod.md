---
id: fishingrod
title: Fishingrod
description: A multi-use tool item that allows characters to fish, deals damage in combat, and handles visual and functional behavior when equipped or used.
tags: [fishing, combat, inventory, equipment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2acd8b1a
system_scope: inventory
---

# Fishingrod

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fishingrod` is a prefab that defines the in-game fishing rod item. It is built as a composite entity with multiple components: `fishingrod`, `weapon`, `finiteuses`, `equippable`, `inspectable`, and `inventoryitem`. The entity supports both standard gameplay (fishing) and combat (dealing damage), and includes logic for skinning, animation overrides, and wear-out via finite uses. It is optimized by pre-tagging with `"fishingrod"` and `"weapon"` (except in Quagmire mode), and registers handlers for the `"fishingcollect"` event to decrement uses on successful catches.

## Usage example
```lua
local inst = SpawnPrefab("fishingrod")
-- After the server initializes components:
inst.components.fishingrod:SetWaitTimes(5, 30) -- min 5s, max 30s
inst.components.fishingrod:SetStrainTimes(1, 4)
inst.components.weapon:SetDamage(10)
inst.components.finiteuses:SetUses(50)
```

## Dependencies & tags
**Components used:** `fishingrod`, `weapon`, `finiteuses`, `equippable`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags added:** `"fishingrod"`, `"allow_action_on_impassable"`, `"weapon"` (unless game mode is `"quagmire"`)  
**Tags checked:** None beyond tags added.  
**Tags removed:** None.

## Properties
No public properties are directly exposed by the `fishingrod` prefab function itself. The underlying `fishingrod` component (not defined here) manages wait and strain timing, while `weapon` and `finiteuses` provide their own properties via methods.

## Main functions
The `fishingrod` prefab does not define standalone methods beyond internal helpers. It configures components via external APIs. Key configuration calls performed internally:

### `SetWaitTimes(min, max)` (on `fishingrod` component)
* **Description:** Configures the min and max wait times (in seconds) before a fish bite occurs after casting. Called during server-side init.
* **Parameters:** `min` (number), `max` (number) — lower and upper bounds of the wait time range.
* **Returns:** Nothing (method called on the `fishingrod` component).

### `SetStrainTimes(min, max)` (on `fishingrod` component)
* **Description:** Configures the min and max strain duration (in seconds) during the fishing reel phase. Called during server-side init.
* **Parameters:** `min` (number), `max` (number) — lower and upper bounds of strain time.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `fishingcollect` — fired when a fish is successfully collected after a catch. Triggers the `onfished` callback, which decrements uses via `finiteuses:Use(1)`.
- **Pushes:** None directly from the prefab function. Animation and skin events (`equipskinneditem`, `unequipskinneditem`) are pushed via the owner's event system in `onequip`/`onunequip` handlers, but not by this entity itself as the primary publisher.