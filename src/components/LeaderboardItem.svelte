<script>
    export let username;
    export let position;
    export let avatarURL;
    export let count;
    export let type;
</script>

<div class="top-item">
    <div class="top-whois">
        <div class="top-bubble { position === 0 ? 'first' : position === 1 ? 'second' : position === 2 ? 'third' : '' }">{ position + 1 }</div>
        <img class="top-avatar" src="{avatarURL}" alt="Avatar" />
        <h3 class="top-name">{username}</h3>
    </div>
    <div class="top-messages">
        <h3>{count.toLocaleString('en-US')} <small>{type}</small></h3>
    </div>
</div>

<style>
    .top-item {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid white;
        align-items: center;
        justify-content: space-between;
    }
    .top-whois {
        padding: 8px;
        align-items: center;
        display: flex;
    }
    .top-item:last-child {
        border-bottom: 0;
    }
    .top-avatar {
        border-radius: 50%;
        height: 50px;
        margin-right: 10px;
    }
    .top-name {
        margin-left: inherit;
    }
    .top-bubble {
        align-items: center;
        justify-content: center;
        display: flex;
        flex: 0 0 35px;
        height: 35px;
        background-color: #50555a;
        border-radius: 50%;
        margin-right: 10px;
    }
    .top-bubble.first {
        background-color: #da9e3b;
    }
    .top-bubble.second {
        background-color: #989898;
    }
    .top-bubble.third {
        background-color: #ae7441;
    }
</style>
