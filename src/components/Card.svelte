<script>
    export let name;
</script>

<div class="card {name}">
    <slot></slot>
</div>

<style>
    .card {
        background-color: #35435d;
        border-radius: 10px;
        padding: 20px;
    }
    @media (min-width: 600px) {
        .card.profile {
            grid-column: 1 / 4;
        }
        .card.first {
            grid-column: 4 / 8;
        }
        .card.second {
            grid-column: 8 / 12;
        }
        .card.third {
            grid-column: 6 / 12;
        }
        .card.words {
            grid-column: 1 / 12;
        }
        .card.hours {
            grid-column: 6 / 12;
        }
        .card.profile {
            grid-column: 1 / 4;
        }
        .card.about {
            grid-column: 6 / 12;
        }
    }
</style>