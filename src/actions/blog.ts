"use server";

import { BlogType, validateBlog } from "@/types/blog";
import axios from "axios";

const GET_USER_ARTICLES = `
query Publication($id: ObjectId = "66213f8be5371b46eac0e05e") {
  publication(id: $id) {
    author{
      profilePicture
    }
    posts(first: 50) {
      edges {
        node {
          title
          url
          views
          publishedAt,
          readTimeInMinutes
        }
      }
    }
  }
}
`;

export async function getBlogs() {
  try {
    const res = await axios.post("https://gql.hashnode.com/", {
      query: GET_USER_ARTICLES,
    });
    const resp: BlogType[] = [];
    for (const edge of res.data.data.publication.posts.edges) {
      const parsedNode = validateBlog.safeParse(edge.node);
      if (parsedNode.success) {
        resp.push(parsedNode.data);
      }
    }
    const blogs = resp
      .sort((a, b) => b.views - a.views)
      .filter((blog) => blog.views !== 0)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );

    return blogs;
  } catch (e) {
    console.error(e);
    return [];
  }
}
