---
id: loadingtipsdata
title: Loading Tips Data
description: Manages loading screen tips with weighted selection and persistence system
sidebar_position: 3
slug: core-systems-loadingtipsdata
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Loading Tips Data

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `LoadingTipsData` class manages the loading screen tips system, providing weighted random selection of tips across different categories. It tracks which tips have been shown to reduce repetition and adapts tip categories based on player experience level.

## Usage Example

```lua
-- Create loading tips data instance
local loadingTips = LoadingTipsData()
loadingTips:Load()

-- Pick a tip for current loading screen
local tip = loadingTips:PickLoadingTip("loadingscreen_skin_name")
if tip then
    -- Display the tip
    print(tip.text)
    loadingTips:RegisterShownLoadingTip(tip)
end
```

## Constants

### TIMES_PLAYED_FOR_MAX_WEIGHT

**Value:** `100`

**Status:** stable

**Description:** Number of play sessions needed to reach maximum category weight progression.

## Class: LoadingTipsData

### Constructor

```lua
local loadingTips = LoadingTipsData()
```

**Description:**
Creates a new loading tips data instance with initialized weights and empty shown tips tracking.

**Initial State:**
- Empty shown tips history
- Calculated loading tip weights based on categories
- Category weights based on player experience

## Methods

### Reset() {#reset}

**Status:** stable

**Description:**
Resets all loading tip weights and shown tips history to initial state.

**Example:**
```lua
loadingTips:Reset()
-- All tips will have equal weight again
```

### Save() / Load() {#save-load}

**Status:** stable

**Description:**
Saves or loads loading tips data to/from persistent storage.

**Storage Format:**
```json
{
    "shownloadingtips": {
        "tip_id": 3,
        "another_tip": 1
    }
}
```

**Example:**
```lua
loadingTips:Load()  -- Load on startup
loadingTips:Save()  -- Save when tips are shown
```

### CleanupShownLoadingTips() {#cleanup-shown-loading-tips}

**Status:** stable

**Description:**
Removes entries for tips that no longer exist in the string tables.

**Example:**
```lua
loadingTips:CleanupShownLoadingTips()
-- Removes orphaned tip references
```

### CalculateCategoryWeights() {#calculate-category-weights}

**Status:** stable

**Description:**
Calculates category selection weights based on player experience (times played).

**Returns:**
- (table): Category weights for tip selection

**Algorithm:**
- New players see more control tips
- Experienced players see more lore and advanced tips
- Linear progression over `TIMES_PLAYED_FOR_MAX_WEIGHT` sessions

**Example:**
```lua
local weights = loadingTips:CalculateCategoryWeights()
-- Returns: {CONTROLS = 0.8, SURVIVAL = 0.6, LORE = 0.2, ...}
```

### CalculateLoadingTipWeights() {#calculate-loading-tip-weights}

**Status:** stable

**Description:**
Calculates individual tip weights within each category based on platform and shown frequency.

**Returns:**
- (table): Nested table of category -> tip weights

**Platform Considerations:**
- Console vs non-console control tips
- Platform-specific control bindings
- Fallback to general control tips

**Example:**
```lua
local tipWeights = loadingTips:CalculateLoadingTipWeights()
-- Returns: {CONTROLS = {tip1 = 0.5, tip2 = 1.0}, SURVIVAL = {...}, ...}
```

### GenerateLoadingTipWeights(stringlist) {#generate-loading-tip-weights}

**Status:** stable

**Description:**
Generates weight values for tips in a string list based on display frequency.

**Parameters:**
- `stringlist` (table): Table of tip strings

**Returns:**
- (table): Tip weights (higher for less-shown tips)

**Weight Formula:**
```lua
weight = 1 / (times_shown + 1)
```

**Example:**
```lua
local weights = loadingTips:GenerateLoadingTipWeights(STRINGS.UI.LOADING_SCREEN_SURVIVAL_TIPS)
-- Returns: {survival_tip1 = 1.0, frequently_shown_tip = 0.25, ...}
```

### IsControlTipBound(controllerid, tipid) {#is-control-tip-bound}

**Status:** stable

**Description:**
Checks if all required controls for a tip are bound to actual inputs.

**Parameters:**
- `controllerid` (number): Controller ID to check bindings for
- `tipid` (string): Control tip identifier

**Returns:**
- (boolean): True if all required controls are bound

**Example:**
```lua
if loadingTips:IsControlTipBound(0, "TIP_ATTACK") then
    -- Attack control tip can be shown
end
```

### GenerateControlTipText(tipid) {#generate-control-tip-text}

**Status:** stable

**Description:**
Generates localized control tip text with current key bindings.

**Parameters:**
- `tipid` (string): Control tip identifier

**Returns:**
- (string): Formatted tip text with control keys

