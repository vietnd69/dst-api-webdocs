---
id: creditsscreen
title: Creditsscreen
description: Manages the display and navigation of the in-game credits screen, including animated backgrounds, static text, and rolling names.
tags: [ui, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: e663d7fa
system_scope: ui
---

# Creditsscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CreditsScreen` is a UI screen responsible for rendering the game’s credits sequence. It supports multiple page types—including background animations, title cards, thanks messages, and rolling name lists—selected dynamically per platform (PC, PS4) or randomly for name slides. It extends `Screen`, manages its own layout using child widgets and text/image elements, and handles navigation (e.g., dismissal) and animation loop replay.

## Usage example
The screen is instantiated and displayed automatically by the front-end when credits are triggered. Typical usage in modding is limited, but a mod could show the screen like this:
```lua
TheFrontEnd:ShowScreen("creditsscreen")
```
Manual interaction or subclassing is not recommended, as the screen is fully self-contained and tied to game lifecycle (fade in/out, music, input handling).

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `credit_names` | table | `nil` | Local copy of `STRINGS.UI.CREDITS.NAMES`, shuffled and extended with platform-specific names before page generation. |
| `num_credit_pages` | number | `0` | Number of name-based pages computed from `credit_names`. |
| `num_leftover_names` | number | `0` | Number of names not fitting evenly into full pages (adds one extra name to early pages). |
| `pages` | table | `nil` | Sequence of page configurations to display; includes background/animation definitions and content text. |
| `credit_name_idx` | number | `1` | Index tracking the next name to pull from `credit_names`. |
| `page_order_idx` | number | `1` | Index into `pages` for the current page being shown. |
| `delay` | number | `nil` | Optional countdown before advancing to the next page (set per-page). |
| `bg`, `klei_img`, `center_root`, `bottom_root`, `back_button_root` | Widget/Image/UIAnim | `nil` | UI widgets created in the constructor. |

## Main functions
### `SetupRandomPages()`
*   **Description:** Prepares the sequence of pages to display by shuffling name-based pages and appending platform-specific pages (PC/PS4) and Klei pages. Initializes name indices.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShowNextPage()`
*   **Description:** Renders the current page from `self.pages`, updates animation, text, and name list contents, and schedules the next page (either immediately or after a delay if `page.delay` is set). Resets loop when all pages are exhausted.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeActive()`
*   **Description:** Starts the credits music (`gramaphone_ragtime`) when the screen becomes active.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Stops the credits music and resumes front-end music when the screen is no longer active.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input to dismiss the screen (e.g., ESC or B button). Calls `FadeBack` to exit.
*   **Parameters:**  
    `control` (number) — Input control ID.  
    `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
*   **Returns:** `true` if the control was consumed; `false` otherwise.

### `OnUpdate(dt)`
*   **Description:** Advances the credits sequence automatically when the animation finishes or the delay timer elapses.
*   **Parameters:**  
    `dt` (number) — Time in seconds since last frame.  
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns a localized string describing how to exit the screen (e.g., `B Back` on controller, `Esc Back` on keyboard).
*   **Parameters:** None.
*   **Returns:** `string` — Localized help text.

## Events & listeners
- **Listens to:** None (screen relies on lifecycle hooks like `OnBecomeActive`, `OnBecomeInactive`, and `OnUpdate`, plus input via `OnControl`).  
- **Pushes:** None identified.