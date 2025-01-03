import React from "react";
import { Navigation } from "./Navigation";

type ContentRanking = {
  title: string;
  image?: string;
  user?: string;
}

type UserRanking = {
  username: string;
  image?: string;
  contributions?: number;
}



export const Home = () => {
  const userRanking: UserRanking[] = [
    {
      username: "user1",
      image: "https://picsum.photos/seed/user1/200/300",
      contributions: 2000,
    },
    {
      username: "user2",
      image: "https://picsum.photos/seed/user2/200/300",
      contributions: 1500,
    },
    {
      username: "user3",
      image: "https://picsum.photos/seed/user3/200/300",
      contributions: 1800,
    },
    {
      username: "user4",
      image: "https://picsum.photos/seed/user4/200/300",
      contributions: 2200,
    },
  ]
  const contentRanking: ContentRanking[] = [
    {
      title: "Python",
      image: "https://picsum.photos/seed/python/200/300",
      user: "1000 users",
    },
    {
      title: "JavaScript",
      image: "https://picsum.photos/seed/javascript/200/300",
      user: "2000 users",
    },
    {
      title: "Java",
      image: "https://picsum.photos/seed/java/200/300",
      user: "1500 users",
    },
    {
      title: "C++",
      image: "https://picsum.photos/seed/cpp/200/300",
      user: "800 users",
    },
    {
      title: "Ruby",
      image: "https://picsum.photos/seed/ruby/200/300",
      user: "600 users",
    },
    {
      title: "Go",
      image: "https://picsum.photos/seed/go/200/300",
      user: "1200 users",
    },
    {
      title: "Swift",
      image: "https://picsum.photos/seed/swift/200/300",
      user: "900 users",
    },
    {
      title: "PHP",
      image: "https://picsum.photos/seed/php/200/300",
      user: "1300 users",
    },
    {
      title: "Rust",
      image: "https://picsum.photos/seed/rust/200/300",
      user: "700 users",
    },
    {
      title: "Kotlin",
      image: "https://picsum.photos/seed/kotlin/200/300",
      user: "1100 users",
    },
  ];

  return (
    <Navigation>
      <div className="bg-gray-100 py-50">
        
        <div className="flex justify-between max-w-8xl mx-auto ml-5">

          {/* Left */}
          <div className="hidden lg:block w-1/6">

          {/* top Ranking */}

          <div className="bg-white border-b">
            <h3 className="text-xl mt-6
            text-gray-400
            ">Top Ranking</h3>
            {contentRanking.map((content) => (
              <div className="flex items-center mt-3">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="ml-2">
                  <h4 className="text-lg font-semibold">{content.title}</h4>
                  <p className="text-sm text-gray-600">{content.user}</p>
                </div>
              </div>
            ))}
          </div>

          {/* User Ranking */}
          <div>
            <h3 className="text-xl text-gray-400 mt-6">User Ranking</h3>
            {userRanking.map((user) => (
              <div className="flex items-center mt-3">
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="ml-2">
                  <h4 className="text-lg font-semibold">{user.username}</h4>
                  <p className="text-sm text-gray-600">{user.contributions} contributions</p>
                </div>
              </div>
            ))}

            </div>


          </div>

          {/* Center */}
          <div className="w-full lg:max-w-[800px] px-4 sm:px-6 lg:px-8 bg-white">
          </div>

          {/* Right */}
          <div className="hidden lg:block w-1/3">
          right
          </div>
        </div>
      </div>
    </Navigation>
  );
};