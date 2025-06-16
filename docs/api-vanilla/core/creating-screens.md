---
id: creating-screens
title: Creating Screens
sidebar_position: 15
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Creating Screens

*API Version: 619045*

In Don't Starve Together, screens are full-page UI elements that take over the entire game window. Screens are used for menus, popups, and other full-screen interfaces. This document covers how to create and manage screens in your mods.

## Screen Basics

Screens are the top-level UI elements in DST. They inherit from the `Widget` class but have special properties for handling input and managing the UI stack.

```lua
local Screen = require "widgets/screen"
local Widget = require "widgets/widget"
local Text = require "widgets/text"

-- Create a simple screen
MyScreen = Class(Screen, function(self)
    Screen._ctor(self, "MyScreen")
    
    -- Create a root widget for all content
    self.root = self:AddChild(Widget("root"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add content to the root
    self.title = self.root:AddChild(Text(TITLEFONT, 50, "My Screen"))
    
    -- Set default focus
    self.default_focus = self.title
end)
```

## Screen Management

Screens are managed by the `TheFrontEnd` object, which maintains a stack of screens:

```lua
-- Push a new screen onto the stack
TheFrontEnd:PushScreen(MyScreen())

-- Pop the top screen
TheFrontEnd:PopScreen()

-- Replace all screens with a new one
TheFrontEnd:SetScreen(MyScreen())

-- Get the currently active screen
local current_screen = TheFrontEnd:GetActiveScreen()
```

## Screen Lifecycle

Screens have several lifecycle methods that you can override:

```lua
function MyScreen:OnBecomeActive()
    Screen.OnBecomeActive(self)
    -- Called when this screen becomes the active screen
    -- Good place to initialize dynamic content
end

function MyScreen:OnBecomeInactive()
    Screen.OnBecomeInactive(self)
    -- Called when this screen is no longer the active screen
    -- Good place to save state or clean up
end

function MyScreen:OnDestroy()
    -- Called when the screen is being destroyed
    -- Clean up any resources here
    self._base.OnDestroy(self)
end

function MyScreen:OnUpdate(dt)
    -- Called every frame when the screen is active
    -- dt is the time since the last frame in seconds
end
```

## Input Handling

Screens can handle input events from the keyboard, mouse, and controller:

```lua
function MyScreen:OnControl(control, down)
    if Screen.OnControl(self, control, down) then return true end
    
    if not down and control == CONTROL_CANCEL then
        TheFrontEnd:PopScreen()
        return true
    end
    
    return false
end

function MyScreen:OnRawKey(key, down)
    if Screen.OnRawKey(self, key, down) then return true end
    
    if key == KEY_ESCAPE and not down then
        TheFrontEnd:PopScreen()
        return true
    end
    
    return false
end

function MyScreen:OnMouseButton(button, down, x, y)
    if Screen.OnMouseButton(self, button, down, x, y) then return true end
    
    if button == MOUSEBUTTON_LEFT and down then
        print("Clicked at", x, y)
        return true
    end
    
    return false
end
```

## Common Screen Types

### Popup Screen

A popup screen is a modal dialog that appears on top of the current screen:

```lua
local PopupDialogScreen = require "screens/popupdialog"

-- Create a simple popup
local popup = PopupDialogScreen(
    "Confirm Action",                   -- Title
    "Are you sure you want to proceed?", -- Body text
    {
        {
            text = "Yes",
            cb = function() 
                print("User confirmed")
                TheFrontEnd:PopScreen() 
            end
        },
        {
            text = "No",
            cb = function() 
                print("User cancelled")
                TheFrontEnd:PopScreen() 
            end
        }
    }
)

-- Show the popup
TheFrontEnd:PushScreen(popup)
```

### Menu Screen

A menu screen displays a list of options:

```lua
local MenuScreen = Class(Screen, function(self, title, options)
    Screen._ctor(self, "MenuScreen")
    
    self.root = self:AddChild(Widget("root"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add background
    self.bg = self.root:AddChild(Image("images/ui.xml", "bg_plain.tex"))
    self.bg:SetSize(500, 400)
    
    -- Add title
    self.title = self.root:AddChild(Text(TITLEFONT, 40, title))
    self.title:SetPosition(0, 150)
    
    -- Create menu
    local Menu = require "widgets/menu"
    self.menu = self.root:AddChild(Menu(nil, 0, true))
    self.menu:SetPosition(0, 0)
    
    -- Add menu items
    for _, option in ipairs(options) do
        self.menu:AddItem(option.text, option.cb)
    end
    
    -- Set default focus
    self.default_focus = self.menu
end)

-- Usage example
local options = {
    {
        text = "Start Game",
        cb = function() print("Starting game") end
    },
    {
        text = "Options",
        cb = function() print("Opening options") end
    },
    {
        text = "Quit",
        cb = function() print("Quitting") end
    }
}

local menu_screen = MenuScreen("Main Menu", options)
TheFrontEnd:PushScreen(menu_screen)
```

