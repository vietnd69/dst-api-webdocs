---
id: bugnet
title: Bugnet
description: A reusable tool-and-weapon item that captures insects and degrades after a fixed number of uses.
tags: [combat, inventory, tool, weapon, consumable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 32cc24a3
system_scope: inventory
---

# Bugnet

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bugnet` prefab is a deployable inventory item that functions as both a tool (for capturing insects via the `NET` action) and a weapon (dealing damage). It consumes durability on use and is automatically removed upon exhaustion. Two variants exist: the standard bugnet and the Thulecite bugnet (higher durability and damage). The prefab uses the `equippable`, `tool`, `weapon`, `finiteuses`, `inspectable`, and `inventoryitem` components. Animations and skins are dynamically handled during equip/unequip to ensure correct rendering in the player’s hands.

## Usage example
```lua
-- Create a bugnet instance
local bugnet = SpawnPrefab("bugnet")

-- Configure its properties programmatically
if bugnet ~= nil and bugnet.components ~= nil then
    bugnet.components.finiteuses:SetMaxUses(20)
    bugnet.components.finiteuses:SetUses(20)
    bugnet.components.weapon:SetDamage(10)
end
```

## Dependencies & tags
**Components used:** `equippable`, `tool`, `weapon`, `finiteuses`, `inspectable`, `inventoryitem`  
**Tags:** Adds `tool`, `weapon`, and conditionally `usesdepleted` via `finiteuses`.

## Properties
No public properties are defined or used in the constructor.

## Main functions
The prefab’s behavior is defined entirely by constructor functions (`fn` and `fn_thulecite`). No custom public methods are exposed beyond component APIs.

## Events & listeners
- **Listens to:** None directly. Component interactions trigger external events:
  - `inst:PushEvent("equipskinneditem", ...)` / `unequipskinneditem` — fired by the equip/unequip callbacks when a skin is present.
  - `inst:PushEvent("percentusedchange", ...)` — fired by `finiteuses` when remaining uses change (via `SetUses`).
  - `inst.Remove` — triggered when `finiteuses` reaches zero (`onfinished` handler).
- **Pushes:** Events related to skin overrides and depletion are managed via component callbacks (see above).