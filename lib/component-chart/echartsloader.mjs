/*
 * Copyright (c) 2026.
 */

/**
 * Loads ECharts on demand via <script> tag, once per page.
 * The URL can be overridden with universe.ECHARTS_URL (e.g. to self-host the file).
 *
 * @author: Martin Neitz
 */

const ECHARTS_VERSION   = '6.1.0';
const ECHARTS_URL       = `https://cdn.jsdelivr.net/npm/echarts@${ECHARTS_VERSION}/dist/echarts.min.js`;
const ECHARTS_INTEGRITY = 'sha384-C2iskrW/uPW46KzOjrvJIQo4YkV8lkD+QS0CrDN18IIPIpT/g2USu8bTP3nvmIAD';

let loading;

export default function loadECharts() {
    if (globalThis.echarts) return Promise.resolve(globalThis.echarts);
    if (loading) return loading;

    const url       = globalThis.universe?.ECHARTS_URL ?? ECHARTS_URL;
    const integrity = url === ECHARTS_URL ? ECHARTS_INTEGRITY : globalThis.universe?.ECHARTS_INTEGRITY;

    loading = new Promise((resolve, reject) => {
        const script       = document.createElement('script');
        script.src         = url;
        script.async       = true;
        script.crossOrigin = 'anonymous';
        if (integrity) script.integrity = integrity;
        script.onload  = () => resolve(globalThis.echarts);
        script.onerror = () => {
            loading = undefined;        // allow retry on next render
            script.remove();
            reject(new Error(`Can't load ECharts from '${url}'`));
        };
        document.head.append(script);
    });
    return loading;
}