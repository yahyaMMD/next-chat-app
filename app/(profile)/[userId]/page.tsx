"use client";

import Post from "@/components/Posts/Post";
import useSwr from "swr";
import UserProfileCard from "@/components/Profile/UserProfileCard";
import { Container, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { ParamsPost } from "@/types/posts";

const UserProfile: React.FC<ParamsPost> = async ({ params }) => {
  const [isSendedRequest, setisSendedRequest] = useState<boolean>(false);
  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSwr(
    `/api/users/${params.userId}`,
    fetcher
  );
  const router = useRouter();
  const userInfo =
    typeof window !== "undefined" && localStorage.getItem("userinfo")
      ? JSON.parse(localStorage.getItem("userinfo")!)
      : null;

  useEffect(() => {
    if (userInfo.userId === params.userId) {
      router.replace("/");
    }
  }, [router]);

  const followUser = async () => {
    try {
      const response = await fetch(`/api/users/${data._id}`, {
        method: "POST",
        body: JSON.stringify({
          userIdToSend: userInfo.userId,
        }),
      });

      if (response.ok) {
        setisSendedRequest(true);
        toast.success("You send follow request");
      }

      setisSendedRequest(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error ocurred");
      }
    }
  };

  if (!data || isLoading) {
    return (
      <div className="loader_wrapper">
        <FadeLoader />
      </div>
    );
  }

  if (error) {
    return toast.error("Something get wrong");
  }

  const isUserFollowed = data.followers.includes(userInfo.userId);

  return (
    <Container maxWidth="lg">
      <ToastContainer />
      <UserProfileCard
        isPrivate={data.isPrivate}
        userImage={data.image}
        firstName={data.first_name}
        lastName={data.last_name}
        posts={data.posts}
        email={data.email}
        followers={data.followers.length}
        following={data.following.length}
        isUserFollowed={isUserFollowed}
        followUser={followUser}
        isSended={isSendedRequest}
      />
      {data.isPrivate && !isUserFollowed && (
        <Typography textAlign="center" fontWeight="bold">
          Profile is private
        </Typography>
      )}
      {(!data.isPrivate || isUserFollowed) && (
        <Container maxWidth="md">
          {Object.keys(data.posts).map((key) => {
            const post = data.posts[key];
            return (
              <Post
                key={post._id}
                userId={post.creator}
                postId={post._id}
                comments={post.comments}
                likes={post.likes}
                image={post.image}
                hashtags={post.hashtags}
                description={post.description}
                date={post.createdAt}
                location={post.location}
                firstName={data.first_name}
                lastName={data.last_name}
                creatorImg={data.image}
                show={true}
              />
            );
          })}
        </Container>
      )}
    </Container>
  );
};

export default UserProfile;
