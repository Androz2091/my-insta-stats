<script>
    import { fly } from 'svelte/transition';
    import { data } from '../app/store';
    import Card from '../components/Card.svelte';
    import FunFact from '../components/FunFact.svelte';
    import Leaderboard from '../components/Leaderboard.svelte';
    import LeaderboardItem from '../components/LeaderboardItem.svelte';
</script>

<div class="statistics" transition:fly="{{ y: 200, duration: 1000 }}">
    <h1 style="margin: 0; padding-bottom: 4px">MyInstaStats</h1><h3 style="padding-bottom: 10px">Your Instagram stats at a glance</h3>
    <div class="cards">
        <Card name="profile">
            <FunFact
                content="You sent % messages on Instagram"
                svg="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                count={ $data.messageCount }
                explanation="That's about { $data.messageCountPerDay } messages per day!"
            />
            <FunFact
                content="You liked % Instagram posts"
                svg="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                count={ $data.likeCount }
                explanation="That's about { $data.likeCountPerDay } likes per day!"
            />
            <FunFact
                content="You posted % comments on Instagram"
                svg="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                count={ $data.commentCount }
                explanation="That's about { $data.commentCountPerDay } messages per day!"
            />
        </Card>
        <Card name="first">
            <Leaderboard title="Top Likes" description="The users you like the most">
                {#each $data.topLikes as topLike, i}
                    <LeaderboardItem
                        username={topLike.username}
                        count={topLike.count}
                        position={i}
                        avatarURL={topLike.avatarURL}
                        type='likes'
                    />
                {/each}
            </Leaderboard>
        </Card>
        <Card name="second">
        </Card>
        <Card name="words">
            <h3>What Instagram thinks you like</h3>
            <p>Instagram will try to suggest these types of content.</p>
            <ul style="column-count: 3;">
                {#each $data.topics as topic}
                    <li>{ topic }</li>
                {/each}
            </ul>
        </Card>
    </div>
</div>

<style>
    h3 {
		margin: 0;
	}
    .statistics {
        color: white;
        padding: 20px;
    }
    .cards {
        display: grid;
        grid-gap: 10px;
    }
</style>