### Form Screen

A screen with form elements for user input:

```lua
local FormScreen = Class(Screen, function(self, title, on_submit)
    Screen._ctor(self, "FormScreen")
    
    self.root = self:AddChild(Widget("root"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add background
    self.bg = self.root:AddChild(Image("images/ui.xml", "bg_plain.tex"))
    self.bg:SetSize(500, 400)
    
    -- Add title
    self.title = self.root:AddChild(Text(TITLEFONT, 40, title))
    self.title:SetPosition(0, 150)
    
    -- Create form elements
    local TextEdit = require "widgets/textedit"
    self.name_label = self.root:AddChild(Text(NEWFONT, 25, "Name:"))
    self.name_label:SetPosition(-100, 50)
    
    self.name_edit = self.root:AddChild(TextEdit(NEWFONT, 25, "", {1,1,1,1}))
    self.name_edit:SetPosition(50, 50)
    self.name_edit:SetRegionSize(200, 40)
    
    local Spinner = require "widgets/spinner"
    self.age_label = self.root:AddChild(Text(NEWFONT, 25, "Age:"))
    self.age_label:SetPosition(-100, 0)
    
    local ages = {}
    for i = 1, 100 do
        table.insert(ages, tostring(i))
    end
    
    self.age_spinner = self.root:AddChild(Spinner(ages, 100, 40, {font=NEWFONT, size=25}))
    self.age_spinner:SetPosition(50, 0)
    
    -- Add submit button
    local ImageButton = require "widgets/imagebutton"
    self.submit_button = self.root:AddChild(ImageButton("images/ui.xml", "button.tex", "button_focus.tex"))
    self.submit_button:SetPosition(0, -100)
    self.submit_button:SetText("Submit")
    self.submit_button:SetOnClick(function()
        local data = {
            name = self.name_edit:GetString(),
            age = self.age_spinner:GetSelected()
        }
        on_submit(data)
        TheFrontEnd:PopScreen()
    end)
    
    -- Set default focus
    self.default_focus = self.name_edit
end)

-- Usage example
local form_screen = FormScreen("User Information", function(data)
    print("Name:", data.name)
    print("Age:", data.age)
end)
TheFrontEnd:PushScreen(form_screen)
```

## Advanced Screen Techniques

### Screen Transitions

You can create smooth transitions between screens:

```lua
function MyScreen:TransitionIn()
    self.root:SetScale(0.1)
    self.root:MoveTo(Vector3(0, 0, 0), Vector3(0, 0, 0), 0.3, function()
        -- Transition complete
    end)
    self.root:ScaleTo(0.1, 1, 0.3)
end

function MyScreen:TransitionOut(cb)
    self.root:ScaleTo(1, 0.1, 0.3)
    self.root:MoveTo(Vector3(0, 0, 0), Vector3(0, -500, 0), 0.3, function()
        if cb then cb() end
    end)
end
```

### Screen with Tabs

Create a screen with multiple tabs:

