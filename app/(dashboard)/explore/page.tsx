import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ExploreContent from '@/components/explore/ExploreContent';

export default async function ExplorePage() {
    const session = await auth();
    if (!session) redirect('/auth/signin');

    return <ExploreContent />;
}