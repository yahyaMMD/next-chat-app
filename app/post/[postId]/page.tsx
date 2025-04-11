"use client";

import Post from "@/components/Posts/Post";
import { ParamsPost } from "@/types/posts";
import { Container } from "@mui/material";
import React from "react";
import { FadeLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSwr from "swr";

const PostPage: React.FC<ParamsPost> = ({ params }) => {
  const { postId } = params;
  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => res.json());
  const { data, error } = useSwr(`/api/posts/${postId}`, fetcher);

  if (!data) {
    return (
      <div className="loader_wrapper">
        <FadeLoader />
      </div>
    );
  }

  if (error) {
    return toast.error("Something get wrong");
  }

  return (
    <Container maxWidth="md" sx={{ padding: "20px" }}>
      <ToastContainer />
      <Post
        key={data._id}
        postId={data._id}
        hashtags={data.hashtags}
        description={data.description}
        image={data.image}
        date={data.createdAt}
        location={data.location}
        firstName={data.creator.first_name}
        lastName={data.creator.last_name}
        creatorImg={data.creator.image}
        userId={data.creator._id}
        likes={data.likes}
        comments={data.comments}
        show={true}
      />
    </Container>
  );
};

export default PostPage;