```lua
local TabScreen = Class(Screen, function(self, title, tabs)
    Screen._ctor(self, "TabScreen")
    
    self.root = self:AddChild(Widget("root"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add background
    self.bg = self.root:AddChild(Image("images/ui.xml", "bg_plain.tex"))
    self.bg:SetSize(600, 400)
    
    -- Add title
    self.title = self.root:AddChild(Text(TITLEFONT, 40, title))
    self.title:SetPosition(0, 150)
    
    -- Create tab buttons
    local TabGroup = require "widgets/tabgroup"
    self.tab_group = self.root:AddChild(TabGroup())
    self.tab_group:SetPosition(0, 100)
    
    -- Create content area
    self.content = self.root:AddChild(Widget("content"))
    self.content:SetPosition(0, -50)
    
    -- Add tabs
    self.tabs = {}
    for i, tab in ipairs(tabs) do
        local tab_widget = self.content:AddChild(Widget("tab_" .. i))
        tab.build_fn(tab_widget)
        tab_widget:Hide()
        
        self.tabs[i] = tab_widget
        self.tab_group:AddTab(tab.title, function()
            self:ShowTab(i)
        end)
    end
    
    -- Show first tab by default
    self:ShowTab(1)
    
    -- Add close button
    local ImageButton = require "widgets/imagebutton"
    self.close_button = self.root:AddChild(ImageButton("images/ui.xml", "button.tex", "button_focus.tex"))
    self.close_button:SetPosition(0, -150)
    self.close_button:SetText("Close")
    self.close_button:SetOnClick(function()
        TheFrontEnd:PopScreen()
    end)
    
    -- Set default focus
    self.default_focus = self.tab_group
end)

function TabScreen:ShowTab(index)
    for i, tab in ipairs(self.tabs) do
        if i == index then
            tab:Show()
        else
            tab:Hide()
        end
    end
end

-- Usage example
local tabs = {
    {
        title = "General",
        build_fn = function(parent)
            local text = parent:AddChild(Text(NEWFONT, 25, "General settings go here"))
            text:SetPosition(0, 0)
        end
    },
    {
        title = "Audio",
        build_fn = function(parent)
            local text = parent:AddChild(Text(NEWFONT, 25, "Audio settings go here"))
            text:SetPosition(0, 0)
        end
    },
    {
        title = "Graphics",
        build_fn = function(parent)
            local text = parent:AddChild(Text(NEWFONT, 25, "Graphics settings go here"))
            text:SetPosition(0, 0)
        end
    }
}

local tab_screen = TabScreen("Settings", tabs)
TheFrontEnd:PushScreen(tab_screen)
```

### Scrollable Content Screen

Create a screen with scrollable content:

```lua
local ScrollableScreen = Class(Screen, function(self, title, content_items)
    Screen._ctor(self, "ScrollableScreen")
    
    self.root = self:AddChild(Widget("root"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add background
    self.bg = self.root:AddChild(Image("images/ui.xml", "bg_plain.tex"))
    self.bg:SetSize(600, 400)
    
    -- Add title
    self.title = self.root:AddChild(Text(TITLEFONT, 40, title))
    self.title:SetPosition(0, 150)
    
    -- Create scrollable list
    local ScrollableList = require "widgets/scrollablelist"
    
    local function BuildItem(item, index)
        local widget = Widget("list-item")
        local text = widget:AddChild(Text(NEWFONT, 20, item.text))
        
        widget.OnGainFocus = function()
            text:SetColour(1, 1, 0, 1)  -- Yellow on focus
        end
        
        widget.OnLoseFocus = function()
            text:SetColour(1, 1, 1, 1)  -- White when not focused
        end
        
        widget.OnSelect = function()
            if item.cb then
                item.cb()
            end
        end
        
        return widget
    end
    
    self.scroll_list = self.root:AddChild(ScrollableList(
        content_items,  -- Items array
        400,            -- Item width
        40,             -- Item height
        8,              -- Number of visible items
        1,              -- Items per row
        false           -- Not horizontal
    ))
    self.scroll_list:SetPosition(0, 0)
    self.scroll_list:SetUpdateFn(BuildItem)
    
    -- Add close button
    local ImageButton = require "widgets/imagebutton"
    self.close_button = self.root:AddChild(ImageButton("images/ui.xml", "button.tex", "button_focus.tex"))
    self.close_button:SetPosition(0, -150)
    self.close_button:SetText("Close")
    self.close_button:SetOnClick(function()
        TheFrontEnd:PopScreen()
    end)
    
    -- Set default focus
    self.default_focus = self.scroll_list
end)

-- Usage example
local items = {}
for i = 1, 20 do
    table.insert(items, {
        text = "Item " .. i,
        cb = function() print("Selected item", i) end
    })
end

local scroll_screen = ScrollableScreen("Scrollable Content", items)
TheFrontEnd:PushScreen(scroll_screen)
```

## Best Practices for Screen Development

1. **Root Widget**: Always create a root widget for your screen content to manage layout properly
2. **Default Focus**: Set `self.default_focus` to ensure controller navigation works correctly
3. **Cleanup**: Override `OnDestroy` to clean up any resources when the screen is closed
4. **Input Handling**: Always call the parent method first in input handlers and return true if handled
5. **Transitions**: Add smooth transitions for a polished user experience
6. **Error Handling**: Wrap callbacks in pcall to prevent crashes from user input
7. **Accessibility**: Ensure all interactive elements can be navigated with a controller
8. **Consistency**: Follow DST's UI style for a consistent user experience
9. **Performance**: Minimize the number of widgets and avoid creating them frequently
10. **Testing**: Test your screens on different resolutions and with both mouse and controller input

