---
id: scrapbook_page
title: Scrapbook Page
description: Represents a collectible page used to teach unique scrapbook entries; manages reservation, teach state, and销毁 behavior when used or fully taught.
tags: [crafting, inventory, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4c1e40e7
system_scope: inventory
---

# Scrapbook Page

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`scrapbook_page` is a prefab factory for items that store teachable scrapbook data. It supports both generic pages and special (unique) pages identified by ID. When taught, the page either destroys itself (if used) or is retained for full books. It integrates with the scrapbook system via the `scrapbookable` component, coordinates reservation logic with the `fuel`, `inventoryitem`, `stackable`, and `erasablepaper` components, and handles client-server synchronization for teaching.

## Usage example
```lua
-- Create a generic scrapbook page
local page = Prefab("scrapbook_page", nil, nil)

-- Create a special scrapbook page with ID 5
local special_page = Prefab("scrapbook_page_special", nil, nil)
special_page:SetId(5)

-- When a player uses it:
if special_page.components.scrapbookable ~= nil then
    special_page.components.scrapbookable:Teach(player)
end
```

## Dependencies & tags
**Components used:** `fuel`, `inventoryitem`, `scrapbookable`, `stackable`, `erasablepaper`, `inspectable`, `tradable`  
**Tags:** Adds `cattoy`, `scrapbook_page`, `scrapbook_data`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"SCRAPBOOKPAGE"` | Static info string indicating special page capabilities. |
| `_id` (special only) | net_smallbyte | `0` | Networked ID identifying the scrapbook entry. |
| `reserved_userid` | string or nil | `nil` | User ID of the player currently reserving the page for teaching. |
| `cancelreservationtask` | Task or nil | `nil` | Task handling automatic reservation cancellation on timeout. |

## Main functions
### `SetId(id)`
* **Description:** Sets the scrapbook page's internal ID for special pages, validating against `SPECIAL_SCRAPBOOK_PAGES_LOOKUP`.
* **Parameters:** `id` (number) — numeric index of the scrapbook entry.
* **Returns:** Nothing.
* **Error states:** Only sets if `SPECIAL_SCRAPBOOK_PAGES_LOOKUP[id]` exists.

### `OnScrapbookDataTaught(doer, diduse)`
* **Description:** Handles post-teach behavior: clears reservation, destroys the page if used (`diduse`), or notifies the player if their scrapbook is full.
* **Parameters:**  
  - `doer` (Entity) — the player who taught the page.  
  - `diduse` (boolean) — whether the teach succeeded and consumed the data.
* **Returns:** Nothing.

## Events & listeners
* **Listens to:** `scrapbook_data_taught` — indirectly via `OnScrapbookDataTaught`, invoked when `TheScrapbookPartitions:TryToTeachScrapbookData` completes.
* **Pushes:** None defined in this file (relay handled by event callbacks in other systems).