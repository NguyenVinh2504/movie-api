import { commentModel } from '~/models/commentModel'

const addComment = async (req) => {
  const { movieId, movieType, content } = req.body
  const userId = req.user._id
  const newComment = await commentModel.createComment({ movieId, userId, content, movieType })
  // Lấy danh sách bình luận mới nhất
  // const listComments = await commentModel.getCommentsByMovieId({ movieId, movieType, limit: 10, page: 1 })
  // // Phát sự kiện qua socket đến tất cả client trong room
  // req.io.to(movieId).emit('newComment', listComments)
  // listIdSocket[userId]?.emit('newComment', listComments)
  return newComment
}

const getCommentsByMovieId = async ({ movieId, movieType, limit, page }) => {
  const listComments = await commentModel.getCommentsByMovieId({ movieId, movieType, limit, page })
  const total = await commentModel.countDocument({ movieId, movieType })
  return {
    listComments,
    total
  }
}
export const commentService = {
  addComment,
  getCommentsByMovieId
}
