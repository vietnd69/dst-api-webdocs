---
id: upsell
title: Upsell
description: Manages the in-game upsell screen flow and purchase state checks for the demo version of DST.
tags: [ui, purchasing, demo]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 5e08df5b
system_scope: ui
---

# Upsell

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `upsell.lua` script handles the lifecycle of the demo version upsell screen. It controls when and how the upsell UI is displayed, monitors for purchase completion (or timeout), and triggers game exit if the demo time limit is reached without a purchase. This module operates globally via singleton functions and state — it is not an Entity Component System component.

## Usage example
```lua
-- Example: Trigger upsell screen if demo time exceeded
if GetTimePlaying() > TUNING.DEMO_TIME and not IsGamePurchased() then
    ShowUpsellScreen(true)
end

-- Example: Handle closure of upsell screen
HandleUpsellClose()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `upsell_status` | string or `nil` | `nil` | Global state: `"SHOWING"`, `"WAITING"`, or `"QUITTING"` while upsell UI is active, otherwise `nil`. |
| `waitingforpurchasetimeout` | number | `0` | Accumulated time (in seconds) spent waiting for a purchase confirmation. |
| `DEMO_QUITTING` | boolean | `false` | Global flag indicating whether the player is quitting due to demo expiration or failed purchase. |

## Main functions
### `IsGamePurchased()`
*   **Description:** Checks whether the full game has been purchased by verifying presence of `"GAME"` in the global `Purchases` table.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `"GAME"` is found in `Purchases`, otherwise `false`.

### `UpdateGamePurchasedState(complete_callback)`
*   **Description:** Invokes the provided callback with the current purchase status.
*   **Parameters:** `complete_callback` (function or `nil`) — receives one boolean argument (`true` if purchased).
*   **Returns:** Nothing.

### `UpsellShowing()`
*   **Description:** Returns whether the upsell screen is currently displayed.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `upsell_status == "SHOWING"`.

### `WaitingForPurchaseState()`
*   **Description:** Returns whether the upsell screen is in the post-close waiting state, awaiting purchase confirmation.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `upsell_status == "WAITING"`.

### `ShowUpsellScreen(shouldquit)`
*   **Description:** Displays the upsell UI to the user and pauses the game.
*   **Parameters:** `shouldquit` (boolean) — if `true`, sets `upsell` JSON field `timedout` to `true`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `upsell_status` is already set.

### `CheckForUpsellTimeout(dt)`
*   **Description:** Tracks elapsed time while waiting for purchase confirmation; if over 30 seconds, triggers quit.
*   **Parameters:** `dt` (number) — delta time since last frame (seconds).
*   **Returns:** Nothing.
*   **Error states:** Triggers quit if timeout threshold exceeded while in `"WAITING"` state.

### `CheckDemoTimeout()`
*   **Description:** Checks if the demo time limit (`TUNING.DEMO_TIME`) has been exceeded and shows the upsell screen if not yet purchased.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if upsell is already showing or game is purchased.

### `HandleUpsellClose()`
*   **Description:** Handles post-close logic after user interacts with the upsell UI.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** May trigger quit if demo time expired and no purchase occurred; refreshes active UI screen upon completion.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `"quit"` — sent to `ThePlayer` when demo expires or purchase fails after upsell timeout/closure.