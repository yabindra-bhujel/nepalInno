type Commenters = {
  name: string;
  image?: string;
  occupation?: string[];
};

type BlogAuthor = {
  name: string;
  image?: string;
   occupation?: string[];
};

type BlogTags = {
  name: string;
};

export type Comments = {
  id: number;
  author: Commenters;
  content: string;
  date: string;
};

export type RelatedBlogPost = {
  id: number;
  title: string;
  image?: string;
  postDate?: string;
  timeToRead?: string;
  author: BlogAuthor;
}

export type BlogType = {
  id: number;
  title: string;
  content: string;
  author: BlogAuthor;
  date: string;
  image?: string;
  tags?: BlogTags[];
  likes?: number;
  comments?: number;
  commentsData?: Comments[];
  relatedPosts?: RelatedBlogPost[];
};