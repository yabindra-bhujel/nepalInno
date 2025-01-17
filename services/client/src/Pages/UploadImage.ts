import axios from "axios";

export const handleImageStorage = async (file: File) => {
  const reader = new FileReader();

  return new Promise<string>((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      const timestamp = new Date().toISOString().replace(/[^\w\s]/gi, '-');
      const imageName = `${timestamp}.png`;

      const imageFilePath = `assets/images/${imageName}`;
      const githubRepo = "yabindra-bhujel/Image-Storeage";
      const githubToken = process.env.GITHUB_ACCESS_KEY as string;

      try {
        const imageUrl = await uploadGitHubFile(githubRepo, imageFilePath, base64Image, githubToken);
        resolve(imageUrl);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

const uploadGitHubFile = async (
  repo: string,
  path: string,
  content: string,
  token: string
) => {
  try {
    const response = await axios.put(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      {
        message: `Upload image ${path}`,
        content: content.split(",")[1],
      },
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    const imageUrl = response.data.content.download_url;
    return imageUrl;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload image to GitHub');
  }
};