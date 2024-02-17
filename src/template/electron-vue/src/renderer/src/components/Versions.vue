<script setup lang="ts">

const versions = reactive({ ...window.electron.process.versions });
</script>

<template>
    <ul class="versions">
        <li class="electron-version">
            Electron v{{ versions.electron }}
        </li>
        <li class="chrome-version">
            Chromium v{{ versions.chrome }}
        </li>
        <li class="node-version">
            Node v{{ versions.node }}
        </li>
        <li class="v8-version">
            V8 v{{ versions.v8 }}
        </li>
    </ul>
</template>

<style lang="less">
.versions {
    margin: 0 auto;
    float: none;
    clear: both;
    overflow: hidden;
    font-family: 'Menlo', 'Lucida Console', monospace;
    color: #c2f5ff;
    line-height: 1;
    transition: all 0.3s;
    height: 50px;
    padding: 15px 0;

    li {
        display: block;
        float: left;
        border-right: 1px solid rgba(194, 245, 255, 0.4);
        padding: 0 20px;
        font-size: 13px;
        opacity: 0.8;

        &:last-child {
            border: none;
        }
    }
}

</style>