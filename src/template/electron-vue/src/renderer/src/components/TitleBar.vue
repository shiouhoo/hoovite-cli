<template>
    <div className="title-bar">
        <div class="icon-name">
            <img
                class="icon"
                :src="icon"
                alt=""
            >
        </div>
        <!-- 右侧三个操作图标 -->
        <div className="no-drag action">
            <span
                class="action-item"
                @click="hideWinow"
            >
                <img
                    class="action-icon"
                    :src="minWindowIcon"
                >
            </span>
            <span
                class="action-item"
                @click="maxWinow"
            >
                <img
                    class="action-icon"
                    :src="isMaxWindow ? maxWindowRestoreIcon :maxWindowIcon"
                >
            </span>
            <span
                class="action-item"
                @click="closeWinow"
            >
                <img
                    class="action-icon"
                    :src="closeIcon"
                >
            </span>
        </div>
    </div>
</template>

<script lang='ts' setup>
import icon from '@renderer/assets/icons/icon.png';
import maxWindowRestoreIcon from '@renderer/assets/icons/max-window-restore.svg';
import maxWindowIcon from '@renderer/assets/icons/max-window.svg';
import minWindowIcon from '@renderer/assets/icons/min-window.svg';
import closeIcon from '@renderer/assets/icons/close.svg';
import { WindowType } from '@main/type';

const props = withDefaults(defineProps<{
    type?: WindowType;
}>(), {
    type: 'main'
});

const isMaxWindow = ref(false);
onMounted(() => {
    window.electron.ipcRenderer.invoke('window-listen', props.type);
    // 监听窗口最大化事件
    window.electron.ipcRenderer.on('window-change', (_, isMaximized: boolean) => {
        isMaxWindow.value = isMaximized;
    });
});

const hideWinow = () =>{
    window.electron.ipcRenderer.invoke('window-min', props.type);
};
const maxWinow = () =>{
    window.electron.ipcRenderer.invoke('window-max', props.type);
};
const closeWinow = () =>{
    window.electron.ipcRenderer.invoke('window-close', props.type);
};

</script>
<style lang='less' scoped>
.title-bar{
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    width: 100vw;
    height: 30px;
    background-color: rgb(42,42,42);
    -webkit-app-region: drag;
    .icon-name{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .icon{
        width: 20px;
        height: 20px;
    }
    .action{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .action-item{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 100%;
            cursor: pointer;
            &:hover{
                background-color: rgb(50,50,50);
            }
        }
        .action-icon{
            width: 16px;
            height: 16px;
        }
    }
}
</style>