Hierarchy of styles
===================


Aurora Component

 theme root: /thoregon.aurora/themes
 ui root: {theme root}
 component path: {uiroot}/{theme}/{component}

 {uiroot}/{theme}/app/colors.xml
 {uiroot}/{theme}/app/{theme}app.css
 {themeRoot}/{theme}/flex.css
 {themeRoot}/{theme}/skeleton.css
 {themeRoot}/{theme}/${theme}.css
 {uiroot}/{theme}/{theme}.css
 {componentPath}/{component}.css || {uiroot}/{component}.css
 {componentPath}/{templatename}.css
  
App Component

 theme root: /{appname}/ui/components/{component}/themes
 ui root: {theme root} || {appname}/ui/components
 component path: {uiroot}/themes/{theme}/{component}

 {uiroot}/{theme}/app/colors.xml
 {uiroot}/{theme}/app/{theme}app.css
 {themeRoot}/{theme}/flex.css
 {themeRoot}/{theme}/skeleton.css
 {themeRoot}/{theme}/${theme}.css
 {uiroot}/{theme}/{theme}.css
 {componentPath}/{component}.css || {uiroot}/{component}.css
 {componentPath}/{templatename}.css

App View

 component root: /{appname}/ui/views/{component}

AppElement 

