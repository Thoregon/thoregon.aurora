blueprint
=========


    <aurora-blueprint>
        <aurora-blueprint-header>
            <aurora-toolbar/>
        </aurora-blueprint-header>
        <aurora-blueprint-navigation/>
        <aurora-blueprint-drawer pos="left"/>
        <aurora-blueprint-container aurora-name="mainpage"/>
        <aurora-blueprint-footer/>
    </aurora-blueprint>

## Element Connection

Notification of all other blueprint elements:
- Resizing: when a blueprint element is resized
- Content change: e.g. container notifies all other of content change
    - Refresh texts, images, ... when necessary
    - Reconnect indicators
    - Switch selection e.g. links in collection
    - also notify indicators, menues, floating action bars etc., 
        - switch style/image/icon
        - enable/disable
        - text
