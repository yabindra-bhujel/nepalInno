import React from "react";
import { Comments } from "../types/BlogType";

export const CommentList = (
    comments: Comments[] | undefined,
) => {
return (
  <>
    {comments && (
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Comments</h2>
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="flex space-x-4 items-center">
                <img
                  src={`https://picsum.photos/seed/comment${index}/40`}
                  alt={comment.author.image}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {comment.author.name}
                  </p>
                  <p className="text-sm text-gray-500">{comment.date}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);
}