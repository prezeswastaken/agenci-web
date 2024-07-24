<script setup lang="ts">
import type { Socket } from "socket.io-client";
import type { Field } from "~/types/FieldTypes";
import type { Player } from "~/types/PlayerTypes";

const props = defineProps<{
    player: Player | null;
    field: Field;
    showTeam: boolean;
    socket: Socket;
}>();

const emit = defineEmits(["field-updated"]);

async function handleClick() {
    await useApiFetch(`/field/${props.field.id}/player/${props.player?.id}`, {
        method: "POST",
    });
    props.socket.emit("field-updated");
    emit("field-updated");
}

const colorClass = computed(() => {
    switch (props.field.team) {
        case "red":
            return "bg-red-500";
        case "blue":
            return "bg-blue-500";
        case "neutral":
            return "bg-gray-500";
        case "black":
            return "bg-black";
        default:
            return "bg-gray-500";
    }
});

const opacityClass = computed(() => {
    return props.field.is_used ? "bg-opacity-10" : "bg-opacity-100";
});

const textColorClass = computed(() => {
    if (props.field.is_used) {
        switch (props.field.team) {
            case "red":
                return "text-red-500";
            case "blue":
                return "text-blue-500";
            case "neutral":
                return "text-gray-500";
            case "black":
                return "text-black";
            default:
                return "text-gray-500";
        }
    } else {
        return "text-white";
    }
});
</script>

<template>
    <button
        @click="handleClick"
        class="flex flex-col gap-2 justify-center items-center p-3 w-44 h-24 rounded-lg shadow-md duration-300"
        :class="` ${colorClass} ${opacityClass} ${textColorClass}`"
    >
        <div>{{ field.text }}</div>
    </button>
</template>

<style scoped></style>
