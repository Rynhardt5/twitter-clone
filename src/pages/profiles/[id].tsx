import ErrorPage from "next/error";
import {
  type InferGetStaticPropsType,
  type GetStaticPaths,
  type GetStaticPropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ProfileImg } from "~/components/ProfileImg";
import InfiniteTweetList from "~/components/InfinateTweetList";
import { Button } from "~/components/Button";
import { useSession } from "next-auth/react";

const pluralRules = new Intl.PluralRules();
function getPural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
  trpcState,
}) => {
  const trpcUtils = api.useContext();
  const { data: profile } = api.profile.getById.useQuery({ id });
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }: { addedFollow: boolean }) =>
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          followersCount: oldData.followersCount + countModifier,
          isFollowing: addedFollow,
        };
      }),
  });

  if (profile == null || profile.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`Twitter Clone | ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2 ">
          <IconHoverEffect>
            <ArrowLeftIcon className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImg src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetsCount}{" "}
            {getPural(profile.tweetsCount, "Tweet", "Tweets")} -{" "}
            {profile.followersCount}{" "}
            {getPural(profile.followersCount, "Follower", "Followers")} -{" "}
            {profile.followsCount} Following
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          isLoading={toggleFollow.isLoading}
          userId={id}
          onClick={() => toggleFollow.mutate({ userId: id })}
        />
      </header>
      <main>
        <InfiniteTweetList
          tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage}
          fetchNewTweets={tweets.fetchNextPage}
        />
      </main>
    </>
  );
};

function FollowButton({
  isLoading,
  isFollowing,
  userId,
  onClick,
}: {
  isLoading?: boolean;
  isFollowing: boolean;
  userId: string;
  onClick: () => void;
}) {
  const session = useSession();
  if (session.status !== "authenticated" || session.data.user.id === userId)
    return null;

  return (
    <Button onClick={onClick} small gray={isFollowing} disabled={isLoading}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;
  if (id == null) return { redirect: { destination: "/" } };
  const ssg = ssgHelper();

  await ssg.profile.getById.prefetch({ id });

  return { props: { trpcState: ssg.dehydrate(), id } };
}

export default ProfilePage;
