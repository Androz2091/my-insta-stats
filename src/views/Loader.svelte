<script>
    import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';

    let loading = false;

    async function handleFile (file) {
        loading = true;
        const uz = new Unzip();
        uz.register(AsyncUnzipInflate);
        const files = [];
        uz.onfile = (f) => files.push(f);
        const reader = file.stream().getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                uz.push(new Uint8Array(0), true);
                break;
            }
            for (let i = 0; i < value.length; i += 65536) {
                uz.push(value.subarray(i, i + 65536));
            }
        }
        const validPackage = files.some((file) => file.name === 'content');
        if (!validPackage) {
            error = true;
            loading = false;
            return;
        }
        const extractStartAt = Date.now();
        extractData(files).then((extractedData) => {
            loading = false;
            data.set(extractedData)
            loaded.set(true);
            loadTask.set(null);
            console.log(`[debug] Data extracted in ${(Date.now() - extractStartAt) / 1000} seconds.`);
        }).catch((err) => {
            error = true;
            loading = false;
            alert(err.stack);
        });
    }

    function filePopup () {
        if (loading) return;
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.zip');
        input.addEventListener('change', (e) => handleFile(e.target.files[0]));
        input.addEventListener('error', (e) => error = true);
        input.click();
    }
</script>

<div class="loader" style="{!loading && 'cursor: pointer'}" on:click="{filePopup}">
    {#if loading}
        <h1>En cours de chargement...</h1>
    {:else}
        <div style="text-align: center;">
            <h1>Cliquez ici pour charger votre fichier</h1>
            <small style="display: block;">Pour télécharger votre fichier, ouvrez les paramètres Instagram et chercher "Télécharger mes données". Vous pourrez rentrer votre email et recevoir votre fichier !</small>
        </div>
    {/if}
</div>

<style>
    .loader {
        color: white;
        text-shadow: 0px 3px 10px rgba(0,0,0,.25);;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at 30% 190%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
    }
</style>
