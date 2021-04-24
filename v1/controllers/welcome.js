const home = (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "WELCOME STUDYPADI API V1", data: {} });
};

module.exports = home;
