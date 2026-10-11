import { getPublicSettings } from '../src/features/settings/queries.public';
import { getPublicStatistics } from '../src/features/statistics/queries.public';
import { getPublicActiveMembers } from '../src/features/members/queries.public';
import { getPublishedPosts } from '../src/features/posts/queries.public';
import { getPublicWorkPrograms } from '../src/features/work-programs/queries.public';
import { getPublicOpportunities } from '../src/features/opportunities/queries.public';

async function test() {
  console.log("Testing public queries against real normalized tables...");
  const [settings, stats, members, posts, proker, opps] = await Promise.all([
    getPublicSettings(),
    getPublicStatistics(),
    getPublicActiveMembers(),
    getPublishedPosts(),
    getPublicWorkPrograms(),
    getPublicOpportunities(),
  ]);
  console.log('✅ Settings:', Object.keys(settings));
  console.log('✅ Stats (Auto-computed from real records):', stats);
  console.log('✅ Members count:', members.length);
  console.log('✅ Posts count:', posts.items.length);
  console.log('✅ Proker count:', proker.length);
  console.log('✅ Opportunities count:', opps.items.length);
}

test().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
