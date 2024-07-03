const postsController = {
  // tên controller
  getPost: (req,res) => { return res.json({"mess":"OK"})},
  postPostSort: (req,res) => { return res.send("Đã get PostSort")},
};
module.exports = postsController;
