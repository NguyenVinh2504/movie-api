import { commentModel } from '~/models/commentModel'

const addComment = async (req, res) => {
  const { movieId, movieType, content } = req.body

  const userId = req.user._id
  const newComment = await commentModel.createComment({ movieId, userId, content, movieType })
  // Lấy danh sách bình luận mới nhất
  const listComments = await commentModel.getCommentsByMovieId({ movieId, movieType })
  // Phát sự kiện qua socket đến tất cả client
  req.io.to(movieId).emit('newComment', listComments)
  return newComment
}

const getCommentsByMovieId = async (req) => {
  const { movieId, movieType } = req.params

  const listComments = await commentModel.getCommentsByMovieId({ movieId, movieType })
  return listComments
}
export const commentService = {
  addComment,
  getCommentsByMovieId
}
