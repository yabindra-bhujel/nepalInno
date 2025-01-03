import { BlogType } from "../types/BlogType";

export const blogData: BlogType[] = [
  {
    id: 1,
    title: "How to Generate SEO-Friendly URLs for Your Blog",
    content: `## Creating SEO-friendly URLs is an important step in ensuring your blog gets indexed well by search engines like Google. In this post, we’ll explore how to generate clean, descriptive URLs for your blog posts.

## Why SEO-Friendly URLs Matter

SEO-friendly URLs provide several advantages:
- **Easier indexing**: Search engines can better understand and index your content.
- **Better user experience**: Clean and descriptive URLs help users understand the content of the page.
- **Higher rankings**: Search engines tend to favor pages with optimized, descriptive URLs.



## How to Identify SEO-Friendly URLs

Here are a few tips for creating SEO-friendly URLs:

1. Use Descriptive Keywords  
   Make sure the URL reflects the content of the blog post. Include relevant keywords to help search engines understand the topic.
   
   Example:
   [https://yourblog.com/seo-friendly-urls](https://yourblog.com/seo-friendly-urls)

2.  **Keep It Short and Simple**  
   Avoid long, complex URLs. Aim for URLs that are concise and easy to read.

3. **Use Hyphens to Separate Words**  
   Use hyphens (\`-\`) rather than underscores (\`_\`) to separate words in your URL. Google prefers hyphens for readability.

4. **Remove Special Characters**  
   Avoid using special characters (e.g., \`&\`, \`%\`, \`#\`, etc.) in your URLs. Stick to letters, numbers, and hyphens.

5. **Include the Post ID**  
   Including a unique post ID in the URL helps differentiate posts and aids in site organization.
   
   Example:
   \`https://yourblog.com/posts/12345/optimizing-your-urls-for-seo\`

## Conclusion

1. First item
2. Second item
3. Third item
    1. Indented item
    2. Indented item
4. Fourth item



By following these best practices, you can create SEO-friendly URLs for your blog that are both search engine and user-friendly. Remember to keep your URLs simple, descriptive, and keyword-rich to improve your blog's SEO performance.

**Happy blogging!**
`,
    author: {
      name: "John Doe",
      image: "https://picsum.photos/seed/picsum/200/300",
      occupation: ["Web Developer", "Entrepreneur"],
    },
    date: "2022-01-01",
    image: "https://picsum.photos/seed/picsum/200/300",
    tags: [
      { name: "SEO" },
      { name: "Blogging" },
      { name: "Digital Marketing" },
    ],
    likes: 1234,
    comments: 567,
    commentsData: [
      {
        id: 1,
        author: {
          name: "Jane Smith",
          image: "https://picsum.photos/seed/jane/40",
          occupation: ["Content Writer"],
        },
        content:
          "Great post! I really enjoyed reading it. Thanks for the great content!",
        date: "2022-01-02",
      },
      {
        id: 2,
        author: {
          name: "Mike Johnson",
          image: "https://picsum.photos/seed/mike/40",
          occupation: ["SEO Specialist"],
        },
        content: "I agree with John. The content is fantastic. Thank you!",
        date: "2022-01-03",
      },
    ],
    relatedPosts: [
      {
        id: 2,
        title:
          "10 Tips for Writing Engaging Blog Posts why all you need to do is write ok writing is the best thing ever",
        image: "https://picsum.photos/seed/related/200/300",
        postDate: "2022-01-02",
        timeToRead: "3 minutes",

        author: {
          name: "Jane Doe",
          image: "https://picsum.photos/seed/jane/40",
          occupation: ["Content Writer", "Blogger"],
        },
      },
      {
        id: 3,
        title: "The Importance of Internal Linking in SEO",
        postDate: "2022-01-03",
        timeToRead: "5 minutes",
        author: {
          name: "Mike Smith",
          image: "https://picsum.photos/seed/jane/40",
          occupation: ["SEO Specialist", "Content Writer"],
        },
      },
      {
        id: 4,
        title: "なぜ SEO 対策の URL が重要なのか",
        postDate: "2022-01-03",
        timeToRead: "5 minutes",
        author: {
          name: "Mary Smith",
          image: "https://picsum.photos/seed/jane/40",
          occupation: ["SEO Specialist", "Content Writer"],
        },
      },
    ],
  },
];