**Fallback Logic:**
1. Check if controls are bound for current controller
2. Fall back to keyboard (controller 0) if unbound
3. Show generic "bind controls" tip if still unbound

**Example:**
```lua
local tipText = loadingTips:GenerateControlTipText("TIP_ATTACK")
-- Returns: "Press [LMB] to attack enemies"
```

### PickLoadingTip(loadingscreen) {#pick-loading-tip}

**Status:** stable

**Description:**
Selects an appropriate loading tip based on player settings, available categories, and weights.

**Parameters:**
- `loadingscreen` (string): Loading screen identifier

**Returns:**
- (table|nil): Tip data with id, text, atlas, and icon fields

**Selection Process:**
1. Check player loading tips preference
2. Filter available categories based on settings
3. Remove categories with no tips
4. Weighted random selection of category
5. Weighted random selection of tip within category

**Tip Data Structure:**
```lua
{
    id = "tip_identifier",
    text = "Localized tip text",
    atlas = "ui/loading_tips.xml",
    icon = "tip_icon.tex"
}
```

**Example:**
```lua
local tip = loadingTips:PickLoadingTip("loadingscreen_default")
if tip then
    print("Tip:", tip.text)
    print("Icon:", tip.atlas, tip.icon)
end
```

### RegisterShownLoadingTip(tip) {#register-shown-loading-tip}

**Status:** stable

**Description:**
Records that a tip has been shown to the player, affecting future selection weights.

**Parameters:**
- `tip` (table): Tip data containing `id` field

**Side Effects:**
- Increments shown count for the tip
- Marks data as dirty for saving
- Automatically saves data

**Example:**
```lua
local tip = loadingTips:PickLoadingTip("loadingscreen_default")
if tip then
    -- Show tip to player
    loadingTips:RegisterShownLoadingTip(tip)
end
```

## Tip Categories

### CONTROLS

**Description:** Control and input-related tips that help players learn game mechanics.

**Platform Variants:**
- General controls (all platforms)
- Console-specific controls
- Non-console specific controls

**Features:**
- Dynamic control binding integration
- Fallback to keyboard if controller unbound
- Generic "bind controls" tip if no bindings

### SURVIVAL

**Description:** Gameplay tips about surviving in the world.

**Content Examples:**
- Resource gathering advice
- Crafting tips
- Seasonal survival strategies
- Combat advice

### LORE

**Description:** Background story and world lore information.

**Content Examples:**
- Character backstories
- World history
- Mystery explanations
- Atmospheric details

### LOADING_SCREEN

**Description:** Tips specific to the current loading screen background.

**Source:** `STRINGS.SKIN_DESCRIPTIONS[loadingscreen]`

**Behavior:** Only available if the loading screen has associated description text.

### OTHER

**Description:** Miscellaneous tips that don't fit other categories.

**Processing:** Uses same control tip text generation as CONTROLS category.

## Player Preferences

### LOADING_SCREEN_TIP_OPTIONS.NONE

**Behavior:** No tips are shown.

### LOADING_SCREEN_TIP_OPTIONS.LORE_ONLY

**Behavior:** Only lore and loading screen-specific tips are shown.

### LOADING_SCREEN_TIP_OPTIONS.TIPS_ONLY

**Behavior:** Only gameplay tips (controls, survival, other) are shown.

## Weight Progression System

### New Players (0-25 sessions)
- High weight on control tips
- Medium weight on survival tips
- Low weight on lore tips

### Intermediate Players (25-75 sessions)
- Balanced weights across categories
- Gradual shift toward lore content

### Experienced Players (75+ sessions)
- Lower weight on basic control tips
- Higher weight on lore and advanced content
- Maximum category weight reached at 100 sessions

## Data Persistence

### Storage Location
- **File:** `"loadingtips"`
- **Format:** JSON-encoded data
- **Encryption:** None (readable data)

### Cleanup Process
- Removes references to deleted tips
- Maintains data integrity across game updates
- Automatic cleanup on load

## Integration Points

### Profile System
- `Profile:GetValue("play_instance")`: Times played counter
- `Profile:GetLoadingTipsOption()`: Player preference setting

### Input System
- `TheInput:GetControllerID()`: Current controller
- `TheInput:ControllerAttached()`: Controller connection status
- `TheInput:GetLocalizedControl()`: Control binding strings

### String System
- `STRINGS.UI.LOADING_SCREEN_*_TIPS`: Tip content
- `STRINGS.SKIN_DESCRIPTIONS`: Loading screen descriptions
- `LOADING_SCREEN_CONTROL_TIP_KEYS`: Control mappings

## Related Modules

- [Profile](./playerprofile.md): Player statistics and preferences
- [Input](./input.md): Input handling and control bindings  
- [Localization](./localization.md): String management and translations