## Example: Complete Custom Screen

Here's a complete example of a custom screen for a mod settings menu:

```lua
local Screen = require "widgets/screen"
local Widget = require "widgets/widget"
local Text = require "widgets/text"
local Image = require "widgets/image"
local ImageButton = require "widgets/imagebutton"
local Spinner = require "widgets/spinner"
local TextEdit = require "widgets/textedit"
local TEMPLATES = require "widgets/templates"

-- Create a settings screen for a mod
ModSettingsScreen = Class(Screen, function(self, mod_name, settings, on_save)
    Screen._ctor(self, "ModSettingsScreen")
    
    self.mod_name = mod_name
    self.settings = settings
    self.on_save = on_save
    
    -- Create root widget
    self.root = self:AddChild(Widget("root"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add dark background
    self.black = self.root:AddChild(TEMPLATES.BackgroundTint(0.7))
    
    -- Create panel
    self.panel = self.root:AddChild(TEMPLATES.RectangleWindow(500, 450))
    
    -- Add title
    self.title = self.panel:AddChild(Text(TITLEFONT, 40, mod_name .. " Settings"))
    self.title:SetPosition(0, 180)
    
    -- Create settings container
    self.settings_root = self.panel:AddChild(Widget("settings_root"))
    self.settings_root:SetPosition(0, 50)
    
    -- Create settings controls based on settings types
    local y_offset = 100
    self.controls = {}
    
    for id, setting in pairs(settings) do
        local label = self.settings_root:AddChild(Text(NEWFONT, 25, setting.label))
        label:SetPosition(-150, y_offset)
        label:SetHAlign(ANCHOR_RIGHT)
        
        if setting.type == "spinner" then
            local spinner = self.settings_root:AddChild(Spinner(
                setting.options,
                200,
                40,
                {font=NEWFONT, size=25},
                function(selected)
                    self.settings[id].value = selected
                end
            ))
            spinner:SetPosition(50, y_offset)
            spinner:SetSelected(setting.value)
            self.controls[id] = spinner
            
        elseif setting.type == "checkbox" then
            local checkbox = self.settings_root:AddChild(TEMPLATES.Checkbox(
                "",
                setting.value,
                function(checked)
                    self.settings[id].value = checked
                end
            ))
            checkbox:SetPosition(0, y_offset)
            self.controls[id] = checkbox
            
        elseif setting.type == "text" then
            local text_edit = self.settings_root:AddChild(TextEdit(
                NEWFONT,
                25,
                setting.value,
                {1,1,1,1}
            ))
            text_edit:SetPosition(50, y_offset)
            text_edit:SetRegionSize(200, 40)
            text_edit:SetOnTextInputted(function(text)
                self.settings[id].value = text
            end)
            self.controls[id] = text_edit
        end
        
        y_offset = y_offset - 50
    end
    
    -- Add save button
    self.save_button = self.panel:AddChild(TEMPLATES.StandardButton(
        function()
            self:Save()
        end,
        "Save"
    ))
    self.save_button:SetPosition(-80, -150)
    
    -- Add cancel button
    self.cancel_button = self.panel:AddChild(TEMPLATES.StandardButton(
        function()
            TheFrontEnd:PopScreen()
        end,
        "Cancel"
    ))
    self.cancel_button:SetPosition(80, -150)
    
    -- Set default focus
    self.default_focus = self.settings_root
end)

function ModSettingsScreen:Save()
    local result = {}
    
    -- Extract values from settings
    for id, setting in pairs(self.settings) do
        result[id] = setting.value
    end
    
    -- Call save callback
    if self.on_save then
        self.on_save(result)
    end
    
    TheFrontEnd:PopScreen()
end

function ModSettingsScreen:OnControl(control, down)
    if Screen.OnControl(self, control, down) then return true end
    
    if not down and control == CONTROL_CANCEL then
        TheFrontEnd:PopScreen()
        return true
    end
    
    return false
end

-- Usage example
local settings = {
    difficulty = {
        label = "Difficulty",
        type = "spinner",
        options = {"Easy", "Normal", "Hard"},
        value = "Normal"
    },
    spawn_monsters = {
        label = "Spawn Monsters",
        type = "checkbox",
        value = true
    },
    player_name = {
        label = "Player Name",
        type = "text",
        value = "Player"
    }
}

local settings_screen = ModSettingsScreen("My Mod", settings, function(result)
    print("Settings saved:")
    for k, v in pairs(result) do
        print(k, "=", v)
    end
end)

TheFrontEnd:PushScreen(settings_screen)
``` 
