const memberService = require("./projectMembers.service");

const getMembers = async (req, res, next) => {
  try {
    const dataList = await memberService.getMembers(req.params);

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: dataList,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMembers };
