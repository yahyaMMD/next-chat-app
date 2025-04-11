"use client";
import useSwr from "swr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import { FadeLoader } from "react-spinners";
import { Container } from "@mui/material";
import Post from "@/components/Posts/Post";
import { PostProps } from "@/types/posts";

const HashtagPage = () => {
  const pathname = usePathname();
  const hashtag = pathname.split("/")[2];
  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSwr(
    `/api/posts/hashtags/${hashtag}`,
    fetcher
  );

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

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "stretch",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <ToastContainer />
      {data.map((post: PostProps) => (
        <div>
          <Post
            key={post._id}
            postId={post._id}
            hashtags={post.hashtags}
            description={post.description}
            image={post.image}
            date={post.createdAt}
            location={post.location}
            firstName={post.creator.first_name}
            lastName={post.creator.last_name}
            creatorImg={post.creator.image}
            userId={post.creator._id}
            likes={post.likes}
            comments={post.comments}
            show={false}
          />
        </div>
      ))}
    </Container>
  );
};

export default HashtagPage;
