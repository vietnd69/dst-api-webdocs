---
id: spider_whistle
title: Spider Whistle
description: A consumable item that summons spiders from dens and wakes up sleeping spiders within range, while granting temporary buffs to nearby spider followers.
tags: [combat, consumable, spider, utility]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4f4ed399
system_scope: inventory
---

# Spider Whistle

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spider_whistle` is a consumable inventory item that triggers spider-related effects when used. It interacts with the `followerherder` component to herd nearby spiders by waking up sleeping ones, spawning spiders from active dens, and applying debuffs to spider followers of the user. It is restricted for use only by characters with the `spiderwhisperer` tag (e.g., Webber). The whistle has a limited number of uses and is destroyed upon exhaustion.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")
inst:AddComponent("inventory")
inst.components.inventory:GiveItem("spider_whistle", nil)

-- Use the whistle to trigger herding effects
if inst.components.inventory:HasItem("spider_whistle") then
    local whistle = inst.components.inventory:FindItem(function(item) return item:GetName() == "spider whistle" end)
    if whistle and whistle.components.followerherder then
        whistle.components.followerherder:TryHerd(inst)
    end
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `finiteuses`, `followerherder`, `sleeper`, `childspawner`, `leader`, `health`  
**Tags:** Adds `spider_whistle`; checks `spiderwhisperer`, `spider`, `spiderqueen`, `creaturecorpse`, `NOCLICK`, `spidercocoon`, `spiderden`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"SPIDERWHISTLE"` | Special info key used in the scrapbook UI. |

## Main functions
### `CanHerd(whistle, leader)`
*   **Description:** Determines whether the given entity (`leader`) is allowed to use the whistle. Restricts usage to characters with the `spiderwhisperer` tag.
*   **Parameters:** `whistle` (Entity) — the whistle instance; `leader` (Entity) — the entity attempting to herd spiders.
*   **Returns:** `{ boolean, string? }` — returns `{ true }` if eligible, otherwise `{ false, "WEBBERONLY" }`.

### `OnHerd(whistle, leader)`
*   **Description:** Executes the primary herding logic: summons spiders from unoccupied dens, wakes sleeping spiders in range, and applies buffs to spider followers of the leader.
*   **Parameters:** `whistle` (Entity) — the whistle instance; `leader` (Entity) — the entity using the whistle.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onfinished` (via `finiteuses:SetOnFinished`) — removes the whistle from the world when its uses are depleted.
- **Pushes:** None directly; relies on `followerherder` and external components (`sleeper:WakeUp`, `childspawner:SummonChildren`) which internally push relevant events (e.g., `onwakeup`).