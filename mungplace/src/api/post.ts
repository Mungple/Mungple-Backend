import { ImageUri, Post } from '@/types';
import axiosInstance from './axios';

// Post 타입에 이미지 리스트(images)를 추가한 타입 정의
type ResponsePost = Post & {images: ImageUri[]};

// 연도와 월별로 가져온 캘린더 게시물 리스트를 저장하는 타입 정의
type ResponseCalendarPost = Record<number, CalendarPost[]>;

// ResponsePost에 좋아요 여부 속성을 추가한 타입 정의
type ResponseSinglePost = ResponsePost & {isFavorite: boolean};

// 게시물을 생성하기 위한 요청 바디 타입 정의
type RequestCreatePost = Omit<Post, 'id'> & {imageUris: ImageUri[]};

// 게시물 업데이트를 위한 요청 타입 정의
type RequestUpdatePost = {
  id: number;
  body: Omit<Post, 'id' | 'longitude' | 'latitude' | 'address'> & {
    imageUris: ImageUri[];
  };
};

// 캘린더에 표시할 게시물 타입 정의
type CalendarPost = {
  id: number;
  title: string;
  address: string;
};

// 게시물 리스트를 페이징 방식으로 가져오는 함수
const getPosts = async (page = 1): Promise<ResponsePost[]> => {
  const {data} = await axiosInstance.get(`/posts/my?page=${page}`);
  return data;
};

// 게시물을 생성하는 함수
const createPost = async (body: RequestCreatePost): Promise<ResponsePost> => {
  const {data} = await axiosInstance.post('/posts', body);
  return data;
};

// 특정 ID의 게시물을 가져오는 함수
const getPost = async (id: number): Promise<ResponseSinglePost> => {
  const {data} = await axiosInstance.get(`/posts/${id}`);
  return data;
};

// 특정 ID의 게시물을 삭제하는 함수
const deletePost = async (id: number) => {
  const {data} = await axiosInstance.delete(`/posts/${id}`);
  return data;
};

// 특정 ID의 게시물을 업데이트하는 함수
const updatePost = async ({id, body}: RequestUpdatePost): Promise<ResponseSinglePost> => {
  const {data} = await axiosInstance.patch(`/posts/${id}`, body);
  return data;
};

// 검색어에 맞는 게시물 리스트를 페이징 방식으로 가져오는 함수
const getSearchPosts = async (
  page = 1,
  query: string,
): Promise<ResponsePost[]> => {
  const {data} = await axiosInstance.get(
    `/posts/my/search?query=${query}&page=${page}`,
  );
  return data;
};

// 연도와 월별로 캘린더 게시물 리스트를 가져오는 함수
const getCalendarPosts = async (
  year: number,
  month: number,
): Promise<ResponseCalendarPost> => {
  const {data} = await axiosInstance.get(`/posts?year=${year}&month=${month}`);
  return data;
};

export {
  createPost,
  deletePost, getCalendarPosts, getPost,
  getPosts, getSearchPosts, updatePost
};
export type {
  CalendarPost, RequestCreatePost,
  RequestUpdatePost, ResponseCalendarPost, ResponsePost, ResponseSinglePost
};

