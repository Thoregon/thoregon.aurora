Embedded Elements in other Websites
===================================

- custom elements
- creates iframe as container for domain (origin)
    - iframe [allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy/Using_Feature_Policy#The_iframe_allow_attribute) attribute        
        <iframe src="https://example.com..." allow="payment 'src; layout-animations 'src'; unoptimized-images 'src'; oversized-images 'src'; sync-script 'src'; sync-xhr 'src'; unsized-media 'src';"></iframe>
