import React, { useState, useEffect } from 'react'
import NewPost from './NewPost'
import PostService from '../../services/PostService'
import { Post } from './types'
import { 
  HandThumbUpIcon, 
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline'


function PostItem() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <span className="font-bold">Nash</span>
        <span className="text-sm text-gray-500">@flowfree</span>
      </div>
      <div className="mt-1 text-sm text-gray-900">
        Today we announced our partnership with Adobe to add the NVIDIA Picasso generativeAI 
        capabilities to the Adobe Creative Cloud. This will accelerate the 3D, video, and 
        graphics production for artists with the assurance of their credentials managed through 
        the Content Authenticity Initiative️ - https://nvda.ws/3LD62oB
      </div>
      <div className="flex">
        <div className="flex-1 flex items-center gap-1">
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-700 hover:bg-blue-100">
            <HandThumbUpIcon className="w-5 h-5" /> 
          </button>
          <span className="text-gray-500 text-sm">100</span>
        </div>
        <div className="flex-1 flex items-center gap-1">
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-700 hover:bg-blue-100">
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> 
          </button>
          <span className="text-gray-500 text-sm">200</span>
        </div>
        <div className="flex-1 flex items-center gap-1">
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-700 hover:bg-blue-100">
            <HeartIcon className="w-5 h-5" />
          </button>
          <span className="text-gray-500 text-sm">300</span>
        </div>
      </div>
    </div>
  )
}


export default function Feed() {
  useEffect(() => {
    getSamplePost()
  }, [])

  async function getSamplePost() {
    const postService = new PostService()
    try {
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <NewPost />
      <div>
        <PostItem />
      </div>
    </div>
  )
}
