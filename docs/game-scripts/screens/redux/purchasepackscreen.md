---
id: purchasepackscreen
title: PurchasePackScreen
description: Manages the in-game shop interface for purchasing character skins, item packs, and currency bundles with real or virtual currency.
tags: [ui, shop, inventory, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 35df9d03
system_scope: ui
---

# PurchasePackScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PurchasePackScreen` is the primary UI screen for the DST shop system, allowing players to browse, filter, and purchase character skins, item packs, and virtual currency bundles. It interacts with the `TheItems` network service to validate purchases and update player inventory. The screen supports filtering by ownership, content type (characters, items, bundles), and sale status, and handles both real and virtual IAP types conditionally. It builds a scrollable grid of `PurchaseWidget` elements and includes filter controls in a side panel.

## Usage example
```lua
-- typically pushed via TheFrontEnd::PushScreen from main menu or character selection
local screen = PurchasePackScreen(prev_screen, profile, {
    initial_item_key = "wolfgang", -- optional character filter
    initial_discount_key = "SALE", -- optional sale filter
})
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `TheItems`, `TheInventory`, `TheNet`, `TheSim`, `Stats`, `Profile`, `TheFrontEnd`, `TheInput`, `TheSim:QueryServer`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `view_mode` | number | `0` (`MODE_REGULAR`) | View mode: `0` = regular packs, `1` = currency packs. |
| `initial_item_key` | string | `nil` | Key passed to pre-select filter (e.g., character or item name). |
| `initial_discount_key` | string | `nil` | Initial discount filter selection (e.g., `"SALE"`). |
| `refresh_bolt_count` | boolean | `false` | Flag indicating whether to refresh virtual currency (bolts) after purchase. |
| `view_currency_for_def` | table | `nil` | IAP definition currently being evaluated for currency不足. |
| `panel_built` | boolean | `nil` | Set `true` after `_BuildPurchasePanel` completes. |

## Main functions
### `GetIAPDefs(no_filter_or_sort)`
* **Description:** Retrieves and optionally filters/sorts the list of available IAP definitions from `TheItems:GetIAPDefs()`. Applies ownership, type (character/item/new/bundle), and discount filters. Includes a soft fallback if missing IAP strings.
* **Parameters:** `no_filter_or_sort` (boolean) — if `true`, returns raw list without filtering or sorting.
* **Returns:** Table of valid `iap_def` tables, sorted by release group and display order.
* **Error states:** Logs missing IAP definitions if `MISC_ITEMS[iap.item_type]` is missing.

### `DoInit()`
* **Description:** Initializes the screen layout: background, title, scroll grid, filters, and currency display components. Makes a server time check via `TheSim:QueryServer` to validate shop epoch; warns if offset > 60 seconds.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshScreen()`
* **Description:** Updates the visible grid with filtered IAP definitions, toggles virtual currency visibility (`view_mode`), refreshes bolt count if flagged, and shows/hides the empty state text.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateFilterToItem(item_key)`
* **Description:** Updates the type filter spinner with a dynamic list including the specified `item_key` (e.g., newly unlocked item) and selects it.
* **Parameters:** `item_key` (string) — item or character key to filter by.
* **Returns:** Nothing.

### `Close()`
* **Description:** Cleans up music if started, fades back to previous screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles `CONTROL_CANCEL` to trigger `Close()`. Delegates other input to base `Screen`.
* **Parameters:** `control` (number), `down` (boolean).
* **Returns:** `true` if handled; otherwise delegates.

### `OnUpdate(dt)`
* **Description:** Periodically (every `1.0` seconds) calls `RefreshView` on the scroll grid to keep focus and visibility updated.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `Stats.PushMetricsEvent("PurchasePackScreen.entered", ...)` on screen entry.
- **Listens to:** No explicit `inst:ListenForEvent` registrations. Relies on UI lifecycle events (`OnBecomeActive`, `OnControl`, `OnUpdate`).