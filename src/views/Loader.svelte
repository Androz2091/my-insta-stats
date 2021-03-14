<script>
    import { loadTask, data, loaded } from '../app/store';
    import { Unzip, AsyncUnzipInflate } from 'fflate';
    import { extractData } from '../app/extractor';

    let loading = false;
    let error = false;

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
        const validPackage = files.some((file) => file.name.startsWith('comments'));
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

<div class="loader">
    <div class="center" style="{!loading && 'cursor: pointer;'} text-align: center" on:click="{filePopup}">
        {#if loading}
            <h2>{$loadTask || 'En cours de chargement...'}</h2>
        {:else if error}
            <h2 style="color: red">Une erreur est survenue... Réessayez !</h2>
        {:else}
            <div>
                <h1>Click here to load your file</h1>
                <p style="display: block;">To download your file, open Instagram settings and search for "Download my data". You will be able to enter your email and receive your file!</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .loader {
        color: white;
        text-shadow: 0px 3px 10px rgba(0,0,0,.25);
        height: 100%;
        width: 100%;
    }
    .center {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
    }
</style>
